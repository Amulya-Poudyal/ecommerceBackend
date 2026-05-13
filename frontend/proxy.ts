import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = ["/cart", "/checkout", "/orders", "/account"];
const ADMIN_PATHS = ["/dashboard"];
const AUTH_PATHS = ["/login", "/register"];

function isProtected(p: string) { return PROTECTED_PATHS.some((x) => p.startsWith(x)); }
function isAdminPath(p: string) { return ADMIN_PATHS.some((x) => p.startsWith(x)); }
function isAuthPage(p: string) { return AUTH_PATHS.some((x) => p.startsWith(x)); }

function decodeJwtPayload(token: string): { id: number; is_admin?: boolean } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64url").toString("utf-8");
    return JSON.parse(payload);
  } catch { return null; }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const isLoggedIn = !!payload;
  const isAdmin = payload?.is_admin ?? false;

  if (isAuthPage(pathname) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (isProtected(pathname) && !isLoggedIn) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
  if (isAdminPath(pathname)) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", request.url));
    if (!isAdmin) return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
