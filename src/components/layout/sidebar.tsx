"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LogoutButton } from "@/components/layout/logout-button";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { cn } from "@/lib/cn";

const GROUPS = [
  {
    label: "Operação",
    items: [
      { href: "/", label: "Visão geral" },
      { href: "/relatorios", label: "Relatórios" },
      { href: "/automacoes", label: "Automações" },
      { href: "/lojas", label: "Unidades" },
      { href: "/indicadores", label: "Indicadores" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/entregas", label: "Entregas" },
      { href: "/logs", label: "Registros" },
      { href: "/configuracoes", label: "Configurações" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col self-start border-b border-border bg-bg-elevated/80 lg:sticky lg:top-0 lg:min-h-0 lg:w-[272px] lg:border-b-0 lg:border-r">
      <div className="px-5 pb-4 pt-5">
        <BrandLogo size="menu" />
        <p className="mt-3 text-[17px] font-medium lowercase tracking-[0.16em] text-nav-text">intelligence</p>
        <p className="mt-1 text-xs text-nav-muted">Operação executiva</p>
      </div>

      <nav className="flex gap-1 overflow-x-auto px-3 pb-2 lg:flex-col lg:overflow-visible">
        {GROUPS.map((group) => (
          <div key={group.label} className="min-w-max lg:min-w-0 lg:mb-3">
            <p className="hidden px-3 pb-1 text-[10px] uppercase tracking-[0.16em] text-nav-muted lg:block">
              {group.label}
            </p>
            <div className="flex gap-1 lg:flex-col">
              {group.items.map((item) => {
                const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-[var(--radius-sm)] px-3 py-2 text-sm transition-colors",
                      active
                        ? "bg-nav-active-bg text-nav-active-text"
                        : "text-nav-muted hover:bg-nav-active-bg/60 hover:text-nav-text",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-3 py-3">
        <p className="mb-1.5 px-1 text-[10px] uppercase tracking-[0.16em] text-nav-muted">Aparência</p>
        <ThemeSwitcher compact />
        <div className="mt-2">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
