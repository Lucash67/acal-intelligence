import type { ReportPeriod } from "@/domain/period";

export type ConsultantStatus = "HIGHLIGHT" | "STABLE" | "ATTENTION";

export type ConsultantRaw = {
  id: string;
  name: string;
  sales: number;
  target: number;
  conversionRate: number | null;
  status: ConsultantStatus;
};

export type InventoryRawItem = {
  sku: string;
  name: string;
  quantity: number;
  demandFlag: "HIGH" | "NORMAL" | "LOW";
  salesTrend: "UP" | "FLAT" | "DOWN";
  criticalThreshold: number;
};

export type CustomersRaw = {
  newCustomers: number;
  inactiveCustomers: number;
  // TODO(ACAL-BUSINESS): definir quantidade de dias necessária para classificar cliente como inativo.
};

export type StoreRawData = {
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
  };
  consultants: ConsultantRaw[];
  inventory: InventoryRawItem[];
  customers: CustomersRaw;
};
