import { isMockMode } from "@/lib/env";

export function MockBanner({ preview = false }: { preview?: boolean }) {
  if (!preview && !isMockMode()) return null;

  return (
    <div className="border-b border-border bg-accent-dim px-6 py-2 text-center text-[11px] uppercase tracking-[0.22em] text-accent">
      {preview ? "Prévia para acompanhamento · dados simulados" : "Estrutura Acal · dados operacionais simulados"}
    </div>
  );
}
