import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();

  const isAuthenticated =
    cookieStore.get("regime-auth")?.value === "true";

  return NextResponse.json({
    ok: isAuthenticated,
  });
}

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (password !== process.env.REGIME_PASSWORD) {
      return NextResponse.json(
        {
          ok: false,
          message: "パスワードが違います",
        },
        {
          status: 401,
        }
      );
    }

    const response = NextResponse.json({
      ok: true,
    });

    response.cookies.set("regime-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Regime authentication error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "認証処理に失敗しました",
      },
      {
        status: 500,
      }
    );
  }
}