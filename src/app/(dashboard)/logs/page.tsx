import { PageHeader } from "@/components/layout/page-header";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateTimeBr } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { listLogs } from "@/repositories";

export default async function LogsPage() {
  const logs = await listLogs();

  return (
    <div>
      <PageHeader
        eyebrow="Registros"
        title="Rastreabilidade"
        description="Cada etapa do pipeline registra status, duração e erro. Secrets nunca entram no log."
      />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-text-subtle">
            <tr>
              <th className="px-5 pb-3 pt-5 font-medium">Horário</th>
              <th className="px-5 pb-3 pt-5 font-medium">Loja</th>
              <th className="px-5 pb-3 pt-5 font-medium">Etapa</th>
              <th className="px-5 pb-3 pt-5 font-medium">Duração</th>
              <th className="px-5 pb-3 pt-5 font-medium">Status</th>
              <th className="px-5 pb-3 pt-5 font-medium">Detalhe</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id} className="border-t border-border">
                <td className="px-5 py-4 text-text-muted">{formatDateTimeBr(log.timestamp)}</td>
                <td className="px-5 py-4">{log.storeId ?? "—"}</td>
                <td className="px-5 py-4">{statusLabel(log.stage)}</td>
                <td className="px-5 py-4">{log.durationMs != null ? `${log.durationMs} ms` : "—"}</td>
                <td className="px-5 py-4">
                  <Badge tone={statusTone(log.status)}>{statusLabel(log.status)}</Badge>
                </td>
                <td className="max-w-[360px] truncate px-5 py-4 text-text-muted">
                  {log.error ?? log.message ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
