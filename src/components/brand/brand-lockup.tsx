import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/cn";

export function BrandLockup({
  inverted = false,
  size = "menu",
}: {
  inverted?: boolean;
  size?: "header" | "menu" | "login";
}) {
  if (size === "login") {
    return (
      <div className="flex items-center gap-3">
        <BrandLogo inverted={inverted} size="login" />
        <p
          className={cn(
            "text-[15px] font-semibold tracking-tight",
            inverted ? "text-white" : "text-text",
          )}
        >
          intelligence
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start gap-0.5">
      <BrandLogo inverted={inverted} size={size} />
      {size === "header" ? null : (
        <p
          className={cn(
            "text-[11px] lowercase leading-none",
            inverted ? "text-white/70" : "text-text-muted",
          )}
        >
          intelligence
        </p>
      )}
    </div>
  );
}
