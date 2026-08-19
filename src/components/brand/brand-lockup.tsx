import { cn } from "@/lib/cn";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid place-items-center rounded-full bg-[var(--acal-primary)] text-white",
        className ?? "h-10 w-10",
      )}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none">
        <path
          d="M6 16.5 12 5.5 18 16.5"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8.4 13.2h7.2" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function BrandLockup({
  inverted = false,
  size = "menu",
}: {
  inverted?: boolean;
  size?: "menu" | "login";
}) {
  const large = size === "login";

  return (
    <div className={cn("flex items-center", large ? "gap-4" : "gap-3")}>
      <BrandMark className={large ? "h-16 w-16" : "h-12 w-12"} />
      <div className="leading-none">
        <p
          className={cn(
            "lowercase tracking-tight",
            large ? "text-[34px]" : "text-[22px]",
            inverted ? "text-white" : "text-text",
          )}
        >
          acal
        </p>
        <p
          className={cn(
            "lowercase tracking-[0.14em]",
            large ? "mt-1.5 text-[15px]" : "mt-1 text-[12px]",
            inverted ? "text-white/70" : "text-text-muted",
          )}
        >
          intelligence
        </p>
      </div>
    </div>
  );
}
