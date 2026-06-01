import { NextResponse } from "next/server";

const AUTH_COOKIE = "sp_auth";

// Protect the designer areas. Client rating links (/r/...) stay public.
export function middleware(req) {
  const hasCookie = !!req.cookies.get(AUTH_COOKIE)?.value;
  if (!hasCookie) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", req.nextUrl.pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
