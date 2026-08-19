"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function RunPipelineButton({
  storeId,
  period = "MORNING",
  label = "Simular pipeline",
}: {
  storeId?: string;
  period?: "MORNING" | "AFTERNOON";
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/pipeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeId, period }),
      });
      const payload = (await response.json()) as {
        ok: boolean;
        summary?: string;
        error?: string;
      };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || "Falha ao executar o pipeline.");
      }
      setMessage(payload.summary ?? "Pipeline concluído.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-[var(--radius-sm)] border border-accent/40 bg-accent-dim px-4 py-2 text-sm text-accent-strong transition hover:border-accent disabled:opacity-60"
      >
        {loading ? "Processando..." : label}
      </button>
      {message ? <p className="max-w-md text-xs text-text-muted">{message}</p> : null}
    </div>
  );
}
