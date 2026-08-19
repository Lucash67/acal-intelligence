import type { ReportPeriod } from "@/domain/period";

export function toIsoDate(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

export function formatDateBr(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  if (!year || !month || !day) return isoDate;
  return `${day}/${month}/${year}`;
}

export function formatDateTimeBr(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatTimeBr(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function periodLabel(period: ReportPeriod): string {
  return period === "MORNING" ? "Matinal" : "Vespertino";
}

export function periodScopeLabel(period: ReportPeriod): string {
  return period === "MORNING" ? "Consolidado D-1" : "Parcial do dia";
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}
