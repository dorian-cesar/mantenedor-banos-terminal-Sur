// middleware.js
import { NextResponse } from "next/server";

const DEFAULT_ALLOWED = new Set(["admin", "supervisor", "recaudador", "tesorero"]);

// IMPORTANTE: el orden importa (rutas más específicas ANTES que las genéricas)
const ACCESS_RULES = [
  // --- SERVICIOS ---
  { pattern: /^\/dashboard\/servicios\/new\/?$/, allow: new Set(["admin"]) },                // SOLO admin
  { pattern: /^\/dashboard\/servicios\/[^/]+\/?$/, allow: new Set(["admin", "tesorero"]) },  // admin + tesorero (/:id)

  // --- USERS ---
  { pattern: /^\/dashboard\/users\/new\/?$/, allow: new Set(["admin", "tesorero"]) },        // admin + tesorero
  { pattern: /^\/dashboard\/users\/[^/]+\/?$/, allow: new Set(["admin", "tesorero"]) },      // admin + tesorero (/:id)

  // --- FOLIOS ---
  { pattern: /^\/dashboard\/folios\/?$/, allow: new Set(["admin", "tesorero"]) },            // admin + tesorero

  // --- CAJAS ---
  { pattern: /^\/dashboard\/cajas\/new\/?$/, allow: new Set(["admin"]) },                    // SOLO admin
  { pattern: /^\/dashboard\/cajas\/[^/]+\/?$/, allow: new Set(["admin"]) },                  // SOLO admin (/:id)

  // --- MOVIMIENTOS ---
  { pattern: /^\/dashboard\/movimientos\/new\/?$/, allow: new Set(["admin"]) },              // SOLO admin
  { pattern: /^\/dashboard\/movimientos\/[^/]+\/?$/, allow: new Set(["admin"]) },            // SOLO admin (/:id)

    // --- CIERRES ---
    { pattern: /^\/dashboard\/cierres\/new\/?$/, allow: new Set(["admin"]) },              // SOLO admin
    { pattern: /^\/dashboard\/cierres\/[^/]+\/?$/, allow: new Set(["admin"]) },            // SOLO admin (/:id)
];

function matchRule(pathname) {
  return ACCESS_RULES.find((r) => r.pattern.test(pathname));
}

function deniedRedirectFor(pathname, req) {
  const url = req.nextUrl.clone();

  if (pathname.startsWith("/dashboard/cajas/")) {
    url.pathname = "/dashboard/cajas";
  } else if (pathname.startsWith("/dashboard/movimientos/")) {
    url.pathname = "/dashboard/movimientos";
  } else if (pathname.startsWith("/dashboard/cierres/")) {
    url.pathname = "/dashboard/cierres";
  } else if (pathname.startsWith("/dashboard/servicios/")) {
    url.pathname = "/dashboard/servicios";
  } else if (pathname.startsWith("/dashboard/users/")) {
    url.pathname = "/dashboard/users";
  } else if (pathname.startsWith("/dashboard/folios")) {
    url.pathname = "/dashboard";
  } else {
    url.pathname = "/dashboard";
  }

  url.searchParams.set("denied", "1");
  return NextResponse.redirect(url);
}

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("token")?.value || null;
  const role = (req.cookies.get("role")?.value || "").toLowerCase();

  // 1) Debe estar logueado
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 2) Roles base que pueden entrar a /dashboard/**
  if (!role || !DEFAULT_ALLOWED.has(role)) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 3) Reglas específicas (si hay match, valida el allow)
  const rule = matchRule(pathname);
  if (rule && !rule.allow.has(role)) {
    return deniedRedirectFor(pathname, req);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
