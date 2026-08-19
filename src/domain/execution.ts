import type { ReportPeriod } from "@/domain/period";

export const EXECUTION_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SUCCESS",
  "FAILED",
] as const;

export type ExecutionStatus = (typeof EXECUTION_STATUSES)[number];

export type ReportExecution = {
  id: string;
  storeId: string;
  reportType: ReportPeriod;
  referenceDate: string;
  startedAt: string;
  finishedAt: string | null;
  status: ExecutionStatus;
  error: string | null;
  attempts: number;
};
