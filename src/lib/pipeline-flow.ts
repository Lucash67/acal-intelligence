import type { PipelineStage, SystemLog } from "@/domain/log";

export const PIPELINE_FLOW = [
  { stage: "DATA_SOURCE" as const, verb: "Busca", label: "Fonte de dados da loja" },
  { stage: "ANALYTICS" as const, verb: "Calcula", label: "Métricas oficiais" },
  { stage: "AI_ANALYSIS" as const, verb: "Analisa", label: "Leitura executiva" },
  { stage: "REPORT" as const, verb: "Monta", label: "Relatório e card" },
  { stage: "DELIVERY" as const, verb: "Envia", label: "WhatsApp simulado" },
  { stage: "FINISH" as const, verb: "Registra", label: "Histórico da execução" },
];

export function stageStatus(
  logs: SystemLog[],
  stage: PipelineStage,
): SystemLog["status"] | "PENDING" | "SKIPPED" {
  const match = logs.filter((item) => item.stage === stage);
  if (match.some((item) => item.status === "FAILED")) return "FAILED";
  if (match.some((item) => item.status === "SUCCESS")) return "SUCCESS";
  if (match.some((item) => item.status === "INFO")) return "INFO";
  if (logs.some((item) => item.status === "FAILED")) return "SKIPPED";
  return "PENDING";
}
