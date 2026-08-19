import { createHash, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { createSessionToken, getAuthSecret, isAuthConfigured, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth-session";

function hashedEqual(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Acesso ainda não configurado neste ambiente." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as { username?: string; password?: string };
  const username = body.username?.trim() ?? "";
  const password = body.password ?? "";
  const expectedUser = process.env.AUTH_USERNAME?.trim() || "acal";
  const expectedPassword = process.env.AUTH_PASSWORD ?? "";

  const userOk = hashedEqual(username.toLowerCase(), expectedUser.toLowerCase());
  const passOk = hashedEqual(password, expectedPassword);

  if (!userOk || !passOk) {
    return NextResponse.json({ ok: false, error: "Usuário ou senha inválidos." }, { status: 401 });
  }

  const token = await createSessionToken(expectedUser, getAuthSecret());
  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
