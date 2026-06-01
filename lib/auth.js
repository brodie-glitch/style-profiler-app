import { cookies } from "next/headers";

export const AUTH_COOKIE = "sp_auth";

// Lightweight gate: the cookie holds the admin password (httpOnly). Fine for a
// single-designer tool. For multi-user, swap in a real auth provider.
export function isAuthed() {
  const c = cookies().get(AUTH_COOKIE);
  return !!c && !!process.env.ADMIN_PASSWORD && c.value === process.env.ADMIN_PASSWORD;
}
