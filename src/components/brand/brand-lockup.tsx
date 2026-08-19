import { BrandLogo } from "@/components/brand/brand-logo";
import { cn } from "@/lib/cn";

export function BrandLockup({
  inverted = false,
  size = "menu",
}: {
  inverted?: boolean;
  size?: "header" | "menu" | "login";
}) {
  const login = size === "login";

  return (
    <div className={cn("flex flex-col items-start", login ? "gap-2" : "gap-1")}>
      <BrandLogo inverted={inverted} size={size} />
      {size === "header" ? null : (
        <p
          className={cn(
            "lowercase leading-none",
            login ? "text-[15px] font-semibold tracking-tight" : "text-[11px]",
            inverted ? "text-white/70" : "text-text-muted",
          )}
        >
          intelligence
        </p>
      )}
    </div>
  );
}
