import { PageHeader } from "@/components/layout/page-header";
import { RunPipelineButton } from "@/components/pipeline/run-pipeline-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import { AUTOMATION_SCHEDULES } from "@/jobs/schedules";

export default function AutomationsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Automações"
        title="Ciclos operacionais"
        description="A interface representa os horários oficiais. O cron de produção não é configurado nesta fase."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {AUTOMATION_SCHEDULES.map((schedule) => (
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
            <div className="mb-5 flex items-center gap-2">
              <Badge tone="warning">Agendamento inativo</Badge>
              <Badge>Estrutura pronta</Badge>
            </div>
            <RunPipelineButton period={schedule.period} label={`Simular ${schedule.name.toLowerCase()}`} />
          </Card>
        ))}
      </div>
    </div>
  );
}
