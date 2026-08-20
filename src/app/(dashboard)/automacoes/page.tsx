import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { PipelineFlow } from "@/components/pipeline/pipeline-flow";
import { RunPipelineButton } from "@/components/pipeline/run-pipeline-button";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDateBr, formatDateTimeBr } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { getAutomationCycles } from "@/services/dashboard-data";

export default async function AutomationsPage() {
  const cycles = await getAutomationCycles();

  return (
    <div>
      <PageHeader
        eyebrow="Automações"
        title="Ciclo operacional simulado"
        description="O agendamento de produção continua desligado. Os botões rodam o fluxo completo da rede com dados imaginários: busca, cálculo, análise, montagem, envio simulado e registro."
      />
      <Card className="mb-4">
        <CardTitle>Esteira</CardTitle>
        <p className="mb-4 text-sm text-text-muted">
          Cada loja passa sozinha por estas etapas. Falha em uma unidade não interrompe as demais.
        </p>
        <PipelineFlow />
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        {cycles.map(({ schedule, latest, success, failed, sent, rows }) => (
          <Card key={schedule.id}>
            <CardTitle>{schedule.name}</CardTitle>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Processamento</p>
                <p className="number mt-1 text-4xl">{schedule.processingTime}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Entrega</p>
                <p className="number mt-1 text-4xl">{schedule.deliveryTime}</p>
              </div>
            </div>
            <p className="mb-5 text-sm text-text-muted">{schedule.description}</p>
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge tone="warning">Cron inativo</Badge>
              <Badge tone="info">Envio simulado</Badge>
              {latest ? (
                <Badge>
                  Último recorte {formatDateBr(latest.referenceDate)} · {success} ok · {failed} falha · {sent} enviados
                </Badge>
              ) : (
                <Badge>Sem execução neste ciclo</Badge>
              )}
            </div>
            {rows.length > 0 ? (
              <div className="mb-5 overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="text-[11px] uppercase tracking-[0.14em] text-text-subtle">
                    <tr>
                      <th className="pb-2 font-medium">Loja</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 font-medium">Disparo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map(({ execution, storeName, delivery }) => (
                      <tr key={execution.id} className="border-t border-border">
                        <td className="py-2">{storeName}</td>
                        <td className="py-2">
                          <Badge tone={statusTone(execution.status)}>{statusLabel(execution.status)}</Badge>
                        </td>
                        <td className="py-2">
                          {delivery ? (
                            <Link href={`/entregas/${delivery.id}`} className="text-accent">
                              {delivery.status === "SUCCESS" ? "Ver disparo" : "Ver falha"}
                            </Link>
                          ) : (
                            <span className="text-text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            {latest ? (
              <p className="mb-5 text-xs text-text-muted">
                Última execução {formatDateTimeBr(latest.startedAt)}. Horários 07:00 e 14:00 ainda não disparam sozinhos.
              </p>
            ) : null}
            <RunPipelineButton period={schedule.period} label={`Simular ${schedule.name.toLowerCase()} na rede`} />
          </Card>
        ))}
      </div>
    </div>
  );
}
