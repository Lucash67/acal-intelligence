"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    search.get("error") === "unconfigured" ? "Acesso ainda não configurado neste ambiente." : "",
  );
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const payload = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Não foi possível entrar.");
      }
      router.replace(search.get("next") || "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Usuário</span>
        <input
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-[var(--radius-sm)] border border-border bg-bg-card px-3 py-2.5 text-sm text-text outline-none focus:border-border-strong"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[11px] uppercase tracking-[0.16em] text-text-muted">Senha</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-[var(--radius-sm)] border border-border bg-bg-card px-3 py-2.5 text-sm text-text outline-none focus:border-border-strong"
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-[var(--radius-sm)] border border-accent/40 bg-accent-dim px-4 py-2.5 text-sm text-accent-strong transition hover:border-accent disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-10">
      <div className="w-full max-w-sm rounded-[var(--radius-md)] border border-border bg-bg-card p-8 shadow-[var(--shadow-card)]">
        <BrandLogo />
        <p className="mt-4 text-[15px] font-medium lowercase tracking-[0.18em] text-text">intelligence</p>
        <p className="mt-2 text-sm text-text-muted">Acesso interno. Informe usuário e senha.</p>
        <div className="mt-6">
          <Suspense fallback={<p className="text-sm text-text-muted">Carregando...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
