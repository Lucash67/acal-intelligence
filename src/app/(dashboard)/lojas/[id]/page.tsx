import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { RunPipelineButton } from "@/components/pipeline/run-pipeline-button";
import { MorningReportCard } from "@/components/reports/morning-report-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { provenanceLabel, unitTypeLabel } from "@/domain/provenance";
import { isReportableStore } from "@/domain/store";
import { periodLabel, toIsoDate } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { formatCurrency, formatPercent } from "@/lib/format";
import { getMockStoreRawData } from "@/mocks/raw-data";
import { listExecutions, getStoreById } from "@/repositories";
import { buildMockAnalysis } from "@/providers/ai/mock-ai-provider";
import { computeStoreMetrics } from "@/services/analytics-engine";
import { ReportGenerator } from "@/services/report-generator";

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const store = await getStoreById(id);
  if (!store) notFound();

  const reportable = isReportableStore(store);
  const executions = (await listExecutions()).filter((item) => item.storeId === store.id);
  const metrics = reportable
    ? computeStoreMetrics(getMockStoreRawData(store.id, "MORNING", toIsoDate()))
    : null;
  const preview = metrics ? new ReportGenerator().generate(metrics, buildMockAnalysis(metrics)) : null;

  return (
    <div>
      <PageHeader
        eyebrow={`${store.city}/${store.state}`}
        title={store.name}
        description={
          reportable
            ? `Gerente simulado: ${store.manager.name} · Destinatário fictício: ${store.manager.phone}`
            : "Unidade cadastrada sem relatório de gerente de loja."
        }
        action={reportable ? <RunPipelineButton storeId={store.id} label="Simular esta loja" /> : undefined}
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone={statusTone(store.status)}>{statusLabel(store.status)}</Badge>
        <Badge tone={statusTone(store.sourceStatus)}>{provenanceLabel(store.sourceStatus)}</Badge>
        <Badge>{unitTypeLabel(store.unitType)}</Badge>
        <Badge tone={reportable ? "info" : "neutral"}>{reportable ? "Relatório simulado" : "Fora do fluxo"}</Badge>
      </div>
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <Card>
          <CardTitle>Endereço público</CardTitle>
          <p className="text-sm">{store.address}</p>
          <p className="mt-2 text-sm text-text-muted">
            {store.neighborhood} · {store.city}/{store.state}
          </p>
        </Card>
        <Card>
          <CardTitle>Contato institucional</CardTitle>
          <p className="text-sm">{store.publicPhone ?? "Não publicado"}</p>
          <p className="mt-2 text-sm text-text-muted">{store.publicHours ?? "Horário não publicado"}</p>
        </Card>
        <Card>
          <CardTitle>Códigos internos</CardTitle>
          <p className="text-sm text-text-muted">ERP: pendente</p>
          <p className="mt-2 text-sm text-text-muted">BI: pendente</p>
          <p className="mt-2 font-mono text-xs text-text-subtle">id provisório: {store.id}</p>
        </Card>
      </div>
      {store.notes ? (
        <Card className="mb-6">
          <CardTitle>Observação de cadastro</CardTitle>
          <p className="text-sm text-text-muted">{store.notes}</p>
        </Card>
      ) : null}
      {metrics && preview ? (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardTitle>Meta simulada</CardTitle>
              <p className="number text-3xl">{formatCurrency(store.dailyTarget)}</p>
            </Card>
            <Card>
              <CardTitle>Vendas simuladas</CardTitle>
              <p className="number text-3xl">{formatCurrency(metrics.sales.actual)}</p>
            </Card>
            <Card>
              <CardTitle>Atingimento simulado</CardTitle>
              <p className="number text-3xl">{formatPercent(metrics.sales.achievementPercentage)}</p>
            </Card>
          </div>
          <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
            <MorningReportCard report={preview} />
            <Card>
              <CardTitle>Execuções da loja</CardTitle>
              <div className="space-y-3">
                {executions.length === 0 ? (
                  <p className="text-sm text-text-muted">Nenhuma execução registrada.</p>
                ) : (
                  executions.slice(0, 8).map((execution) => (
                    <div key={execution.id} className="flex items-center justify-between gap-3 text-sm">
                      <span className="text-text-muted">{periodLabel(execution.reportType)}</span>
                      <Badge tone={statusTone(execution.status)}>{statusLabel(execution.status)}</Badge>
                    </div>
                  ))
                )}
              </div>
              <Link href="/relatorios" className="mt-5 inline-block text-sm text-accent">
                Ver relatórios
              </Link>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardTitle>Fora do relatório de loja</CardTitle>
          <p className="text-sm text-text-muted">
            Administração, CD e unidades conflitantes não entram no ciclo de gerente. A Acal ainda precisa confirmar se
            algum desses pontos terá relatório próprio.
          </p>
        </Card>
      )}
    </div>
  );
}
