import type { ReportPeriod } from "@/domain/period";

export function reportKey(storeId: string, period: ReportPeriod, date: string): string {
  return `rpt--${storeId}--${period}--${date}`;
}

export function executionKey(storeId: string, period: ReportPeriod, date: string): string {
  return `exec--${storeId}--${period}--${date}`;
}

export function deliveryKey(storeId: string, period: ReportPeriod, date: string): string {
  return `dlv--${storeId}--${period}--${date}`;
}

function parseTail(id: string, prefix: string) {
  if (!id.startsWith(prefix)) return null;
  const rest = id.slice(prefix.length);
  const match = rest.match(/^(.*)--(MORNING|AFTERNOON)--(\d{4}-\d{2}-\d{2})$/);
  if (!match) return null;
  return {
    storeId: match[1],
    period: match[2] as ReportPeriod,
    date: match[3],
  };
}

export function parseReportKey(id: string) {
  return parseTail(id, "rpt--");
}

export function parseExecutionKey(id: string) {
  return parseTail(id, "exec--");
}

export function parseDeliveryKey(id: string) {
  return parseTail(id, "dlv--");
}
