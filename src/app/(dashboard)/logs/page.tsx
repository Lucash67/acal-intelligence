import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PipelineFlow } from "@/components/pipeline/pipeline-flow";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import type { SystemLog } from "@/domain/log";
import { deliveryKey, parseExecutionKey, reportKey } from "@/lib/demo-keys";
import { formatDateTimeBr } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { listLogs, listStores } from "@/repositories";

export default async function LogsPage() {
  const [logs, stores] = await Promise.all([listLogs(), listStores()]);
  const groups = groupByExecution(logs, stores);

  return (
    <div>
      <PageHeader
        eyebrow="Registros"
        title="Rastreabilidade da esteira"
        description="Cada execução agrupa busca, cálculo, análise, montagem, envio e registro. Secrets nunca entram no log."
      />
      <div className="space-y-4">
        {groups.map((group) => (
          <Card key={group.executionId}>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <CardTitle>{group.storeName}</CardTitle>
                <p className="mt-1 text-sm text-text-muted">{formatDateTimeBr(group.startedAt)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge tone={statusTone(group.status)}>{statusLabel(group.status)}</Badge>
                {group.reportHref ? (
                  <Link href={group.reportHref} className="text-sm text-accent">
                    Relatório
                  </Link>
                ) : null}
                {group.deliveryHref ? (
                  <Link href={group.deliveryHref} className="text-sm text-accent">
                    Disparo
                  </Link>
                ) : null}
              </div>
            </div>
            <PipelineFlow logs={group.logs} />
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-[11px] uppercase tracking-[0.14em] text-text-subtle">
                  <tr>
                    <th className="pb-2 font-medium">Etapa</th>
                    <th className="pb-2 font-medium">Duração</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Detalhe</th>
                  </tr>
                </thead>
                <tbody>
                  {group.logs.map((log) => (
                    <tr key={log.id} className="border-t border-border">
                      <td className="py-2">{statusLabel(log.stage)}</td>
                      <td className="py-2">{log.durationMs != null ? `${log.durationMs} ms` : "—"}</td>
                      <td className="py-2">
                        <Badge tone={statusTone(log.status)}>{statusLabel(log.status)}</Badge>
                      </td>
                      <td className="max-w-[420px] truncate py-2 text-text-muted">
                        {log.error ?? log.message ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function groupByExecution(
  logs: SystemLog[],
  stores: { id: string; name: string }[],
) {
  const map = new Map<string, SystemLog[]>();
  for (const log of logs) {
    const key = log.executionId ?? log.id;
    const current = map.get(key) ?? [];
    current.push(log);
    map.set(key, current);
  }

  return [...map.entries()]
    .map(([executionId, items]) => {
      const ordered = [...items].sort(
        (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      );
      const storeId = ordered.find((item) => item.storeId)?.storeId ?? null;
      const parsed = parseExecutionKey(executionId);
      const failed = ordered.some((item) => item.status === "FAILED");
      return {
        executionId,
        storeName: stores.find((store) => store.id === storeId)?.name ?? storeId ?? "Execução",
        startedAt: ordered[0]?.timestamp ?? "",
        status: failed ? "FAILED" : "SUCCESS",
        logs: ordered,
        reportHref: parsed ? `/relatorios/${reportKey(parsed.storeId, parsed.period, parsed.date)}` : null,
        deliveryHref: parsed ? `/entregas/${deliveryKey(parsed.storeId, parsed.period, parsed.date)}` : null,
      };
    })
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}
