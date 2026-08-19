import { toIsoDate } from "@/lib/dates";
import { getNextScheduledRun } from "@/jobs/schedules";
import { env, isDatabaseConfigured, isMockMode, isOpenAiConfigured } from "@/lib/env";
import { listDeliveries, listExecutions, listLogs, listReports, listStores } from "@/repositories";
import { computeStoreMetrics } from "@/services/analytics-engine";
import { isReportableStore } from "@/domain/store";
import { getMockStoreRawData } from "@/mocks/raw-data";

export async function getOverviewData() {
  const [stores, executions, deliveries, reports, logs] = await Promise.all([
    listStores(),
    listExecutions(),
    listDeliveries(),
    listReports(),
    listLogs(),
  ]);

  const today = toIsoDate();
  const next = getNextScheduledRun();
  const todayReports = reports.filter((report) => report.generatedAt.slice(0, 10) === today);
  const todayDeliveries = deliveries.filter((item) => item.createdAt.slice(0, 10) === today && item.status === "SUCCESS");
  const failures = executions.filter((item) => item.status === "FAILED").length;
  const aiUsage = logs.filter((item) => item.stage === "AI_ANALYSIS").length;

  return {
    stores,
    executions: executions.slice(0, 8),
    nextRun: {
      name: next.schedule.name,
      at: next.at.toISOString(),
      processingTime: next.schedule.processingTime,
    },
    reportsToday: todayReports.length,
    deliveriesToday: todayDeliveries.length,
    failures,
    aiUsage,
    systemStatus: "ESTRUTURA PÚBLICA • DADOS SIMULADOS",
    mockMode: isMockMode(),
    database: isDatabaseConfigured(),
  };
}

export async function getIndicators() {
  const stores = await listStores();
  const today = toIsoDate();

  return stores.filter(isReportableStore).map((store) => {
    const metrics = computeStoreMetrics(getMockStoreRawData(store.id, "MORNING", today));
    return {
      store,
      metrics,
    };
  });
}

export function getRuntimeConfig() {
  return {
    mockMode: isMockMode(),
    databaseConfigured: isDatabaseConfigured(),
    openaiConfigured: isOpenAiConfigured(),
    dataSourceProvider: env.dataSourceProvider,
    aiProvider: isOpenAiConfigured() && env.aiProvider === "openai" ? "openai" : "mock",
    messagingProvider: "mock",
  };
}
