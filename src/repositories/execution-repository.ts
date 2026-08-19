import type { ReportExecution } from "@/domain/execution";
import type { ReportPeriod } from "@/domain/period";
import { tryPrisma } from "@/lib/prisma";
import { getMemoryState } from "@/repositories/memory-store";

function toIsoDate(value: Date | string): string {
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
}

function mapExecution(row: {
  id: string;
  storeId: string;
  reportType: ReportPeriod;
  referenceDate: Date | string;
  startedAt: Date | string;
  finishedAt: Date | string | null;
  status: ReportExecution["status"];
  error: string | null;
  attempts: number;
}): ReportExecution {
  return {
    id: row.id,
    storeId: row.storeId,
    reportType: row.reportType,
    referenceDate: toIsoDate(row.referenceDate),
    startedAt: new Date(row.startedAt).toISOString(),
    finishedAt: row.finishedAt ? new Date(row.finishedAt).toISOString() : null,
    status: row.status,
    error: row.error,
    attempts: row.attempts,
  };
}

export async function listExecutions(): Promise<ReportExecution[]> {
  const rows = await tryPrisma((prisma) =>
    prisma.reportExecution.findMany({
      orderBy: { startedAt: "desc" },
      take: 100,
    }),
  );
  if (rows && rows.length > 0) return rows.map(mapExecution);

  return [...getMemoryState().executions].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );
}

export async function getExecutionById(id: string): Promise<ReportExecution | null> {
  const row = await tryPrisma((prisma) => prisma.reportExecution.findUnique({ where: { id } }));
  if (row) return mapExecution(row);
  return getMemoryState().executions.find((item) => item.id === id) ?? null;
}

export async function createExecution(input: ReportExecution): Promise<ReportExecution> {
  const row = await tryPrisma((prisma) =>
    prisma.reportExecution.create({
      data: {
        id: input.id,
        storeId: input.storeId,
        reportType: input.reportType,
        referenceDate: new Date(`${input.referenceDate}T00:00:00.000Z`),
        startedAt: new Date(input.startedAt),
        finishedAt: input.finishedAt ? new Date(input.finishedAt) : null,
        status: input.status,
        error: input.error,
        attempts: input.attempts,
      },
    }),
  );
  if (row) return mapExecution(row);

  getMemoryState().executions.unshift(input);
  return input;
}

export async function updateExecution(
  id: string,
  patch: Partial<Pick<ReportExecution, "status" | "finishedAt" | "error" | "attempts">>,
): Promise<void> {
  const updated = await tryPrisma((prisma) =>
    prisma.reportExecution.update({
      where: { id },
      data: {
        status: patch.status,
        finishedAt: patch.finishedAt ? new Date(patch.finishedAt) : patch.finishedAt === null ? null : undefined,
        error: patch.error,
        attempts: patch.attempts,
      },
    }),
  );
  if (updated) return;

  const current = getMemoryState().executions.find((item) => item.id === id);
  if (current) Object.assign(current, patch);
}
