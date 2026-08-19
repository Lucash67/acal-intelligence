import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { MorningReportCard } from "@/components/reports/morning-report-card";
import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { getReportById } from "@/repositories";

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const report = await getReportById(id);
  if (!report) notFound();

  return (
    <div>
      <PageHeader
        eyebrow="Visualização"
        title={report.title}
        description="Card executivo 1080×1350 preparado para WhatsApp. Os valores oficiais não vêm do texto da IA."
        action={
          <Link href="/relatorios" className="text-sm text-accent">
            Voltar
          </Link>
        }
      />
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_360px]">
        <MorningReportCard report={report} />
        <div className="space-y-4">
          <Card>
            <CardTitle>Métricas oficiais</CardTitle>
            <dl className="space-y-3 text-sm">
              <Item label="Vendas" value={formatCurrency(report.metrics.sales.actual)} />
              <Item label="Meta" value={formatCurrency(report.metrics.sales.target)} />
              <Item label="Atingimento" value={formatPercent(report.metrics.sales.achievementPercentage)} />
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
