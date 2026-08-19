import { cn } from "@/lib/cn";

const TONES = {
  success: "bg-[rgba(110,169,122,0.12)] text-success",
  warning: "bg-[rgba(210,177,90,0.12)] text-warning",
  danger: "bg-[rgba(201,106,106,0.12)] text-danger",
  info: "bg-[rgba(123,147,196,0.12)] text-info",
  neutral: "bg-bg-hover text-text-muted",
};

export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.12em]", TONES[tone])}>
      {children}
    </span>
  );
}

export function statusTone(status: string): keyof typeof TONES {
  if (status === "SUCCESS" || status === "ACTIVE" || status === "PUBLIC_CONFIRMED") return "success";
  if (status === "FAILED" || status === "CONFLICTING") return "danger";
  if (
    status === "RETRYING" ||
    status === "PROCESSING" ||
    status === "PENDING" ||
    status === "INACTIVE" ||
    status === "INTERNAL_PENDING" ||
    status === "MOCK"
  ) {
    return "warning";
  }
  return "neutral";
}
