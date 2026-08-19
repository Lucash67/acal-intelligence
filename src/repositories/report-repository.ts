import type { ExecutiveReport } from "@/domain/report";
import { tryPrisma } from "@/lib/prisma";
import { getMemoryState, type PersistedReport } from "@/repositories/memory-store";

export async function saveReport(report: PersistedReport): Promise<PersistedReport> {
  const saved = await tryPrisma((prisma) =>
    prisma.report.create({
      data: {
        id: report.id,
        executionId: report.executionId,
        storeId: report.storeId,
        period: report.period,
        referenceDate: new Date(`${report.referenceDate}T00:00:00.000Z`),
        metricsJson: report.metrics,
        analysisJson: report.analysis,
        reportJson: report,
        visualHtml: report.visualHtml,
      },
    }),
  );
  if (saved) return report;

  getMemoryState().reports.unshift(report);
  return report;
}

export async function listReports(): Promise<PersistedReport[]> {
  const rows = await tryPrisma((prisma) =>
    prisma.report.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  );
  if (rows && rows.length > 0) {
    return rows.map((row) => {
      const stored = row.reportJson as ExecutiveReport;
      return {
        ...stored,
        id: row.id,
        executionId: row.executionId,
        visualHtml: row.visualHtml,
      };
    });
  }

  return [...getMemoryState().reports].sort(
    (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime(),
  );
}

export async function getReportById(id: string): Promise<PersistedReport | null> {
  const reports = await listReports();
  return reports.find((report) => report.id === id) ?? null;
}

export async function getReportByExecutionId(executionId: string): Promise<PersistedReport | null> {
  const reports = await listReports();
  return reports.find((report) => report.executionId === executionId) ?? null;
}
