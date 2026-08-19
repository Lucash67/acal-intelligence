import type { AIAnalysis } from "@/domain/ai";
import { formatCurrency, formatPercent } from "@/lib/format";
import { aiAnalysisSchema } from "@/providers/ai/ai-analysis.schema";
import type { AIAnalysisInput, AIProvider } from "@/providers/ai/ai-provider";

export function buildMockAnalysis(metrics: AIAnalysisInput["metrics"]): AIAnalysis {
    const achievement = metrics.sales.achievementPercentage;
    const top = metrics.consultants.topPerformers[0];
    const attention = metrics.consultants.attentionRequired[0];
    const outOfStock = metrics.inventory.outOfStockItems.length;
    const critical = metrics.inventory.criticalItems.length;

    const summary =
      achievement >= 100
        ? `${metrics.storeName} encerrou o recorte com ${formatPercent(achievement)} da meta (${formatCurrency(metrics.sales.actual)} de ${formatCurrency(metrics.sales.target)}). O resultado está acima do planejado e exige manutenção do ritmo, com atenção pontual a estoque e clientes inativos.`
        : achievement >= 90
          ? `${metrics.storeName} está em ${formatPercent(achievement)} da meta (${formatCurrency(metrics.sales.actual)} de ${formatCurrency(metrics.sales.target)}). O resultado está próximo do alvo; o gap restante depende de execução comercial nas próximas horas.`
          : `${metrics.storeName} está em ${formatPercent(achievement)} da meta (${formatCurrency(metrics.sales.actual)} de ${formatCurrency(metrics.sales.target)}). O recorte pede correção de ritmo, acompanhamento dos consultores mais distantes e proteção de estoque crítico.`;

    const highlights = [
      top
        ? `${top.name} lidera o time com ${formatCurrency(top.sales)} e ${formatPercent(top.achievementPercentage)} da meta individual.`
        : "Não há consultores suficientes para formar destaque.",
      `Entraram ${metrics.customers.newCustomers} clientes novos no período analisado.`,
      metrics.inventory.decliningLines[0]
        ? `${metrics.inventory.decliningLines[0].name} apresenta tendência de queda e deve ser observada.`
        : "Nenhuma linha com queda relevante foi sinalizada neste recorte.",
    ];

    const attentionPoints = [
      attention
        ? `${attention.name} está em ${formatPercent(attention.achievementPercentage)} da meta individual e precisa de acompanhamento.`
        : "Não há consultores suficientes para formar lista de atenção.",
      outOfStock > 0
        ? `${outOfStock} SKU(s) zerado(s) no recorte, com risco de perda de venda.`
        : "Não há ruptura registrada neste recorte.",
      metrics.customers.inactiveCustomers > 10
        ? `${metrics.customers.inactiveCustomers} clientes inativos concentram oportunidade de recontato.`
        : `${critical} item(ns) em estoque crítico exigem reposição ou priorização de venda.`,
    ];

    const actionPlan = [
      achievement < 100
        ? `Priorize hoje um pulso de 30 minutos com os consultores abaixo de 80% da meta e redistribua abordagem nos horários de maior fluxo.`
        : `Replique a abordagem dos destaques no restante do time e proteja o estoque dos itens de alta demanda.`,
      outOfStock > 0 || critical > 0
        ? `Trate ruptura e estoque crítico antes do pico: valide reposição dos SKUs zerados e ofereça alternativa imediata no PDV.`
        : `Use a lista de clientes inativos para recontato objetivo, com oferta alinhada ao estoque disponível.`,
      metrics.customers.inactiveCustomers >= 8
        ? `Abra uma lista curta de reativação com os ${metrics.customers.inactiveCustomers} clientes inativos e atribua donos no time.`
        : `Mantenha o cadastro de novos clientes com disciplina de follow-up nas próximas 24 horas.`,
    ].slice(0, 3);

    return aiAnalysisSchema.parse({
      executiveSummary: summary,
      highlights,
      attentionPoints,
      actionPlan,
    });
}

export class MockAIProvider implements AIProvider {
  async analyze(input: AIAnalysisInput): Promise<AIAnalysis> {
    return buildMockAnalysis(input.metrics);
  }
}
