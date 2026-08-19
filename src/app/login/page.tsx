"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";

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
    <form onSubmit={onSubmit} className="space-y-3.5">
      <label className="block space-y-1.5">
        <span className="text-[13px] text-text-muted">Usuário</span>
        <input
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-xl border border-border bg-[var(--surface)] px-3 py-2.5 text-sm text-text outline-none transition focus:border-border-strong"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-[13px] text-text-muted">Senha</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-border bg-[var(--surface)] px-3 py-2.5 text-sm text-text outline-none transition focus:border-border-strong"
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[var(--acal-primary)] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--acal-primary-dark)] disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar →"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="fixed inset-0 overflow-hidden">
      <header className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-4 px-5 md:px-8">
        <BrandLockup size="login" />
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-bg-card px-3.5 py-1.5 text-[12px] font-semibold text-text sm:inline">
            Ambiente simulado
          </span>
          <ThemeSwitcher compact surface="page" />
        </div>
      </header>

      <main className="mx-auto flex h-[calc(100dvh-64px)] max-w-5xl flex-col items-center justify-center px-5 pb-8 md:px-8">
        <section className="max-w-xl text-center">
          <p className="inline-flex rounded-full bg-[var(--accent-dim)] px-3 py-1 text-[12px] font-semibold text-accent">
            Produto interno
          </p>
          <h1 className="mt-4 text-[clamp(1.55rem,3.4vw,2.75rem)] font-semibold tracking-tight text-text">
            Inteligência executiva para a operação da Acal
          </h1>
          <p className="mx-auto mt-3 max-w-md text-[13px] leading-relaxed text-text-muted sm:text-[15px]">
            A estrutura da rede é pública. Vendas, metas, gerentes e entregas continuam simulados
            para demonstração.
          </p>
        </section>

        <div className="mt-6 w-full max-w-md rounded-2xl bg-bg-card p-6 shadow-[var(--shadow-card)]">
          <Suspense fallback={<p className="text-sm text-text-muted">Carregando...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
