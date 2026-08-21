import type { AuthRole } from "@/lib/access";

const encoder = new TextEncoder();

export const SESSION_COOKIE = "acal_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

function toBase64Url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(value: string): Uint8Array {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "sign",
    "verify",
  ]);
}

export function getAuthSecret(): string {
  return process.env.AUTH_SECRET?.trim() || process.env.AUTH_PASSWORD?.trim() || "";
}

export function isAuthConfigured(): boolean {
  return Boolean(process.env.AUTH_PASSWORD?.trim() && getAuthSecret());
}

export async function createSessionToken(
  username: string,
  role: AuthRole,
  secret: string,
  ttlSeconds = SESSION_TTL_SECONDS,
) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `v2.${encodeURIComponent(username)}.${role}.${exp}`;
  const key = await hmacKey(secret);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return `${payload}.${toBase64Url(signature)}`;
}

export async function readSessionToken(
  token: string,
  secret: string,
): Promise<{ username: string; role: AuthRole } | null> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return null;

  const payload = token.slice(0, lastDot);
  const signature = token.slice(lastDot + 1);
  const parts = payload.split(".");
  const version = parts[0];
  if (version !== "v1" && version !== "v2") return null;

  const encodedUser = parts[1];
  const role = (version === "v2" ? parts[2] : "admin") as AuthRole;
  const expRaw = version === "v2" ? parts[3] : parts[2];
  if (!encodedUser || !expRaw) return null;
  if (role !== "admin" && role !== "preview") return null;
  if (Number(expRaw) < Math.floor(Date.now() / 1000)) return null;

  const key = await hmacKey(secret);
  const signatureBytes = fromBase64Url(signature);
  const signatureBuffer = signatureBytes.buffer.slice(
    signatureBytes.byteOffset,
    signatureBytes.byteOffset + signatureBytes.byteLength,
  ) as ArrayBuffer;
  const valid = await crypto.subtle.verify("HMAC", key, signatureBuffer, encoder.encode(payload));
  if (!valid) return null;

  return { username: decodeURIComponent(encodedUser), role };
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}
