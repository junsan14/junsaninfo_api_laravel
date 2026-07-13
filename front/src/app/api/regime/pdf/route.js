// src/app/api/regime/pdf/route.js

import { cookies } from "next/headers";
import fs from "fs/promises";
import path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const cookieStore = await cookies();

  const isAuthenticated =
    cookieStore.get("regime-auth")?.value === "true";

  if (!isAuthenticated) {
    return Response.json(
      {
        ok: false,
        message: "認証が必要です",
      },
      {
        status: 401,
      }
    );
  }

  const filePath = path.join(
    process.cwd(),
    "src",
    "private",
    "documents",
    "rirekisyo.pdf"
  );

  try {
    console.log("PDF path:", filePath);

    await fs.access(filePath);

    const pdfBuffer = await fs.readFile(filePath);

    return new Response(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition":
          'inline; filename="rirekisyo.pdf"',
        "Cache-Control":
          "private, no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("PDF loading error:", {
      message: error.message,
      code: error.code,
      path: filePath,
    });

    return Response.json(
      {
        ok: false,
        message: "履歴書PDFを読み込めませんでした",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
        code:
          process.env.NODE_ENV === "development"
            ? error.code
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}