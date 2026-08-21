"use client";

import { createContext, useContext } from "react";
import type { AuthRole } from "@/lib/access";

export type AuthSession = {
  username: string;
  role: AuthRole;
};

const AuthContext = createContext<AuthSession>({ username: "local", role: "admin" });

export function AuthProvider({
  session,
  children,
}: {
  session: AuthSession;
  children: React.ReactNode;
}) {
  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
