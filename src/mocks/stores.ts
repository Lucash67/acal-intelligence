import type { ManagerProfile, StoreProfile } from "@/domain/store";

function manager(id: string, name: string, phone: string): ManagerProfile {
  return { id, name, phone, provenance: "MOCK" };
}

function targets(monthly: number, sellingDays: number) {
  return {
    monthlyTarget: monthly,
    sellingDays,
    dailyTarget: Math.round(monthly / sellingDays),
  };
}

function commercial(
  partial: Omit<
    StoreProfile,
    | "state"
    | "timezone"
    | "erpCode"
    | "biCode"
    | "sourceStatus"
    | "status"
    | "notes"
    | "monthlyTarget"
    | "sellingDays"
    | "dailyTarget"
  > & {
    notes?: string | null;
    monthly: number;
    sellingDays: number;
  },
): StoreProfile {
  const { monthly, sellingDays, ...rest } = partial;
  return {
    ...rest,
    ...targets(monthly, sellingDays),
    state: "CE",
    timezone: "America/Fortaleza",
    status: "ACTIVE",
    sourceStatus: "PUBLIC_CONFIRMED",
    notes: partial.notes ?? null,
    erpCode: null,
    biCode: null,
  };
}

/**
 * Metas mensais são MOCK, na ordem de grandeza de home center cearense.
 * Âncora: Aldeota ~R$ 500–600 mil/mês (informação interna de operação, sem ERP/BI).
 * Demais lojas: escalonadas por porte público (m², horário, capital vs interior).
 * Projeções de imprensa (ex.: R$ 24–30 mi/ano em Maracanaú) não entram como fato.
 * Relatório matinal continua em meta diária = mensal / dias de venda.
 */
