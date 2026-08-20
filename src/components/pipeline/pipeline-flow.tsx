import { Badge, statusTone } from "@/components/ui/badge";
import type { SystemLog } from "@/domain/log";
import { PIPELINE_FLOW, stageStatus } from "@/lib/pipeline-flow";
import { statusLabel } from "@/lib/labels";

export function PipelineFlow({ logs = [] }: { logs?: SystemLog[] }) {
  return (
    <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
      {PIPELINE_FLOW.map((step, index) => {
        const status = logs.length > 0 ? stageStatus(logs, step.stage) : null;
        const tone =
          status === "PENDING" || status === "SKIPPED" || status == null ? "neutral" : statusTone(status);
        const label =
          status == null
            ? "Na esteira"
            : status === "PENDING"
              ? "Aguardando"
              : status === "SKIPPED"
                ? "Não executada"
                : statusLabel(status);
        return (
          <li key={step.stage} className="rounded-[14px] border border-border bg-bg-card p-3">
            <p className="text-[10px] uppercase tracking-[0.16em] text-text-subtle">
              {String(index + 1).padStart(2, "0")} · {step.verb}
            </p>
            <p className="mt-2 text-sm">{step.label}</p>
            <div className="mt-3">
              <Badge tone={tone}>{label}</Badge>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
