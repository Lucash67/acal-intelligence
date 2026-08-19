import type { AIAnalysis } from "@/domain/ai";
import type { StoreMetrics } from "@/domain/metrics";
import type { ReportPeriod } from "@/domain/period";

export type ExecutiveReport = {
  id: string;
  storeId: string;
  storeName: string;
  managerName: string;
  period: ReportPeriod;
  referenceDate: string;
  generatedAt: string;
  title: string;
  metrics: StoreMetrics;
  analysis: AIAnalysis;
};
