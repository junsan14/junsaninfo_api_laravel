import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const API_BASE = "https://api.dropboxapi.com/2";

// Dropbox root (/junsan-info) 直下で対象にする教材フォルダ
const TARGET_COURSE_FOLDERS = [
  "01_WebsiteDev",
  "02_JavaScript",
  "02_PHP",
  "03_React",
];

const DOCS_FOLDER_NAME = "02_docs";

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");

const __filename = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(__filename);
const projectRoot = process.cwd();

await loadEnvFile(path.join(projectRoot, ".env.local"));
await loadEnvFile(path.join(projectRoot, ".env"), { onlyMissing: true });

const accessToken = process.env.DROPBOX_ACCESS_TOKEN?.trim();
const dropboxRoot = normalizeDropboxRoot(process.env.DROPBOX_ROOT || "/junsan-info");

if (!accessToken) {
  fail(
    "DROPBOX_ACCESS_TOKEN がありません。プロジェクト直下の .env.local に設定してください。"
  );
}

console.log("\nDropbox プレビューURL一覧取得");
console.log("================================");
console.log(`Dropbox root : ${dropboxRoot || "/ (root)"}`);
console.log(`Mode         : ${DRY_RUN ? "DRY RUN (新規共有リンクは作成しない)" : "NORMAL"}`);
console.log(`Targets      : ${TARGET_COURSE_FOLDERS.join(", ")}`);

const entries = await listAllDropboxFiles(dropboxRoot);
const targetFiles = entries
  .filter((entry) => entry[".tag"] === "file")
  .map(toTargetFileInfo)
  .filter(Boolean)
  .sort((a, b) =>
    a.course.localeCompare(b.course, "en", { numeric: true }) ||
    a.outcome.localeCompare(b.outcome, "en", { numeric: true }) ||
    a.name.localeCompare(b.name, "en", { numeric: true })
  );

console.log(`対象ファイル数 : ${targetFiles.length}`);

if (targetFiles.length === 0) {
  fail(
    `対象ファイルが見つかりませんでした。${TARGET_COURSE_FOLDERS.join(
      ", "
    )} の各 ${DOCS_FOLDER_NAME} 配下を確認してください。`
  );
}

const results = [];
const errors = [];

for (let i = 0; i < targetFiles.length; i += 1) {
  const file = targetFiles[i];

  try {
    const previewUrl = await getPreviewSharedLink(file.pathLower, {
      create: !DRY_RUN,
    });

    results.push({
      course: file.course,
      docsFolder: DOCS_FOLDER_NAME,
      outcome: file.outcome,
      relativeFolder: file.relativeFolder,
      fileName: file.name,
      extension: path.extname(file.name).toLowerCase(),
      dropboxPath: file.pathDisplay,
      previewUrl: previewUrl || "",
      status: previewUrl ? "ok" : "no_shared_link",
    });

    console.log(
      `[${String(i + 1).padStart(3, " ")}/${targetFiles.length}] ${file.course} / ${file.outcome} / ${file.name}${
        previewUrl ? " ✓" : " (共有リンクなし)"
      }`
    );
  } catch (error) {
    errors.push({
      course: file.course,
      outcome: file.outcome,
      fileName: file.name,
      dropboxPath: file.pathDisplay,
      error: error.message,
    });

    console.warn(
      `[${String(i + 1).padStart(3, " ")}/${targetFiles.length}] ${file.name} ⚠ ${error.message}`
    );
  }
}

const outputDir = path.join(scriptDir, "dropbox-preview-output");
await fs.mkdir(outputDir, { recursive: true });

const jsonPath = path.join(outputDir, "dropbox-preview-links.json");
const csvPath = path.join(outputDir, "dropbox-preview-links.csv");
const errorPath = path.join(outputDir, "dropbox-preview-errors.json");

