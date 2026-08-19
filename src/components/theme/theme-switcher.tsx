"use client";

import { ThemeIcon } from "@/components/theme/theme-icons";
import { useTheme } from "@/components/theme/theme-provider";
import { cn } from "@/lib/cn";
import { THEME_OPTIONS } from "@/lib/theme";

export function ThemeSwitcher({
  compact = false,
  surface = "sidebar",
}: {
  compact?: boolean;
  surface?: "sidebar" | "page";
}) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    return (
      <div className="flex items-center justify-center gap-1">
        {THEME_OPTIONS.map((option) => {
          const active = theme === option.id;
          return (
            <button
              key={option.id}
              type="button"
              title={option.label}
              aria-label={option.label}
              aria-pressed={active}
              onClick={() => setTheme(option.id)}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full transition",
                surface === "page"
                  ? active
                    ? "bg-accent text-bg-card"
                    : "text-text-muted hover:bg-bg-hover hover:text-text"
                  : active
                    ? "bg-nav-text text-[var(--background-secondary)] shadow-sm"
                    : "text-nav-muted hover:bg-nav-active-bg hover:text-nav-text",
              )}
            >
              <ThemeIcon id={option.id} className="h-4 w-4" />
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {THEME_OPTIONS.map((option) => {
        const active = theme === option.id;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => setTheme(option.id)}
            className={cn(
              "rounded-[var(--radius-sm)] border px-3 py-3 text-left transition",
              active
                ? "border-accent bg-accent-dim text-text"
                : "border-border text-text-muted hover:border-border-strong hover:bg-bg-hover hover:text-text",
            )}
          >
            <span className="mb-2 flex items-center gap-2">
              <ThemeIcon id={option.id} className="h-4 w-4" />
              <span className="text-sm">{option.label}</span>
            </span>
            <p className="text-[11px] leading-relaxed text-text-subtle">{option.description}</p>
          </button>
        );
      })}
    </div>
  );
}
