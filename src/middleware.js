import { NextResponse } from "next/server";

const ALLOWED_ROLES = new Set(["admin", "supervisor", "recaudador", "tesorero"]);

export function middleware(req) {
  const url = req.nextUrl;
  const token = req.cookies.get("token")?.value || null;
  const role = req.cookies.get("role")?.value || null;

  // 1) Bloquear si no hay token
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!role || !ALLOWED_ROLES.has(role)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
