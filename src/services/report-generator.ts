import type { AIAnalysis } from "@/domain/ai";
import type { StoreMetrics } from "@/domain/metrics";
import type { ExecutiveReport } from "@/domain/report";
import { periodLabel } from "@/lib/dates";
import { createId } from "@/lib/ids";

export class ReportGenerator {
  generate(metrics: StoreMetrics, analysis: AIAnalysis, id = createId()): ExecutiveReport {
    return {
      id,
      storeId: metrics.storeId,
      storeName: metrics.storeName,
      managerName: metrics.managerName,
      period: metrics.period,
      referenceDate: metrics.referenceDate,
      generatedAt: new Date().toISOString(),
      title: `Relatório ${periodLabel(metrics.period)} · ${metrics.storeName}`,
      metrics,
      analysis,
    };
  }
}
