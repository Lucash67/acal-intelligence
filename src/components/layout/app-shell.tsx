"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ScrollText,
  Settings,
  Timer,
  Truck,
  X,
} from "lucide-react";
import { BrandLockup } from "@/components/brand/brand-lockup";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { useAuth } from "@/components/auth/auth-provider";
import { cn } from "@/lib/cn";

const GROUPS = [
  {
    label: "Operação",
    items: [
      { href: "/", label: "Visão geral", icon: LayoutDashboard, preview: true },
      { href: "/relatorios", label: "Relatórios", icon: FileText, preview: true },
      { href: "/automacoes", label: "Automações", icon: Timer, preview: false },
      { href: "/lojas", label: "Unidades", icon: Building2, preview: true },
      { href: "/indicadores", label: "Indicadores", icon: BarChart3, preview: true },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/entregas", label: "Entregas", icon: Truck, preview: true },
      { href: "/logs", label: "Registros", icon: ScrollText, preview: false },
      { href: "/configuracoes", label: "Configurações", icon: Settings, preview: false },
    ],
  },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const groups = GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => role === "admin" || item.preview),
  })).filter((group) => group.items.length > 0);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[280px_1fr]">
      <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-border bg-bg/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((value) => !value)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-card text-text"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
        <BrandLockup size="header" />
        <LogoutLink compact />
      </header>

      {menuOpen ? (
        <button
          type="button"
          aria-label="Fechar menu"
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(288px,86vw)] flex-col bg-[var(--sidebar)] text-white transition-transform duration-200 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:w-auto lg:translate-x-0 lg:border-r lg:border-white/5",
          menuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <BrandLockup inverted size="menu" />
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setMenuOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--sidebar-muted)] hover:bg-[var(--sidebar-hover)] hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="min-h-0 flex-1 space-y-5 overflow-y-auto px-3 pb-3">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sidebar-muted)]">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-[13px] font-medium transition duration-200",
                        active
                          ? "bg-white/10 text-white shadow-sm"
                          : "text-[var(--sidebar-text)] hover:bg-[var(--sidebar-hover)] hover:text-white",
                      )}
                    >
                      <Icon
                        size={16}
                        className={cn(active ? "text-[var(--acal-primary)]" : "text-[var(--sidebar-muted)]")}
                      />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="shrink-0 border-t border-white/5 px-4 py-4">
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--sidebar-muted)]">
            Aparência
          </p>
          <ThemeSwitcher compact surface="sidebar" />
          <LogoutLink />
          {role === "preview" ? (
            <p className="mt-3 px-1 text-[11px] leading-relaxed text-[var(--sidebar-muted)]">
              Acesso de prévia. Novas etapas serão liberadas aos poucos.
            </p>
          ) : null}
        </div>
      </aside>

      <div className="min-w-0">
        {children}
      </div>
    </div>
  );
}

function LogoutLink({ compact = false }: { compact?: boolean }) {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  if (compact) {
    return (
      <button
        type="button"
        aria-label="Sair"
        onClick={logout}
        className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg-card text-text-muted"
      >
        <LogOut size={16} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={loading}
      className="mt-3 inline-flex items-center gap-2 px-1 text-[12px] text-[var(--sidebar-text)] transition hover:text-white disabled:opacity-60"
    >
      <LogOut size={14} />
      {loading ? "Saindo..." : "Sair"}
    </button>
  );
}
