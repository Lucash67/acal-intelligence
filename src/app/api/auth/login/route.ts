import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/auth-users";
import { createSessionToken, getAuthSecret, isAuthConfigured, sessionCookieOptions, SESSION_COOKIE } from "@/lib/auth-session";

export async function POST(request: Request) {
  if (!isAuthConfigured()) {
    return NextResponse.json({ ok: false, error: "Acesso ainda não configurado neste ambiente." }, { status: 503 });
  }

  const body = (await request.json().catch(() => ({}))) as { username?: string; password?: string };
  const account = authenticateUser(body.username?.trim() ?? "", body.password ?? "");

  if (!account) {
    return NextResponse.json({ ok: false, error: "Usuário ou senha inválidos." }, { status: 401 });
  }

  const token = await createSessionToken(account.username, account.role, getAuthSecret());
  const response = NextResponse.json({ ok: true, role: account.role });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions());
  return response;
}
