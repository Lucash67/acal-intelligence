import { createHash, timingSafeEqual } from "crypto";
import type { AuthRole } from "@/lib/access";

export type AuthAccount = {
  username: string;
  password: string;
  role: AuthRole;
};

function hashedEqual(left: string, right: string) {
  const a = createHash("sha256").update(left).digest();
  const b = createHash("sha256").update(right).digest();
  return timingSafeEqual(a, b);
}

export function listAuthAccounts(): AuthAccount[] {
  const accounts: AuthAccount[] = [];
  const adminPassword = process.env.AUTH_PASSWORD ?? "";
  if (adminPassword) {
    accounts.push({
      username: process.env.AUTH_USERNAME?.trim() || "acal",
      password: adminPassword,
      role: "admin",
    });
  }

  const previewPassword = process.env.AUTH_PREVIEW_PASSWORD ?? "";
  if (previewPassword) {
    accounts.push({
      username: process.env.AUTH_PREVIEW_USERNAME?.trim() || "mauricio",
      password: previewPassword,
      role: "preview",
    });
  }

  return accounts;
}

export function authenticateUser(username: string, password: string): Omit<AuthAccount, "password"> | null {
  const needle = username.trim().toLowerCase();
  let matched: Omit<AuthAccount, "password"> | null = null;

  for (const account of listAuthAccounts()) {
    const userOk = hashedEqual(needle, account.username.toLowerCase());
    const passOk = hashedEqual(password, account.password);
    if (userOk && passOk) {
      matched = { username: account.username, role: account.role };
    }
  }

  return matched;
}
