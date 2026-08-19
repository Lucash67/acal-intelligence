export const REPORT_PERIODS = ["MORNING", "AFTERNOON"] as const;

export type ReportPeriod = (typeof REPORT_PERIODS)[number];
