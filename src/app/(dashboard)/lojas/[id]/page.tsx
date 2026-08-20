import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { RunPipelineButton } from "@/components/pipeline/run-pipeline-button";
import { ExecutiveReportCard } from "@/components/reports/morning-report-card";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { provenanceLabel, unitTypeLabel } from "@/domain/provenance";
import { isReportableStore } from "@/domain/store";
import { periodLabel } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { formatCurrency } from "@/lib/format";
import { listExecutions, getStoreById } from "@/repositories";
import { buildMockAnalysis } from "@/providers/ai/mock-ai-provider";
import { ReportGenerator } from "@/services/report-generator";
import { getStoreSalesSnapshot } from "@/services/sales-snapshot";

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
  const snapshot = reportable ? getStoreSalesSnapshot(store) : null;
  const metrics = snapshot?.metrics ?? null;
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
      {snapshot && preview ? (
        <>
          <div className="mb-6 grid gap-4 md:grid-cols-4">
            <Card>
              <CardTitle>Vendas D-1 simuladas</CardTitle>
              <p className="number text-3xl">{formatCurrency(snapshot.dailySales)}</p>
            </Card>
            <Card>
              <CardTitle>Meta do dia simulada</CardTitle>
              <p className="number text-3xl">{formatCurrency(snapshot.dailyTarget)}</p>
            </Card>
            <Card>
              <CardTitle>Projeção mês simulada</CardTitle>
              <p className="number text-3xl">{formatCurrency(snapshot.monthlySales)}</p>
            </Card>
            <Card>
              <CardTitle>Meta mensal simulada</CardTitle>
              <p className="number text-3xl">{formatCurrency(snapshot.monthlyTarget)}</p>
            </Card>
          </div>
          <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
            <ExecutiveReportCard report={preview} />
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
