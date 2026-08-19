import type { ReportPeriod } from "@/domain/period";
import type { ConsultantStatus } from "@/domain/raw-data";

export type ConsultantMetric = {
  id: string;
  name: string;
  sales: number;
  target: number;
  achievementPercentage: number;
  conversionRate: number | null;
  status: ConsultantStatus;
};

export type InventoryMetric = {
  sku: string;
  name: string;
  quantity: number;
  demandFlag: "HIGH" | "NORMAL" | "LOW";
  salesTrend: "UP" | "FLAT" | "DOWN";
};

export type StoreMetrics = {
  storeId: string;
  storeName: string;
  managerName: string;
  managerPhone: string;
  city: string;
  referenceDate: string;
  period: ReportPeriod;
  sales: {
    target: number;
    actual: number;
    achievementPercentage: number;
  };
  consultants: {
    topPerformers: ConsultantMetric[];
    attentionRequired: ConsultantMetric[];
    all: ConsultantMetric[];
  };
  inventory: {
    criticalItems: InventoryMetric[];
    outOfStockItems: InventoryMetric[];
    decliningLines: InventoryMetric[];
  };
  customers: {
    newCustomers: number;
    inactiveCustomers: number;
  };
};
