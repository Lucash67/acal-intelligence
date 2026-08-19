import type { ReportPeriod } from "@/domain/period";
import { isReportableStore } from "@/domain/store";
import { deliveryKey, executionKey, reportKey } from "@/lib/demo-keys";
import { getMockStoreRawData } from "@/mocks/raw-data";
import { getMockStore } from "@/mocks/stores";
import { buildMockAnalysis } from "@/providers/ai/mock-ai-provider";
import type { PersistedReport } from "@/repositories/memory-store";
import { computeStoreMetrics } from "@/services/analytics-engine";
import { ReportGenerator } from "@/services/report-generator";
import { renderExecutiveReportHtml } from "@/templates/morning-report-html";

export function buildDemoReport(
  storeId: string,
  period: ReportPeriod,
  date: string,
): PersistedReport | null {
  const store = getMockStore(storeId);
  if (!store || !isReportableStore(store)) return null;

  const raw = getMockStoreRawData(storeId, period, date);
  const metrics = computeStoreMetrics(raw);
  const report = new ReportGenerator().generate(metrics, buildMockAnalysis(metrics), reportKey(storeId, period, date));

  return {
    ...report,
    executionId: executionKey(storeId, period, date),
    visualHtml: renderExecutiveReportHtml(report),
  };
}

export function demoDeliveryId(storeId: string, period: ReportPeriod, date: string) {
  return deliveryKey(storeId, period, date);
}
