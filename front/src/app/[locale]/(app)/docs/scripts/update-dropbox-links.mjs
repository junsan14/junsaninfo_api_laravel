import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const API_BASE = "https://api.dropboxapi.com/2";
const JSON_FILES = ["html.json", "css.json", "js.json", "php.json", "react.json"];
const SUPPORTED_EXTENSIONS = new Set([
  ".pptx", ".ppt", ".pdf", ".html", ".htm", ".css", ".js", ".jsx", ".php",
]);

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has("--dry-run");
const NO_BACKUP = args.has("--no-backup");

const scriptFile = fileURLToPath(import.meta.url);
const scriptDir = path.dirname(scriptFile);
const docsDir = path.resolve(scriptDir, "..");
const projectRoot = process.cwd();

await loadEnvFile(path.join(projectRoot, ".env.local"));
await loadEnvFile(path.join(projectRoot, ".env"), { onlyMissing: true });

const accessToken = process.env.DROPBOX_ACCESS_TOKEN?.trim();
const dropboxRoot = normalizeDropboxRoot(process.env.DROPBOX_ROOT || "");

if (!accessToken) {
  fail(
    "DROPBOX_ACCESS_TOKEN がありません。プロジェクト直下の .env.local に設定してください。"
  );
}

console.log("\nDropbox教材リンク更新");
console.log("======================");
console.log(`Dropbox folder : ${dropboxRoot || "/ (root)"}`);
console.log(`Docs folder    : ${docsDir}`);
console.log(`Mode           : ${DRY_RUN ? "DRY RUN" : "WRITE"}`);

const dropboxEntries = await listAllDropboxFiles(dropboxRoot);
const dropboxFiles = dropboxEntries
  .filter((entry) => entry[".tag"] === "file")
  .filter((entry) => SUPPORTED_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => ({
    ...entry,
    extension: path.extname(entry.name).toLowerCase(),
    stem: path.basename(entry.name, path.extname(entry.name)),
  }));

console.log(`Dropbox files : ${dropboxFiles.length}`);

if (dropboxFiles.length === 0) {
  fail("対象ファイルがDropboxフォルダ内に見つかりませんでした。DROPBOX_ROOTを確認してください。");
}

const index = buildFileIndex(dropboxFiles);
const report = {
  generatedAt: new Date().toISOString(),
  dropboxRoot: dropboxRoot || "/",
  dryRun: DRY_RUN,
  dropboxFileCount: dropboxFiles.length,
  updated: [],
  unchanged: [],
  unmatched: [],
  ambiguous: [],
  errors: [],
};

let backupDir = null;
if (!DRY_RUN && !NO_BACKUP) {
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  backupDir = path.join(scriptDir, ".backup", stamp);
  await fs.mkdir(backupDir, { recursive: true });
}

