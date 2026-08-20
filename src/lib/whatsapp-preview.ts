import type { ExecutiveReport } from "@/domain/report";
import { formatDateBr, periodLabel, periodScopeLabel } from "@/lib/dates";
import { formatCurrency, formatPercent } from "@/lib/format";

export function buildWhatsAppPreview(report: ExecutiveReport): string {
  const { metrics, analysis } = report;
  const actions = analysis.actionPlan
    .slice(0, 3)
    .map((item, index) => `${index + 1}. ${item}`)
    .join("\n");

  return [
    `*${report.title}*`,
    `${metrics.city} · ${formatDateBr(metrics.referenceDate)} · ${periodScopeLabel(metrics.period)}`,
    "",
    `${metrics.period === "AFTERNOON" ? "Vendas parciais" : "Vendas D-1"}: ${formatCurrency(metrics.sales.actual)}`,
    `Meta do dia: ${formatCurrency(metrics.sales.target)}`,
    `Atingimento: ${formatPercent(metrics.sales.achievementPercentage)}`,
    "",
    analysis.executiveSummary,
    "",
    "*Plano de ação*",
    actions,
    "",
    `_Card ${periodLabel(metrics.period).toLowerCase()} 1080×1350 em anexo. Envio simulado — nenhum WhatsApp real._`,
  ].join("\n");
}
