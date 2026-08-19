import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { ExecutiveReportCard } from "@/components/reports/morning-report-card";
import { WhatsAppDeliveryPreview } from "@/components/reports/whatsapp-delivery-preview";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDateTimeBr, periodLabel, periodScopeLabel } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { getReportByExecutionId, listDeliveries, listStores } from "@/repositories";

export default async function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [deliveries, stores] = await Promise.all([listDeliveries(), listStores()]);
  const delivery = deliveries.find((item) => item.id === id);
  if (!delivery) notFound();

  const store = stores.find((item) => item.id === delivery.storeId);
  const report = await getReportByExecutionId(delivery.executionId);

  return (
    <div>
      <PageHeader
        eyebrow="Entrega simulada"
        title={store?.name ?? delivery.storeId}
        description="Preview do que iria no WhatsApp. Nenhum disparo real é feito neste MVP."
        action={
          <Link href="/entregas" className="text-sm text-accent">
            Voltar
          </Link>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone={statusTone(delivery.status)}>{statusLabel(delivery.status)}</Badge>
        <Badge>{statusLabel(delivery.channel)}</Badge>
        {report ? <Badge>{periodLabel(report.period)}</Badge> : null}
        {report ? <Badge tone="info">{periodScopeLabel(report.period)}</Badge> : null}
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle>Disparo</CardTitle>
          <dl className="mb-5 space-y-3 text-sm">
            <Row label="Destinatário" value={delivery.recipient} />
            <Row label="Tentativas" value={String(delivery.attempts)} />
            <Row label="Horário" value={delivery.sentAt ? formatDateTimeBr(delivery.sentAt) : "—"} />
            <Row label="Erro" value={delivery.error ?? "—"} />
          </dl>
          {report ? (
            <WhatsAppDeliveryPreview report={report} recipient={delivery.recipient} />
          ) : (
            <p className="text-sm text-text-muted">
              Esta execução falhou antes de montar o relatório. A falha ficou isolada nesta loja.
            </p>
          )}
        </Card>
        {report ? (
          <div className="space-y-4">
            <ExecutiveReportCard report={report} />
            <div className="flex flex-wrap gap-3 text-sm">
              <Link href={`/relatorios/${report.id}`} className="text-accent">
                Abrir relatório
              </Link>
              <Link href={`/api/reports/${report.id}/card`} className="text-accent" target="_blank">
                Card 1080×1350
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}
