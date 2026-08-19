import type { ConsultantRaw, InventoryRawItem, StoreRawData } from "@/domain/raw-data";
import type { ReportPeriod } from "@/domain/period";
import { listReportableStores, MOCK_STORES } from "@/mocks/stores";

type StoreScenario = {
  salesFactor: number;
  newCustomers: number;
  inactiveCustomers: number;
  consultants: ConsultantRaw[];
  inventory: InventoryRawItem[];
};

const CONSULTANT_BASELINE_DAILY: Record<string, number> = {
  "presidente-kennedy": 22000,
  aldeota: 28000,
  messejana: 20000,
  parangaba: 19000,
  centro: 18000,
  "conceito-aldeota": 16000,
  "parque-soledade": 15000,
  "maracanau-almir-pinto": 17000,
  "sobral-junco": 12000,
  "aracati-campo-verde": 11000,
  limoeiro: 10000,
};

const SCENARIOS: Record<string, StoreScenario> = {
  "presidente-kennedy": {
    salesFactor: 1.18,
    newCustomers: 9,
    inactiveCustomers: 4,
    consultants: [
      consultant("c-pk-1", "Lara Figueiredo", 7200, 4500, 0.34, "HIGHLIGHT"),
      consultant("c-pk-2", "Nicolas Prado", 6100, 4500, 0.29, "HIGHLIGHT"),
      consultant("c-pk-3", "Isabela Monteiro", 4800, 4000, 0.24, "STABLE"),
      consultant("c-pk-4", "Caio Tavares", 3140, 4000, 0.18, "STABLE"),
    ],
    inventory: [
      item("SKU-TINT-01", "Tinta acrílica 18L", 2, "HIGH", "UP", 3),
      item("SKU-PISO-04", "Porcelanato 60x60", 0, "HIGH", "FLAT", 4),
      item("SKU-REJ-18", "Rejunte 5kg", 18, "NORMAL", "UP", 6),
    ],
  },
  aldeota: {
    salesFactor: 0.97,
    newCustomers: 6,
    inactiveCustomers: 8,
    consultants: [
      consultant("c-ald-1", "Helena Vasques", 6800, 5500, 0.31, "HIGHLIGHT"),
      consultant("c-ald-2", "Pedro Alcântara", 5400, 5500, 0.22, "STABLE"),
      consultant("c-ald-3", "Rita Campos", 4900, 5000, 0.2, "STABLE"),
      consultant("c-ald-4", "Jonas Ribeiro", 4240, 6000, 0.14, "ATTENTION"),
    ],
    inventory: [
      item("SKU-LOU-10", "Louça sanitária linha básica", 5, "HIGH", "UP", 6),
      item("SKU-TOR-21", "Torneira monocomando", 11, "NORMAL", "FLAT", 4),
      item("SKU-ARG-30", "Argamassa AC-III", 3, "NORMAL", "DOWN", 5),
    ],
  },
  messejana: {
    salesFactor: 0.71,
    newCustomers: 3,
    inactiveCustomers: 14,
    consultants: [
      consultant("c-mes-1", "Amanda Lemos", 4100, 3800, 0.21, "STABLE"),
      consultant("c-mes-2", "Felipe Andrade", 2900, 3800, 0.13, "ATTENTION"),
      consultant("c-mes-3", "Júlia Farias", 2200, 3700, 0.11, "ATTENTION"),
      consultant("c-mes-4", "Renan Teixeira", 1450, 3700, 0.08, "ATTENTION"),
    ],
    inventory: [
      item("SKU-TEL-02", "Telha cerâmica", 1, "HIGH", "DOWN", 4),
      item("SKU-CIB-15", "Cimento 50kg", 0, "NORMAL", "DOWN", 5),
      item("SKU-ARE-08", "Areia média", 7, "LOW", "DOWN", 4),
    ],
  },
  parangaba: {
    salesFactor: 1.09,
    newCustomers: 11,
    inactiveCustomers: 5,
    consultants: [
      consultant("c-par-1", "Bianca Lopes", 7900, 5000, 0.36, "HIGHLIGHT"),
      consultant("c-par-2", "Gustavo Pena", 5600, 5000, 0.25, "HIGHLIGHT"),
      consultant("c-par-3", "Clara Nunes", 4700, 5000, 0.19, "STABLE"),
      consultant("c-par-4", "Otávio Reis", 3600, 5000, 0.16, "ATTENTION"),
    ],
    inventory: [
      item("SKU-PIS-40", "Piso vinílico caixa", 8, "HIGH", "UP", 5),
      item("SKU-ROD-55", "Rodapé MDF 7cm", 22, "NORMAL", "UP", 8),
      item("SKU-IMP-70", "Impermeabilizante 18L", 4, "HIGH", "FLAT", 6),
    ],
  },
  centro: {
    salesFactor: 0.82,
    newCustomers: 4,
    inactiveCustomers: 11,
    consultants: [
      consultant("c-cen-1", "Patrícia Melo", 5200, 4000, 0.27, "HIGHLIGHT"),
      consultant("c-cen-2", "Leandro Dias", 3100, 4000, 0.15, "ATTENTION"),
      consultant("c-cen-3", "Sabrina Ortiz", 2800, 4000, 0.12, "ATTENTION"),
      consultant("c-cen-4", "Hugo Martins", 2020, 4000, 0.09, "ATTENTION"),
    ],
    inventory: [
      item("SKU-TIN-11", "Esmalte sintético 3,6L", 0, "HIGH", "DOWN", 5),
      item("SKU-BRO-12", "Broxa 4\"", 2, "HIGH", "DOWN", 4),
      item("SKU-MAS-33", "Massa corrida 25kg", 14, "NORMAL", "FLAT", 6),
    ],
  },
  "conceito-aldeota": {
    salesFactor: 1.14,
    newCustomers: 8,
    inactiveCustomers: 6,
    consultants: [
      consultant("c-coa-1", "Valentina Serra", 9800, 7000, 0.39, "HIGHLIGHT"),
      consultant("c-coa-2", "Henrique Lima", 8100, 7000, 0.31, "HIGHLIGHT"),
      consultant("c-coa-3", "Lorena Dias", 7200, 7000, 0.27, "STABLE"),
      consultant("c-coa-4", "César Antunes", 6820, 7000, 0.23, "STABLE"),
    ],
    inventory: [
      item("SKU-POR-01", "Porcelanato retificado 90x90", 3, "HIGH", "UP", 4),
      item("SKU-MET-14", "Metais linha premium", 6, "HIGH", "UP", 5),
      item("SKU-CUB-29", "Cuba de apoio", 1, "HIGH", "FLAT", 3),
    ],
  },
  "parque-soledade": {
    salesFactor: 0.94,
    newCustomers: 5,
    inactiveCustomers: 7,
    consultants: [
      consultant("c-sol-1", "Daniela Rocha", 4700, 3500, 0.28, "HIGHLIGHT"),
      consultant("c-sol-2", "Igor Batista", 3600, 3500, 0.21, "STABLE"),
      consultant("c-sol-3", "Tatiane Cruz", 2900, 3500, 0.17, "STABLE"),
      consultant("c-sol-4", "Vinícius Lopes", 1960, 3500, 0.1, "ATTENTION"),
    ],
    inventory: [
      item("SKU-TUB-08", "Tubo PVC 100mm", 0, "HIGH", "UP", 6),
      item("SKU-CON-19", "Conexão esgoto 100mm", 0, "HIGH", "UP", 6),
      item("SKU-REG-27", "Registro 3/4", 3, "HIGH", "FLAT", 5),
    ],
  },
  "maracanau-almir-pinto": {
    salesFactor: 1.22,
    newCustomers: 16,
    inactiveCustomers: 3,
    consultants: [
      consultant("c-mar-1", "Elisa Carvalho", 5100, 3000, 0.33, "HIGHLIGHT"),
      consultant("c-mar-2", "Marcelo Pinto", 3900, 3000, 0.26, "HIGHLIGHT"),
      consultant("c-mar-3", "Nina Azevedo", 3100, 3000, 0.22, "STABLE"),
      consultant("c-mar-4", "Ruan Oliveira", 2540, 3000, 0.18, "STABLE"),
    ],
    inventory: [
      item("SKU-BLO-50", "Bloco cerâmico 9x19x19", 9, "HIGH", "UP", 4),
      item("SKU-VER-60", "Vergalhão 3/8", 12, "NORMAL", "UP", 5),
      item("SKU-ARAM-71", "Arame recozido", 21, "LOW", "FLAT", 6),
    ],
  },
  "sobral-junco": {
    salesFactor: 0.88,
    newCustomers: 2,
    inactiveCustomers: 19,
    consultants: [
      consultant("c-sob-1", "Aline Cardoso", 3400, 2800, 0.2, "STABLE"),
      consultant("c-sob-2", "Bruno Falcão", 2700, 2800, 0.16, "STABLE"),
      consultant("c-sob-3", "Cíntia Moraes", 2100, 2700, 0.12, "ATTENTION"),
      consultant("c-sob-4", "Davi Queiroz", 1480, 2700, 0.09, "ATTENTION"),
    ],
    inventory: [
      item("SKU-REV-11", "Revestimento 33x57", 16, "NORMAL", "DOWN", 8),
      item("SKU-SIT-22", "Sika / adesivo obra", 4, "NORMAL", "DOWN", 6),
      item("SKU-BOI-33", "Boia caixa d'água", 0, "NORMAL", "FLAT", 5),
    ],
  },
  "aracati-campo-verde": {
    salesFactor: 1.02,
    newCustomers: 7,
    inactiveCustomers: 9,
    consultants: [
      consultant("c-ara-1", "Fernanda Brito", 6100, 4800, 0.3, "HIGHLIGHT"),
      consultant("c-ara-2", "Gabriel Souza", 5000, 4800, 0.23, "STABLE"),
      consultant("c-ara-3", "Helena Paiva", 4300, 4700, 0.19, "STABLE"),
      consultant("c-ara-4", "Iago Mendes", 3980, 4700, 0.15, "ATTENTION"),
    ],
    inventory: [
      item("SKU-PIS-14", "Piso cerâmico 45x45", 5, "HIGH", "UP", 6),
      item("SKU-TIN-51", "Textura 25kg", 8, "NORMAL", "FLAT", 4),
      item("SKU-ESC-62", "Escada alumínio 6 degraus", 2, "HIGH", "DOWN", 5),
    ],
  },
  limoeiro: {
    salesFactor: 1.16,
    newCustomers: 13,
    inactiveCustomers: 2,
    consultants: [
      consultant("c-lim-1", "Júlia Amaral", 6400, 4300, 0.35, "HIGHLIGHT"),
      consultant("c-lim-2", "Kevin Duarte", 5300, 4300, 0.28, "HIGHLIGHT"),
      consultant("c-lim-3", "Lívia Torres", 4100, 4200, 0.21, "STABLE"),
      consultant("c-lim-4", "Murilo Castro", 3920, 4200, 0.18, "STABLE"),
    ],
    inventory: [
      item("SKU-TOR-01", "Chuveiro elétrico", 7, "HIGH", "UP", 5),
      item("SKU-CAB-18", "Cabo flexível 2,5mm", 4, "HIGH", "UP", 6),
      item("SKU-DIS-30", "Disjuntor 20A", 19, "NORMAL", "FLAT", 8),
    ],
  },
};

