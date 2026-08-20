import { projectMonthly, type StoreProfile } from "@/domain/store";
import { addDays, toIsoDate } from "@/lib/dates";
import { getMockStoreRawData } from "@/mocks/raw-data";
import { achievementPercent, computeStoreMetrics } from "@/services/analytics-engine";

export function d1Date(from = toIsoDate()): string {
  return addDays(from, -1);
}

export function getStoreSalesSnapshot(store: StoreProfile, referenceDate = d1Date()) {
  const metrics = computeStoreMetrics(getMockStoreRawData(store.id, "MORNING", referenceDate));
  const monthlySales = projectMonthly(store, metrics.sales.actual);

  return {
    referenceDate,
    metrics,
    dailySales: metrics.sales.actual,
    dailyTarget: metrics.sales.target,
    dailyAchievement: metrics.sales.achievementPercentage,
    monthlySales,
    monthlyTarget: store.monthlyTarget,
    monthlyAchievement: achievementPercent(monthlySales, store.monthlyTarget),
  };
}

export function salesPeriodLabels(period: "MORNING" | "AFTERNOON") {
  return {
    sales: period === "AFTERNOON" ? "Vendas parciais" : "Vendas D-1",
    target: "Meta do dia",
  };
}
