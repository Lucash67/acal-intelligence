import type { ReportDelivery } from "@/domain/delivery";
import type { ReportExecution } from "@/domain/execution";
import type { SystemLog } from "@/domain/log";
import type { ExecutiveReport } from "@/domain/report";
import type { StoreProfile } from "@/domain/store";
import { addDays, toIsoDate } from "@/lib/dates";
import { createId } from "@/lib/ids";
import { getMockStoreRawData } from "@/mocks/raw-data";
import { MOCK_STORES } from "@/mocks/stores";
import { buildMockAnalysis } from "@/providers/ai/mock-ai-provider";
import { computeStoreMetrics } from "@/services/analytics-engine";
import { ReportGenerator } from "@/services/report-generator";

export type PersistedReport = ExecutiveReport & {
  executionId: string;
  visualHtml: string | null;
};

type MemoryState = {
  catalogVersion: number;
  stores: StoreProfile[];
  executions: ReportExecution[];
  reports: PersistedReport[];
  deliveries: ReportDelivery[];
  logs: SystemLog[];
  seeded: boolean;
};

const CATALOG_VERSION = 2;
const globalMemory = globalThis as unknown as { acalMemory?: MemoryState };

function emptyState(): MemoryState {
  return {
    catalogVersion: CATALOG_VERSION,
    stores: MOCK_STORES,
    executions: [],
    reports: [],
    deliveries: [],
    logs: [],
    seeded: false,
  };
}

function state(): MemoryState {
  if (!globalMemory.acalMemory || globalMemory.acalMemory.catalogVersion !== CATALOG_VERSION) {
    globalMemory.acalMemory = emptyState();
  }
  globalMemory.acalMemory.stores = MOCK_STORES;
  return globalMemory.acalMemory;
}

export function getMemoryState(): MemoryState {
  const current = state();
  if (!current.seeded) {
    seedMemoryHistory(current);
    current.seeded = true;
  }
  return current;
}

function seedMemoryHistory(current: MemoryState) {
  const generator = new ReportGenerator();
  const today = toIsoDate();
  const yesterday = addDays(today, -1);

  const sample = [
    { storeId: "presidente-kennedy", period: "MORNING" as const, date: yesterday, status: "SUCCESS" as const },
    { storeId: "aldeota", period: "MORNING" as const, date: yesterday, status: "SUCCESS" as const },
    { storeId: "messejana", period: "MORNING" as const, date: yesterday, status: "FAILED" as const },
    { storeId: "conceito-aldeota", period: "AFTERNOON" as const, date: yesterday, status: "SUCCESS" as const },
    { storeId: "parangaba", period: "MORNING" as const, date: today, status: "SUCCESS" as const },
    { storeId: "parque-soledade", period: "MORNING" as const, date: today, status: "SUCCESS" as const },
    { storeId: "limoeiro", period: "MORNING" as const, date: today, status: "FAILED" as const },
  ];

  for (const row of sample) {
    const startedAt = new Date(`${row.date}T${row.period === "MORNING" ? "06:41:00" : "13:38:00"}.000Z`);
    const finishedAt = new Date(startedAt.getTime() + 42_000);
    const executionId = createId();
    const store = current.stores.find((item) => item.id === row.storeId);
    if (!store) continue;

    current.executions.push({
      id: executionId,
      storeId: row.storeId,
      reportType: row.period,
      referenceDate: row.date,
      startedAt: startedAt.toISOString(),
      finishedAt: finishedAt.toISOString(),
      status: row.status,
      error: row.status === "FAILED" ? "Falha simulada no provedor de dados (mock)." : null,
      attempts: row.status === "FAILED" ? 2 : 1,
    });

    current.logs.push({
      id: createId(),
      executionId,
      storeId: row.storeId,
      stage: "START",
      timestamp: startedAt.toISOString(),
      durationMs: 4,
      status: "INFO",
      error: null,
      message: "Execução iniciada.",
    });

    if (row.status === "FAILED") {
      current.logs.push({
        id: createId(),
        executionId,
        storeId: row.storeId,
        stage: "DATA_SOURCE",
        timestamp: finishedAt.toISOString(),
        durationMs: 18,
        status: "FAILED",
        error: "Falha simulada no provedor de dados (mock).",
        message: "Pipeline interrompido nesta loja.",
      });
      current.deliveries.push({
        id: createId(),
        executionId,
        storeId: row.storeId,
        channel: "WHATSAPP",
        recipient: store.manager.phone,
        status: "FAILED",
        attempts: 2,
        sentAt: null,
        error: "Entrega não realizada por falha na execução.",
        createdAt: finishedAt.toISOString(),
      });
      continue;
    }

    const raw = getMockStoreRawData(row.storeId, row.period, row.date);
    const metrics = computeStoreMetrics(raw);
    const report = generator.generate(metrics, buildMockAnalysis(metrics));

    current.reports.push({
      ...report,
      executionId,
      visualHtml: null,
    });
    current.deliveries.push({
      id: createId(),
      executionId,
      storeId: row.storeId,
      channel: "WHATSAPP",
      recipient: store.manager.phone,
      status: "SUCCESS",
      attempts: 1,
      sentAt: finishedAt.toISOString(),
      error: null,
      createdAt: finishedAt.toISOString(),
    });
    current.logs.push({
      id: createId(),
      executionId,
      storeId: row.storeId,
      stage: "FINISH",
      timestamp: finishedAt.toISOString(),
      durationMs: 42,
      status: "SUCCESS",
      error: null,
      message: "Execução concluída com entrega simulada.",
    });
  }
}
