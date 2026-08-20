import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { ExecutiveReportCard } from "@/components/reports/morning-report-card";
import { WhatsAppDeliveryPreview } from "@/components/reports/whatsapp-delivery-preview";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { periodLabel, periodScopeLabel } from "@/lib/dates";
import { deliveryKey, parseExecutionKey } from "@/lib/demo-keys";
import { formatCurrency, formatPercent } from "@/lib/format";
import { getDeliveryById, getReportById, getStoreById } from "@/repositories";
import { getStoreSalesSnapshot, salesPeriodLabels } from "@/services/sales-snapshot";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReportById(id);
  if (!report) {
    return (
      <div>
        <PageHeader
          eyebrow="Visualização"
          title="Relatório indisponível nesta instância"
          description="No MVP em memória, um link antigo pode não existir depois do deploy. Abra o histórico e escolha o relatório de novo."
          action={
            <Link href="/relatorios" className="text-sm text-accent">
              Voltar aos relatórios
            </Link>
          }
        />
      </div>
    );
  }
  const store = await getStoreById(report.storeId);
  const snapshot = store ? getStoreSalesSnapshot(store) : null;
  const parsed = parseExecutionKey(report.executionId);
  const delivery = parsed
    ? await getDeliveryById(deliveryKey(parsed.storeId, parsed.period, parsed.date))
    : null;
  const labels = salesPeriodLabels(report.period);

  return (
    <div>
      <PageHeader
        eyebrow="Visualização"
        title={report.title}
        description={`${periodScopeLabel(report.period)}. Card 1080×1350 preparado para WhatsApp. Vendas do card são do recorte operacional; a projeção mês é a mesma do módulo Indicadores.`}
        action={
          <Link href="/relatorios" className="text-sm text-accent">
            Voltar
          </Link>
        }
      />
      <div className="mb-5 flex flex-wrap gap-2">
        <Badge>{periodLabel(report.period)}</Badge>
        <Badge tone="info">{periodScopeLabel(report.period)}</Badge>
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <ExecutiveReportCard report={report} />
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href={`/api/reports/${report.id}/card`} className="text-accent" target="_blank">
              Abrir card 1080×1350
            </Link>
            {delivery ? (
              <Link href={`/entregas/${delivery.id}`} className="text-accent">
                Ver disparo simulado
              </Link>
            ) : null}
          </div>
        </div>
        <div className="space-y-4">
          <Card>
            <CardTitle>Métricas oficiais</CardTitle>
            <dl className="space-y-3 text-sm">
              <Item label={labels.sales} value={formatCurrency(report.metrics.sales.actual)} />
              <Item label={labels.target} value={formatCurrency(report.metrics.sales.target)} />
              <Item label="Atingimento" value={formatPercent(report.metrics.sales.achievementPercentage)} />
              {snapshot ? (
                <>
                  <Item label="Projeção mês" value={formatCurrency(snapshot.monthlySales)} />
                  <Item label="Meta mês" value={formatCurrency(snapshot.monthlyTarget)} />
                </>
              ) : null}
              <Item label="Novos clientes" value={String(report.metrics.customers.newCustomers)} />
              <Item label="Inativos" value={String(report.metrics.customers.inactiveCustomers)} />
            </dl>
          </Card>
          <Card>
            <CardTitle>Análise</CardTitle>
            <ul className="space-y-2 text-sm text-text-muted">
              {report.analysis.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Card>
          <WhatsAppDeliveryPreview
            report={report}
            recipient={delivery?.recipient ?? "Destinatário simulado"}
          />
        </div>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="number">{value}</dd>
    </div>
  );
}
