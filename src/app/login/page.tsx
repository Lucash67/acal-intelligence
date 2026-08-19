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
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm text-text-muted">Usuário</span>
        <input
          name="username"
          autoComplete="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm text-text outline-none focus:border-border-strong"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-text-muted">Senha</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="w-full rounded-xl border border-border bg-bg px-3 py-3 text-sm text-text outline-none focus:border-border-strong"
        />
      </label>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-[var(--acal-primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--acal-primary-dark)] disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar →"}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <main className="min-h-screen px-5 py-5 md:px-10">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4">
        <BrandLockup size="login" />
        <div className="flex flex-col items-end gap-3">
          <span className="rounded-full bg-bg-card px-3 py-1 text-[12px] text-text-muted">
            Ambiente simulado
          </span>
          <ThemeSwitcher compact surface="page" />
        </div>
      </header>

      <section className="mx-auto mt-16 max-w-2xl text-center">
        <p className="text-[12px] text-accent">Produto interno</p>
        <h1 className="mt-3 text-4xl tracking-tight text-text md:text-5xl">
          Inteligência executiva para a operação da Acal
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-text-muted">
          A estrutura da rede é pública. Vendas, metas, gerentes e entregas continuam simulados para
          demonstração.
        </p>
      </section>

      <div className="mx-auto mt-10 w-full max-w-[440px] rounded-2xl bg-bg-card p-7 shadow-[var(--shadow-card)]">
        <Suspense fallback={<p className="text-sm text-text-muted">Carregando...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
