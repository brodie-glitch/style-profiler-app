import { NextResponse } from "next/server";
import { AUTH_COOKIE } from "../../../lib/auth";

export async function POST(req) {
  const { password } = await req.json().catch(() => ({}));
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "ADMIN_PASSWORD not set on server." }, { status: 500 });
  }
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, password, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
