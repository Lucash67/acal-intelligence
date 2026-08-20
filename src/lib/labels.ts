export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    SUCCESS: "Sucesso",
    FAILED: "Falha",
    PENDING: "Pendente",
    PROCESSING: "Processando",
    RETRYING: "Nova tentativa",
    ACTIVE: "Ativa",
    INACTIVE: "Inativa",
    INFO: "Informação",
    MORNING: "Matinal",
    AFTERNOON: "Vespertino",
    WHATSAPP: "WhatsApp",
    START: "Início",
    DATA_SOURCE: "Fonte de dados",
    VALIDATION: "Validação",
    ANALYTICS: "Indicadores",
    AI_ANALYSIS: "Inteligência",
    REPORT: "Relatório",
    VISUAL_RENDER: "Card visual",
    DELIVERY: "Entrega",
    FINISH: "Conclusão",
    PUBLIC_CONFIRMED: "Público confirmado",
    PUBLIC_INFERRED: "Inferido",
    MOCK: "Simulado",
    INTERNAL_PENDING: "Pendente interno",
    INTERNAL_CONFIRMED: "Interno confirmado",
    CONFLICTING: "Conflitante",
    STORE: "Home center",
    CONCEPT_STORE: "Conceito",
    SHOWROOM: "Showroom",
    ADMINISTRATION: "Administração",
    DISTRIBUTION_CENTER: "Centro de distribuição",
  };

  return labels[status] ?? status;
}

export function providerLabel(value: string): string {
  const labels: Record<string, string> = {
    mock: "Simulado",
    openai: "OpenAI",
    zapi: "Z-API",
  };
  return labels[value] ?? value;
}
