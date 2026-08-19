import { NextResponse, type NextRequest } from "next/server";
import { getAuthSecret, isAuthConfigured, readSessionToken, SESSION_COOKIE } from "@/lib/auth-session";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/logout", "/api/health", "/robots.txt"];

function isPublic(pathname: string) {
  if (PUBLIC_PATHS.includes(pathname)) return true;
  if (pathname.startsWith("/brand/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  if (!isAuthConfigured()) {
    if (process.env.VERCEL || process.env.NODE_ENV === "production") {
      const login = new URL("/login", request.url);
      login.searchParams.set("error", "unconfigured");
      return NextResponse.redirect(login);
    }
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await readSessionToken(token, getAuthSecret()) : null;

  if (!session) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ ok: false, error: "Não autenticado." }, { status: 401 });
    }
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