function consultant(
  id: string,
  name: string,
  sales: number,
  target: number,
  conversionRate: number,
  status: ConsultantRaw["status"],
): ConsultantRaw {
  return { id, name, sales, target, conversionRate, status };
}

function item(
  sku: string,
  name: string,
  quantity: number,
  demandFlag: InventoryRawItem["demandFlag"],
  salesTrend: InventoryRawItem["salesTrend"],
  criticalThreshold: number,
): InventoryRawItem {
  return { sku, name, quantity, demandFlag, salesTrend, criticalThreshold };
}

export function getMockStoreRawData(
  storeId: string,
  period: ReportPeriod,
  referenceDate: string,
): StoreRawData {
  const store = MOCK_STORES.find((item) => item.id === storeId);
  const scenario = SCENARIOS[storeId];

  if (!store || !scenario) {
    throw new Error(`Mock operational data not found for unit ${storeId}`);
  }

  const periodFactor = period === "AFTERNOON" ? 0.62 : 1;
  const consultantScale = store.dailyTarget / (CONSULTANT_BASELINE_DAILY[storeId] ?? store.dailyTarget);

  return {
    storeId: store.id,
    storeName: store.name,
    managerName: store.manager.name,
    managerPhone: store.manager.phone,
    city: store.city,
    referenceDate,
    period,
    sales: {
      target: store.dailyTarget,
      actual: Math.round(store.dailyTarget * scenario.salesFactor * periodFactor),
    },
    consultants: scenario.consultants.map((consultantRow) => ({
      ...consultantRow,
      sales: Math.round(consultantRow.sales * consultantScale * periodFactor),
      target: Math.round(consultantRow.target * consultantScale),
    })),
    inventory: scenario.inventory,
    customers: {
      newCustomers: Math.max(0, Math.round(scenario.newCustomers * periodFactor)),
      inactiveCustomers: scenario.inactiveCustomers,
    },
  };
}

export function listMockStoreIds(): string[] {
  return listReportableStores().map((store) => store.id);
}