export const MOCK_STORES: StoreProfile[] = [
  commercial({
    id: "presidente-kennedy",
    name: "Loja Presidente Kennedy",
    city: "Fortaleza",
    neighborhood: "Presidente Kennedy",
    address: "Av. Cearenses, 423",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–20h; Sáb 8h–15h; Dom fechada",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 470000,
    sellingDays: 24,
    manager: manager("mgr-pk", "Helena Duarte", "+55 85 99101-0101"),
  }),
  commercial({
    id: "aldeota",
    name: "Loja Aldeota",
    city: "Fortaleza",
    neighborhood: "Aldeota",
    address: "Av. Desembargador Moreira, 2211",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–20h; Sáb 8h–15h; Dom 8h–14h",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 550000,
    sellingDays: 26,
    notes:
      "Âncora MOCK de faturamento: ordem de grandeza informada internamente (~R$ 500–600 mil/mês). Não é extração de ERP/BI. Demais lojas foram escaladas por porte público (m², horário, interior vs capital).",
    manager: manager("mgr-aldeota", "Rafael Moura", "+55 85 99102-0202"),
  }),
  commercial({
    id: "messejana",
    name: "Loja Messejana",
    city: "Fortaleza",
    neighborhood: "Messejana",
    address: "Av. Washington Soares, 10008",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–20h; Sáb 8h–15h; Dom fechada",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 420000,
    sellingDays: 24,
    manager: manager("mgr-messejana", "Marina Costa", "+55 85 99103-0303"),
  }),
  commercial({
    id: "parangaba",
    name: "Loja Parangaba",
    city: "Fortaleza",
    neighborhood: "Parangaba",
    address: "Av. Godofredo Maciel, 767",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–19h; Sáb 8h–15h; Dom 8h–14h",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 400000,
    sellingDays: 26,
    manager: manager("mgr-parangaba", "Paulo Mendes", "+55 85 99104-0404"),
  }),
  commercial({
    id: "centro",
    name: "Loja Centro",
    city: "Fortaleza",
    neighborhood: "Centro",
    address: "Av. Tristão Gonçalves, 1074",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–18h; Sáb 8h–15h; Dom fechada",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 440000,
    sellingDays: 24,
    notes: "Imprensa (2019) descreve a loja do Centro como tão grande quanto ou maior que a home center da Aldeota; horário público é mais curto, então o MOCK mensal fica um pouco abaixo da Aldeota.",
    manager: manager("mgr-centro", "Camila Freitas", "+55 85 99105-0505"),
  }),
  commercial({
    id: "conceito-aldeota",
    name: "Loja Conceito Aldeota",
    city: "Fortaleza",
    neighborhood: "Aldeota",
    address: "Av. Antônio Sales, 3210",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 9h–18h; Sáb 9h–13h; Dom fechada",
    unitType: "CONCEPT_STORE",
    reportEnabled: true,
    monthly: 220000,
    sellingDays: 23,
    notes: "Porte público ~500–600 m² (O Povo, 2019) contra ~2.000 m² de venda da home center Aldeota. MOCK mensal proporcional, mix premium.",
    manager: manager("mgr-conceito", "Eduardo Pires", "+55 85 99108-0808"),
  }),
  commercial({
    id: "parque-soledade",
    name: "Loja Parque Soledade",
    city: "Caucaia",
    neighborhood: "Parque Soledade",
    address: "Rua Coronel Correia, 2273",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–18h; Sáb 8h–15h; Dom fechada",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 300000,
    sellingDays: 24,
    manager: manager("mgr-caucaia", "Diego Azevedo", "+55 85 99106-0606"),
  }),
  commercial({
    id: "maracanau-almir-pinto",
    name: "Loja Rodovia Senador Almir Pinto",
    city: "Maracanaú",
    neighborhood: "Parque Tijuca",
    address: "Rodovia Senador Almir Pinto, 10101 – Lote 11",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–19h; Sáb 8h–15h; Dom fechada",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 360000,
    sellingDays: 24,
    notes: "Imprensa citou R$ 24–30 mi/ano na inauguração (projeção de investimento, não balanço). MOCK ficou abaixo disso e abaixo da Aldeota, alinhado à âncora interna.",
    manager: manager("mgr-maracanau", "Beatriz Ramos", "+55 85 99107-0707"),
  }),
  commercial({
    id: "sobral-junco",
    name: "Loja Junco",
    city: "Sobral",
    neighborhood: "Junco",
    address: "Av. Cleto Ferreira da Ponte, 1288",
    publicPhone: "(88) 9 8109-7766",
    publicHours: "Seg–Sex 8h–18:30; Sáb 8h–13h; Dom fechada",
    unitType: "SHOWROOM",
    reportEnabled: true,
    monthly: 200000,
    sellingDays: 23,
    notes: "Site atual lista como Loja Junco. Imprensa de 2024 descreve showroom/primeira franquia — modelo INDICADO, não classificação corporativa definitiva.",
    manager: manager("mgr-sobral", "Lívia Castro", "+55 88 99109-0909"),
  }),
  commercial({
    id: "aracati-campo-verde",
    name: "Campo Verde",
    city: "Aracati",
    neighborhood: "Campo Verde",
    address: "R. Dragão do Mar, 1086A",
    publicPhone: "(88) 9254-4535",
    publicHours: "Seg–Sex 8h–19h; Sáb 8h–16h; Dom fechada",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 185000,
    sellingDays: 24,
    notes: "Unidade pública confirmada. Tipo operacional (própria/franquia) INTERNAL_PENDING.",
    manager: manager("mgr-aracati", "Thiago Nogueira", "+55 88 99110-1010"),
  }),
  commercial({
    id: "limoeiro",
    name: "Limoeiro",
    city: "Limoeiro do Norte",
    neighborhood: "Limoeiro",
    address: "Av. Dom Aureliano Matos, 883",
    publicPhone: "(88) 92145-5956",
    publicHours: "Seg–Sex 8h–19h; Sáb 8h–16h; Dom fechada",
    unitType: "STORE",
    reportEnabled: true,
    monthly: 165000,
    sellingDays: 24,
    notes: "Unidade pública confirmada. Tipo operacional (própria/franquia) INTERNAL_PENDING.",
    manager: manager("mgr-limoeiro", "Sofia Barros", "+55 88 99111-1111"),
  }),
  {
    id: "administracao-rodolfo-teofilo",
    name: "Administração Rodolfo Teófilo",
    city: "Fortaleza",
    state: "CE",
    neighborhood: "Rodolfo Teófilo",
    address: "Rua Padre Cícero, 400",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–17h",
    unitType: "ADMINISTRATION",
    status: "ACTIVE",
    reportEnabled: false,
    timezone: "America/Fortaleza",
    monthlyTarget: 0,
    sellingDays: 22,
    dailyTarget: 0,
    manager: manager("mgr-admin", "Equipe administrativa (simulado)", "+55 85 99112-0000"),
    sourceStatus: "PUBLIC_CONFIRMED",
    notes: "Listada à parte das lojas. Sem relatório de gerente de loja até a Acal decidir o contrário.",
    erpCode: null,
    biCode: null,
  },
  {
    id: "cd-rodolfo-teofilo",
    name: "Centro de Distribuição Rodolfo Teófilo",
    city: "Fortaleza",
    state: "CE",
    neighborhood: "Rodolfo Teófilo",
    address: "Rua Pastor Samuel Munguba, 360",
    publicPhone: "(85) 3492-5000",
    publicHours: "Seg–Sex 8h–17h; Sáb 8h–12h",
    unitType: "DISTRIBUTION_CENTER",
    status: "ACTIVE",
    reportEnabled: false,
    timezone: "America/Fortaleza",
    monthlyTarget: 0,
    sellingDays: 24,
    dailyTarget: 0,
    manager: manager("mgr-cd", "Operação de CD (simulado)", "+55 85 99113-0000"),
    sourceStatus: "PUBLIC_CONFIRMED",
    notes: "Listada à parte das lojas. Sem relatório de gerente de loja até a Acal decidir o contrário.",
    erpCode: null,
    biCode: null,
  },
  {
    id: "conceito-eusebio",
    name: "Acal Conceito Eusébio",
    city: "Eusébio",
    state: "CE",
    neighborhood: "Mall Marché",
    address: "Av. Eusébio de Queiroz, 2850",
    publicPhone: null,
    publicHours: null,
    unitType: "CONCEPT_STORE",
    status: "INACTIVE",
    reportEnabled: false,
    timezone: "America/Fortaleza",
    monthlyTarget: 0,
    sellingDays: 0,
    dailyTarget: 0,
    manager: manager("mgr-eusebio", "A validar", "-"),
    sourceStatus: "CONFLICTING",
    notes: "Imprensa e Instagram de 2024 citam inauguração no Mall Marché. Ausente da listagem oficial “Nossas Lojas” em 18/08/2026. Não entra no fluxo gerencial.",
    erpCode: null,
    biCode: null,
  },
];

export function getMockStore(storeId: string): StoreProfile | undefined {
  return MOCK_STORES.find((store) => store.id === storeId);
}

export function listReportableStores(): StoreProfile[] {
  return MOCK_STORES.filter((store) => store.reportEnabled && store.status === "ACTIVE");
}
