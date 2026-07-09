// src/app/api/regime-auth/route.js

import { NextResponse } from "next/server";

export async function POST(request) {
  const { password } = await request.json();

  if (password === process.env.REGIME_PASSWORD) {
    const response = NextResponse.json({ ok: true });

    response.cookies.set("regime-auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  }

  return NextResponse.json({ ok: false }, { status: 401 });
}