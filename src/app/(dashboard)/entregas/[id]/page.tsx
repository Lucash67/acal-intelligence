import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PipelineFlow } from "@/components/pipeline/pipeline-flow";
import { ExecutiveReportCard } from "@/components/reports/morning-report-card";
import { WhatsAppDeliveryPreview } from "@/components/reports/whatsapp-delivery-preview";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDateTimeBr, periodLabel, periodScopeLabel } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { getDeliveryById, getReportByExecutionId, listLogsByExecutionId, listStores } from "@/repositories";

export default async function DeliveryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [delivery, stores] = await Promise.all([getDeliveryById(id), listStores()]);
  if (!delivery) {
    return (
      <div>
        <PageHeader
          eyebrow="Caixa de saída"
          title="Disparo indisponível nesta instância"
          description="No MVP em memória, um link antigo pode não existir depois do deploy. Volte ao histórico de entregas."
          action={
            <Link href="/entregas" className="text-sm text-accent">
              Voltar às entregas
            </Link>
          }
        />
      </div>
    );
  }

  const store = stores.find((item) => item.id === delivery.storeId);
  const [report, logs] = await Promise.all([
    getReportByExecutionId(delivery.executionId),
    listLogsByExecutionId(delivery.executionId),
  ]);
  const sent = delivery.status === "SUCCESS";

  return (
    <div>
      <PageHeader
        eyebrow="Caixa de saída"
        title={store?.name ?? delivery.storeId}
        description="Texto e card que o MockMessagingProvider marcou como enviados. Nenhum WhatsApp real sai daqui."
        action={
          <Link href="/entregas" className="text-sm text-accent">
            Voltar
          </Link>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Badge tone={statusTone(delivery.status)}>{sent ? "Enviado · simulado" : statusLabel(delivery.status)}</Badge>
        <Badge>{statusLabel(delivery.channel)}</Badge>
        {report ? <Badge>{periodLabel(report.period)}</Badge> : null}
        {report ? <Badge tone="info">{periodScopeLabel(report.period)}</Badge> : null}
      </div>
      <Card className="mb-6">
        <CardTitle>Etapas desta execução</CardTitle>
        <PipelineFlow logs={logs} />
      </Card>
      <div className="grid items-start gap-6 xl:grid-cols-2">
        <Card>
          <CardTitle>Disparo</CardTitle>
          <dl className="mb-5 space-y-3 text-sm">
            <Row label="Gerente" value={store?.manager.name ?? "Simulado"} />
            <Row label="Destinatário" value={delivery.recipient} />
            <Row label="Payload" value={sent ? "Texto + card 1080×1350" : "Não gerado"} />
            <Row label="Tentativas" value={String(delivery.attempts)} />
            <Row label="Horário" value={delivery.sentAt ? formatDateTimeBr(delivery.sentAt) : "—"} />
            <Row label="Erro" value={delivery.error ?? "—"} />
          </dl>
          {report ? (
            <WhatsAppDeliveryPreview report={report} recipient={delivery.recipient} sent={sent} />
          ) : (
            <p className="text-sm text-text-muted">
              Esta execução falhou antes de montar o relatório. A falha ficou isolada nesta loja.
            </p>
          )}
          <Link href="/logs" className="mt-5 inline-block text-sm text-accent">
            Ver registros da esteira
          </Link>
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
