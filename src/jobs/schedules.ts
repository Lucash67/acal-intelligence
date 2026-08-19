import type { ReportPeriod } from "@/domain/period";

export type AutomationSchedule = {
  id: string;
  name: string;
  period: ReportPeriod;
  processingTime: string;
  deliveryTime: string;
  description: string;
  enabled: boolean;
};

export const AUTOMATION_SCHEDULES: AutomationSchedule[] = [
  {
    id: "morning-report",
    name: "Relatório Matinal",
    period: "MORNING",
    processingTime: "06:30",
    deliveryTime: "07:00",
    description: "Processa dados consolidados do dia anterior e entrega o relatório matinal.",
    enabled: false,
  },
  {
    id: "afternoon-report",
    name: "Relatório Vespertino",
    period: "AFTERNOON",
    processingTime: "13:30",
    deliveryTime: "14:00",
    description: "Processa dados acumulados do dia em curso e entrega o balanço parcial.",
    enabled: false,
  },
];

// TODO(ACAL-INFRA): decidir runtime de produção (cron, worker, fila) com Rodrigo/TI.
// Não configurar agendamento real nesta fase.

export function getNextScheduledRun(now = new Date()): {
  schedule: AutomationSchedule;
  at: Date;
} {
  const candidates = AUTOMATION_SCHEDULES.map((schedule) => {
    const [hours, minutes] = schedule.processingTime.split(":").map(Number);
    const next = new Date(now);
    next.setHours(hours, minutes, 0, 0);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    return { schedule, at: next };
  });

  return candidates.sort((a, b) => a.at.getTime() - b.at.getTime())[0];
}
