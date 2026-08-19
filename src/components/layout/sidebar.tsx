"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { cn } from "@/lib/cn";

const NAV = [
  { href: "/", label: "Overview" },
  { href: "/relatorios", label: "Relatórios" },
  { href: "/automacoes", label: "Automações" },
  { href: "/lojas", label: "Lojas" },
  { href: "/indicadores", label: "Indicadores" },
  { href: "/entregas", label: "Entregas" },
  { href: "/logs", label: "Logs" },
  { href: "/configuracoes", label: "Configurações" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-border bg-bg-elevated/80 lg:w-[248px] lg:border-b-0 lg:border-r">
      <div className="px-6 pb-6 pt-7">
        <BrandLogo />
        <p className="mt-3 text-[15px] font-medium lowercase tracking-[0.18em] text-nav-text">
          intelligence
        </p>
        <p className="mt-2 text-xs text-nav-muted">operação executiva</p>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:pb-0">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-nav-active-bg text-nav-active-text"
                  : "text-nav-muted hover:bg-nav-active-bg/60 hover:text-nav-text",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border px-3 py-3">
        <p className="mb-1.5 px-1 text-[10px] uppercase tracking-[0.16em] text-nav-muted">Tema</p>
        <ThemeSwitcher compact />
        <div className="mt-2">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
