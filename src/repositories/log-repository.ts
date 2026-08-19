import type { SystemLog } from "@/domain/log";
import { tryPrisma } from "@/lib/prisma";
import { getMemoryState } from "@/repositories/memory-store";

function mapLog(row: {
  id: string;
  executionId: string | null;
  storeId: string | null;
  stage: string;
  timestamp: Date | string;
  durationMs: number | null;
  status: SystemLog["status"];
  error: string | null;
  message: string | null;
}): SystemLog {
  return {
    id: row.id,
    executionId: row.executionId,
    storeId: row.storeId,
    stage: row.stage,
    timestamp: new Date(row.timestamp).toISOString(),
    durationMs: row.durationMs,
    status: row.status,
    error: row.error,
    message: row.message,
  };
}

export async function listLogs(): Promise<SystemLog[]> {
  const rows = await tryPrisma((prisma) =>
    prisma.systemLog.findMany({
      orderBy: { timestamp: "desc" },
      take: 200,
    }),
  );
  if (rows && rows.length > 0) return rows.map(mapLog);

  return [...getMemoryState().logs].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
}

export async function createLog(log: SystemLog): Promise<SystemLog> {
  const saved = await tryPrisma((prisma) =>
    prisma.systemLog.create({
      data: {
        id: log.id,
        executionId: log.executionId,
        storeId: log.storeId,
        stage: log.stage,
        timestamp: new Date(log.timestamp),
        durationMs: log.durationMs,
        status: log.status,
        error: log.error,
        message: log.message,
      },
    }),
  );
  if (saved) return log;

  getMemoryState().logs.unshift(log);
  return log;
}
