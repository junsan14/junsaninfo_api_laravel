// src/app/api/regime/pdf/route.js

import { cookies } from "next/headers";
import { get } from "@vercel/blob";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PDF_PATHNAME = "documents/rirekisyo.pdf";

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

  try {
    const result = await get(PDF_PATHNAME, {
      access: "private",
    });

    if (!result || result.statusCode !== 200) {
      return Response.json(
        {
          ok: false,
          message: "履歴書PDFが見つかりません",
        },
        {
          status: 404,
        }
      );
    }

    return new Response(result.stream, {
      status: 200,
      headers: {
        "Content-Type":
          result.blob.contentType || "application/pdf",
        "Content-Disposition":
          'inline; filename="rirekisyo.pdf"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("PDF loading error:", error);

    return Response.json(
      {
        ok: false,
        message: "履歴書PDFを読み込めませんでした",
        error:
          process.env.NODE_ENV === "development"
            ? error.message
            : undefined,
      },
      {
        status: 500,
      }
    );
  }
}