await fs.writeFile(
  jsonPath,
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      dropboxRoot: dropboxRoot || "/",
      dryRun: DRY_RUN,
      targets: TARGET_COURSE_FOLDERS,
      count: results.length,
      items: results,
    },
    null,
    2
  )}\n`,
  "utf8"
);

await fs.writeFile(csvPath, toCsv(results), "utf8");
await fs.writeFile(
  errorPath,
  `${JSON.stringify(errors, null, 2)}\n`,
  "utf8"
);

console.log("\n完了");
console.log("----");
console.log(`取得成功 : ${results.filter((item) => item.previewUrl).length}`);
console.log(`共有リンクなし : ${results.filter((item) => !item.previewUrl).length}`);
console.log(`エラー   : ${errors.length}`);
console.log(`JSON     : ${jsonPath}`);
console.log(`CSV      : ${csvPath}`);
console.log(`Errors   : ${errorPath}`);

if (DRY_RUN) {
  console.log(
    "\n※ DRY RUNでは既存の共有リンクだけ取得します。未作成のファイルにはプレビューURLが付きません。"
  );
  console.log("  本実行では --dry-run を外してください。");
}

function toTargetFileInfo(entry) {
  const display = entry.path_display || entry.path_lower || "";
  const lower = entry.path_lower || display.toLowerCase();

  const displayParts = display.split("/").filter(Boolean);
  const lowerParts = lower.split("/").filter(Boolean);

  const docsIndex = lowerParts.findIndex(
    (part) => part.toLowerCase() === DOCS_FOLDER_NAME.toLowerCase()
  );

  if (docsIndex < 1) return null;

  const course = displayParts[docsIndex - 1];
  const isTargetCourse = TARGET_COURSE_FOLDERS.some(
    (target) => target.toLowerCase() === course.toLowerCase()
  );

  if (!isTargetCourse) return null;

  // /course/02_docs/outcome1 .../file.pptx を想定
  // 02_docs 直下のファイルも念のため拾う。
  const afterDocs = displayParts.slice(docsIndex + 1);
  if (afterDocs.length === 0) return null;

  const name = afterDocs.at(-1);
  const folderParts = afterDocs.slice(0, -1);
  const outcome = folderParts[0] || "(02_docs直下)";
  const relativeFolder = folderParts.join("/") || ".";

  return {
    course,
    outcome,
    relativeFolder,
    name,
    pathDisplay: display,
    pathLower: entry.path_lower,
  };
}

async function dropboxApi(route, body) {
  const response = await fetch(`${API_BASE}/${route}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { raw: text };
    }
  }

  if (!response.ok) {
    const summary =
      payload?.error_summary ||
      payload?.error?.[".tag"] ||
      payload?.raw ||
      `${response.status} ${response.statusText}`;

    const error = new Error(`Dropbox API ${route}: ${summary}`);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

async function listAllDropboxFiles(root) {
  const allEntries = [];

  let result = await dropboxApi("files/list_folder", {
    path: root,
    recursive: true,
    include_deleted: false,
    include_non_downloadable_files: false,
    limit: 2000,
  });

  allEntries.push(...result.entries);

  while (result.has_more) {
    result = await dropboxApi("files/list_folder/continue", {
      cursor: result.cursor,
    });
    allEntries.push(...result.entries);
  }

  return allEntries;
}

async function getPreviewSharedLink(dropboxPath, { create }) {
  const existing = await dropboxApi("sharing/list_shared_links", {
    path: dropboxPath,
    direct_only: true,
  });

  const existingUrl = existing.links?.find((link) => link.url)?.url;
  if (existingUrl) return toPreviewUrl(existingUrl);

  if (!create) return null;

  try {
    const created = await dropboxApi(
      "sharing/create_shared_link_with_settings",
      { path: dropboxPath }
    );

    return toPreviewUrl(created.url);
  } catch (error) {
    // すでにリンクがあるケースでは再取得
    const tag = error.payload?.error?.[".tag"];
    const summary = error.payload?.error_summary || "";

    if (tag === "shared_link_already_exists" || summary.includes("shared_link_already_exists")) {
      const retry = await dropboxApi("sharing/list_shared_links", {
        path: dropboxPath,
        direct_only: true,
      });

      const url = retry.links?.find((link) => link.url)?.url;
      if (url) return toPreviewUrl(url);
    }

    throw error;
  }
}

function toPreviewUrl(input) {
  try {
    const url = new URL(input);
    url.searchParams.delete("raw");
    url.searchParams.set("dl", "0");
    return url.toString();
  } catch {
    return input;
  }
}

function toCsv(items) {
  const headers = [
    "course",
    "outcome",
    "relativeFolder",
    "fileName",
    "extension",
    "dropboxPath",
    "previewUrl",
    "status",
  ];

  const lines = [headers.join(",")];

  for (const item of items) {
    lines.push(headers.map((key) => csvEscape(item[key] ?? "")).join(","));
  }

  // Excelでも文字化けしにくいようBOM付きUTF-8
  return `\uFEFF${lines.join("\n")}\n`;
}

function csvEscape(value) {
  const text = String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function normalizeDropboxRoot(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed || trimmed === "/") return "";
  return `/${trimmed.replace(/^\/+|\/+$/g, "")}`;
}

async function loadEnvFile(filePath, { onlyMissing = false } = {}) {
  let text;

  try {
    text = await fs.readFile(filePath, "utf8");
  } catch {
    return;
  }

  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex < 1) continue;

    const key = trimmed.slice(0, equalsIndex).trim();
    let value = trimmed.slice(equalsIndex + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (onlyMissing && process.env[key]) continue;
    if (!process.env[key]) process.env[key] = value;
  }
}

function fail(message) {
  console.error(`\nERROR: ${message}\n`);
  process.exit(1);
}
