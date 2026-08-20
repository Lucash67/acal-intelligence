import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { RunPipelineButton } from "@/components/pipeline/run-pipeline-button";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { formatDateTimeBr, periodLabel } from "@/lib/dates";
import { deliveryKey } from "@/lib/demo-keys";
import { statusLabel } from "@/lib/labels";
import { getOverviewData } from "@/services/dashboard-data";

export default async function OverviewPage() {
  const data = await getOverviewData();

  return (
    <div>
      <PageHeader
        eyebrow="Visão geral"
        title="Central operacional"
        description="Unidades públicas da Acal. Vendas, metas, gerentes e entregas continuam simulados."
        action={
          <div className="flex flex-wrap gap-2">
            <RunPipelineButton period="MORNING" label="Simular ciclo matinal" />
            <RunPipelineButton period="AFTERNOON" label="Simular ciclo vespertino" />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <Stat
            label="Próxima execução"
            value={data.nextRun.processingTime}
            hint={`${data.nextRun.name} · ${formatDateTimeBr(data.nextRun.at)}`}
          />
        </Card>
        <Card>
          <Stat label="Relatórios hoje" value={String(data.reportsToday)} hint="Gerados neste ambiente" />
        </Card>
        <Card>
          <Stat label="Entregas" value={String(data.deliveriesToday)} hint="Envios simulados com sucesso" />
        </Card>
        <Card>
          <Stat label="Falhas" value={String(data.failures)} hint="Execuções independentes por loja" />
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardTitle>Status do sistema</CardTitle>
          <div className="space-y-3 text-sm">
            <Row label="Modo" value={data.mockMode ? "Estrutura real · dados simulados" : "Em operação"} />
            <Row label="Persistência" value={data.database ? "Supabase / PostgreSQL" : "Memória local"} />
            <Row label="Inteligência" value={`${data.aiUsage} análises registradas`} />
            <Row label="Saúde" value={data.systemStatus} />
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <CardTitle>Últimas execuções</CardTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-[11px] uppercase tracking-[0.14em] text-text-subtle">
                <tr>
                  <th className="pb-3 font-medium">Loja</th>
                  <th className="pb-3 font-medium">Período</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Início</th>
                </tr>
              </thead>
              <tbody>
                {data.executions.map((execution) => (
                  <tr key={execution.id} className="border-t border-border">
                    <td className="py-3">
                      <Link
                        href={`/entregas/${deliveryKey(execution.storeId, execution.reportType, execution.referenceDate)}`}
                        className="text-accent"
                      >
                        {data.stores.find((store) => store.id === execution.storeId)?.name ?? execution.storeId}
                      </Link>
                    </td>
                    <td className="py-3 text-text-muted">{periodLabel(execution.reportType)}</td>
                    <td className="py-3">
                      <Badge tone={statusTone(execution.status)}>{statusLabel(execution.status)}</Badge>
                    </td>
                    <td className="py-3 text-text-muted">{formatDateTimeBr(execution.startedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link href="/relatorios" className="mt-4 inline-block text-sm text-accent">
            Ver relatórios
          </Link>
        </Card>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-text-muted">{label}</span>
      <span>{value}</span>
    </div>
  );
}
