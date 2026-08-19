"use client";

import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/cn";

const SRC = {
  blue: "/brand/acal-wordmark-blue.png",
  white: "/brand/acal-wordmark-white.png",
} as const;

const HEIGHTS = {
  header: "h-10",
  menu: "h-[78px]",
  login: "h-11",
} as const;

export function BrandLogo({
  size = "menu",
  inverted = false,
  className,
}: {
  size?: keyof typeof HEIGHTS;
  inverted?: boolean;
  className?: string;
}) {
  const theme = useTheme().theme;
  const white = inverted || theme === "dark";

  return (
    <span className={cn("inline-flex items-center justify-center", className)}>
      <img
        src={white ? SRC.white : SRC.blue}
        alt="Acal"
        width={475}
        height={366}
        className={cn("w-auto object-contain object-left", HEIGHTS[size])}
      />
    </span>
  );
}
