import { cn } from "@/lib/cn";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-[var(--radius-md)] border border-border bg-bg-card p-5 shadow-[var(--shadow-card)]", className)}>
      {children}
    </section>
  );
}

export function CardTitle({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-4 text-[11px] uppercase tracking-[0.2em] text-accent">{children}</h3>;
}
