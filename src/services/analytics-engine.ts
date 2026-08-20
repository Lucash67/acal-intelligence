import type { ConsultantMetric, InventoryMetric, StoreMetrics } from "@/domain/metrics";
import type { StoreRawData } from "@/domain/raw-data";

function roundPercent(value: number): number {
  return Math.round(value * 10) / 10;
}

export function achievementPercent(actual: number, target: number): number {
  if (target <= 0) return 0;
  return roundPercent((actual / target) * 100);
}

function toConsultantMetric(input: StoreRawData["consultants"][number]): ConsultantMetric {
  return {
    id: input.id,
    name: input.name,
    sales: input.sales,
    target: input.target,
    achievementPercentage: achievementPercent(input.sales, input.target),
    conversionRate: input.conversionRate,
    status: input.status,
  };
}

function toInventoryMetric(input: StoreRawData["inventory"][number]): InventoryMetric {
  return {
    sku: input.sku,
    name: input.name,
    quantity: input.quantity,
    demandFlag: input.demandFlag,
    salesTrend: input.salesTrend,
  };
}

export function computeStoreMetrics(raw: StoreRawData): StoreMetrics {
  const consultants = raw.consultants
    .map(toConsultantMetric)
    .sort((a, b) => b.achievementPercentage - a.achievementPercentage || b.sales - a.sales);

  // TODO(ACAL-BUSINESS): confirmar se a lista de atenção deve usar atingimento, conversão, distância da meta ou combinação oficial.
  const attentionRequired = [...consultants]
    .sort((a, b) => a.achievementPercentage - b.achievementPercentage || a.sales - b.sales)
    .slice(0, 3);

  const outOfStockItems = raw.inventory
    .filter((item) => item.quantity === 0)
    .map(toInventoryMetric);

  // TODO(ACAL-BUSINESS): confirmar regra oficial de estoque crítico (threshold por SKU, cobertura, ruptura projetada).
  const criticalItems = raw.inventory
    .filter((item) => item.quantity > 0 && item.quantity <= item.criticalThreshold)
    .map(toInventoryMetric);

  // TODO(ACAL-BUSINESS): definir o que caracteriza queda relevante de vendas por linha.
  const decliningLines = raw.inventory
    .filter((item) => item.salesTrend === "DOWN")
    .map(toInventoryMetric);

  return {
    storeId: raw.storeId,
    storeName: raw.storeName,
    managerName: raw.managerName,
    managerPhone: raw.managerPhone,
    city: raw.city,
    referenceDate: raw.referenceDate,
    period: raw.period,
    sales: {
      target: raw.sales.target,
      actual: raw.sales.actual,
      achievementPercentage: achievementPercent(raw.sales.actual, raw.sales.target),
    },
    consultants: {
      topPerformers: consultants.slice(0, 3),
      attentionRequired,
      all: consultants,
    },
    inventory: {
      criticalItems,
      outOfStockItems,
      decliningLines,
    },
    customers: {
      newCustomers: raw.customers.newCustomers,
      inactiveCustomers: raw.customers.inactiveCustomers,
    },
  };
}

export class AnalyticsEngine {
  compute(raw: StoreRawData): StoreMetrics {
    return computeStoreMetrics(raw);
  }
}