for (const jsonName of JSON_FILES) {
  const jsonPath = path.join(docsDir, jsonName);

  let raw;
  try {
    raw = await fs.readFile(jsonPath, "utf8");
  } catch (error) {
    report.errors.push({ file: jsonName, error: `JSON read failed: ${error.message}` });
    console.warn(`⚠ ${jsonName}: 読み込めませんでした`);
    continue;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch (error) {
    report.errors.push({ file: jsonName, error: `Invalid JSON: ${error.message}` });
    console.warn(`⚠ ${jsonName}: JSONとして解析できませんでした`);
    continue;
  }

  const leaves = [];
  collectMaterialLeaves(data, leaves, []);
  let changedCount = 0;

  for (const leaf of leaves) {
    const expectedExt = expectedExtension(leaf.value.format);
    const match = findBestMatch(leaf.value.name, expectedExt, index);

    if (match.status === "unmatched") {
      report.unmatched.push({
        json: jsonName,
        name: leaf.value.name,
        expectedExtension: expectedExt || null,
      });
      continue;
    }

    if (match.status === "ambiguous") {
      report.ambiguous.push({
        json: jsonName,
        name: leaf.value.name,
        candidates: match.candidates.map((f) => f.path_display || f.name),
      });
      continue;
    }

    const dbxFile = match.file;

    try {
      const sharedUrl = await getPreviewSharedLink(dbxFile.path_lower, { create: !DRY_RUN });

      if (!sharedUrl) {
        report.unmatched.push({
          json: jsonName,
          name: leaf.value.name,
          matchedDropboxFile: dbxFile.path_display || dbxFile.name,
          reason: "共有リンク未作成（dry-run）",
        });
        continue;
      }

      if (leaf.value.url === sharedUrl) {
        report.unchanged.push({
          json: jsonName,
          name: leaf.value.name,
          url: sharedUrl,
        });
        continue;
      }

      report.updated.push({
        json: jsonName,
        name: leaf.value.name,
        dropboxFile: dbxFile.path_display || dbxFile.name,
        oldUrl: leaf.value.url || null,
        newUrl: sharedUrl,
      });

      if (!DRY_RUN) {
        leaf.value.url = sharedUrl;
        changedCount += 1;
      }
    } catch (error) {
      report.errors.push({
        json: jsonName,
        name: leaf.value.name,
        dropboxFile: dbxFile.path_display || dbxFile.name,
        error: error.message,
      });
    }
  }

  if (!DRY_RUN && changedCount > 0) {
    if (backupDir) {
      await fs.writeFile(path.join(backupDir, jsonName), raw, "utf8");
    }

    await fs.writeFile(jsonPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
  }

  console.log(`✓ ${jsonName}: ${leaves.length}教材 / ${changedCount}件更新`);
}

const reportPath = path.join(scriptDir, "dropbox-link-report.json");
await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");

console.log("\n結果");
console.log("----");
console.log(`更新候補/更新済み : ${report.updated.length}`);
console.log(`変更なし           : ${report.unchanged.length}`);
console.log(`未一致             : ${report.unmatched.length}`);
console.log(`候補複数           : ${report.ambiguous.length}`);
console.log(`API/処理エラー     : ${report.errors.length}`);
console.log(`Report             : ${reportPath}`);
if (backupDir) console.log(`Backup             : ${backupDir}`);

if (report.unmatched.length || report.ambiguous.length || report.errors.length) {
  console.log("\n※ 未一致・候補複数・エラーはJSONを書き換えず、reportに残しています。");
}

if (DRY_RUN) {
  console.log("\nDRY RUNなのでJSON変更・新規共有リンク作成はしていません。");
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
  const entries = [];
  let result = await dropboxApi("files/list_folder", {
    path: root,
    recursive: true,
    include_deleted: false,
    include_non_downloadable_files: false,
    limit: 2000,
  });

  entries.push(...result.entries);

  while (result.has_more) {
    result = await dropboxApi("files/list_folder/continue", {
      cursor: result.cursor,
    });
    entries.push(...result.entries);
  }

  return entries;
}

async function getPreviewSharedLink(dropboxPath, { create }) {
  const existing = await dropboxApi("sharing/list_shared_links", {
    path: dropboxPath,
    direct_only: true,
  });

  const directLink = existing.links?.find((link) => link.url)?.url;
  if (directLink) return toPreviewUrl(directLink);
  if (!create) return null;

  try {
    const created = await dropboxApi("sharing/create_shared_link_with_settings", {
      path: dropboxPath,
    });
    return toPreviewUrl(created.url);
  } catch (error) {
    const tag = error.payload?.error?.[".tag"];
    if (tag === "shared_link_already_exists") {
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

function buildFileIndex(files) {
  const strict = new Map();
  const relaxed = new Map();

  for (const file of files) {
    addIndex(strict, normalizeName(file.stem), file);
    addIndex(relaxed, normalizeNameRelaxed(file.stem), file);
  }

  return { files, strict, relaxed };
}

function addIndex(map, key, file) {
  if (!key) return;
  if (!map.has(key)) map.set(key, []);
  map.get(key).push(file);
}

function findBestMatch(materialName, expectedExt, index) {
  const strictKey = normalizeName(materialName);
  const relaxedKey = normalizeNameRelaxed(materialName);

  const strictCandidates = preferExtension(index.strict.get(strictKey) || [], expectedExt);
  if (strictCandidates.length === 1) return { status: "matched", file: strictCandidates[0] };
  if (strictCandidates.length > 1) return { status: "ambiguous", candidates: strictCandidates };

  const relaxedCandidates = preferExtension(index.relaxed.get(relaxedKey) || [], expectedExt);
  if (relaxedCandidates.length === 1) return { status: "matched", file: relaxedCandidates[0] };
  if (relaxedCandidates.length > 1) return { status: "ambiguous", candidates: relaxedCandidates };

  // 最終フォールバック: 一方が他方を完全包含し、候補が一意の場合だけ採用する。
  const containment = preferExtension(
    index.files.filter((file) => {
      const fileKey = normalizeNameRelaxed(file.stem);
      if (!fileKey || !relaxedKey) return false;
      if (Math.min(fileKey.length, relaxedKey.length) < 8) return false;
      return fileKey.includes(relaxedKey) || relaxedKey.includes(fileKey);
    }),
    expectedExt
  );

  if (containment.length === 1) return { status: "matched", file: containment[0] };
  if (containment.length > 1) return { status: "ambiguous", candidates: containment };

  return { status: "unmatched" };
}

function preferExtension(candidates, expectedExt) {
  if (!expectedExt || candidates.length <= 1) return candidates;
  const filtered = candidates.filter((file) => file.extension === expectedExt);
  return filtered.length ? filtered : candidates;
}

function expectedExtension(format) {
  if (!format) return null;
  const value = String(format).trim().toLowerCase();
  if (value === "html") return ".html";
  if (value === "css") return ".css";
  if (value === "js") return ".js";
  if (value === "jsx") return ".jsx";
  if (value === "php") return ".php";
  if (value === "pdf") return ".pdf";
  if (value === "ppt") return ".ppt";
  if (value === "pptx") return ".pptx";
  return null;
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLowerCase()
    .replace(/javascript/g, "js")
    .replace(/typescript/g, "ts")
    .replace(/next\.?\s*js/g, "nextjs")
    .replace(/react\.?\s*js/g, "reactjs")
    .replace(/&/g, "and")
    .replace(/[^\p{L}\p{N}]+/gu, "");
}

function normalizeNameRelaxed(value) {
  return normalizeName(
    String(value || "")
      .replace(/^\s*\d+(?:\.\d+)*\s*[-_.:)]*\s*/, "")
      .replace(/\[(.*?)\]/g, " $1 ")
  );
}

function collectMaterialLeaves(node, output, trail) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectMaterialLeaves(item, output, [...trail, index]));
    return;
  }

  if (!node || typeof node !== "object") return;

  if (typeof node.name === "string" && Object.prototype.hasOwnProperty.call(node, "url")) {
    output.push({ value: node, trail });
    return;
  }

  Object.entries(node).forEach(([key, value]) => {
    collectMaterialLeaves(value, output, [...trail, key]);
  });
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
    const index = trimmed.indexOf("=");
    if (index < 1) continue;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
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
