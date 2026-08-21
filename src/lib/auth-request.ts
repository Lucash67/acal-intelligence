import { cookies } from "next/headers";
import type { AuthRole } from "@/lib/access";
import { getAuthSecret, isAuthConfigured, readSessionToken, SESSION_COOKIE } from "@/lib/auth-session";

export async function getRequestSession(): Promise<{ username: string; role: AuthRole }> {
  if (!isAuthConfigured()) {
    return { username: "local", role: "admin" };
  }

  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { username: "local", role: "admin" };
  const session = await readSessionToken(token, getAuthSecret());
  return session ?? { username: "local", role: "admin" };
}
