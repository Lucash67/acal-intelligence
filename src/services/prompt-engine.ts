import type { ReportPeriod } from "@/domain/period";
import { afternoonExecutivePrompt } from "@/prompts/afternoon-executive";
import { morningExecutivePrompt } from "@/prompts/morning-executive";

export function getExecutivePrompt(period: ReportPeriod): string {
  return period === "AFTERNOON" ? afternoonExecutivePrompt : morningExecutivePrompt;
}
