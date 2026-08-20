import { toIsoDate } from "@/lib/dates";
import { AUTOMATION_SCHEDULES, getNextScheduledRun } from "@/jobs/schedules";
import { env, isDatabaseConfigured, isMockMode, isOpenAiConfigured, isZapiConfigured } from "@/lib/env";
import { listDeliveries, listExecutions, listLogs, listReports, listStores } from "@/repositories";
import { isReportableStore } from "@/domain/store";
import { d1Date, getStoreSalesSnapshot } from "@/services/sales-snapshot";

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
    systemStatus: "Estrutura pública · dados simulados",
    mockMode: isMockMode(),
    database: isDatabaseConfigured(),
  };
}

export async function getIndicators() {
  const stores = await listStores();
  const referenceDate = d1Date();

  return stores.filter(isReportableStore).map((store) => {
    const snapshot = getStoreSalesSnapshot(store, referenceDate);
    return {
      store,
      ...snapshot,
    };
  });
}

export async function getAutomationCycles() {
  const [executions, deliveries, stores] = await Promise.all([
    listExecutions(),
    listDeliveries(),
    listStores(),
  ]);

  return AUTOMATION_SCHEDULES.map((schedule) => {
    const periodExecutions = executions.filter((item) => item.reportType === schedule.period);
    const latest = periodExecutions[0] ?? null;
    const batch = latest
      ? periodExecutions.filter((item) => item.referenceDate === latest.referenceDate)
      : [];

    return {
      schedule,
      latest,
      success: batch.filter((item) => item.status === "SUCCESS").length,
      failed: batch.filter((item) => item.status === "FAILED").length,
      sent: deliveries.filter(
        (item) => batch.some((execution) => execution.id === item.executionId) && item.status === "SUCCESS",
      ).length,
      rows: batch.slice(0, 8).map((execution) => ({
        execution,
        storeName: stores.find((store) => store.id === execution.storeId)?.name ?? execution.storeId,
        delivery: deliveries.find((item) => item.executionId === execution.id) ?? null,
      })),
    };
  });
}

export function getRuntimeConfig() {
  return {
    mockMode: isMockMode(),
    databaseConfigured: isDatabaseConfigured(),
    openaiConfigured: isOpenAiConfigured(),
    zapiConfigured: isZapiConfigured(),
    dataSourceProvider: env.dataSourceProvider,
    aiProvider: isOpenAiConfigured() && env.aiProvider === "openai" ? "openai" : "mock",
    messagingProvider: "mock",
  };
}
