import type { ExecutiveReport } from "@/domain/report";
import { formatDateBr, periodLabel } from "@/lib/dates";
import { formatCurrency, formatInteger, formatPercent } from "@/lib/format";

export function MorningReportCard({ report }: { report: ExecutiveReport }) {
  const { metrics, analysis } = report;
  const achievement = metrics.sales.achievementPercentage;
  const achievementClass =
    achievement >= 100 ? "text-success" : achievement >= 90 ? "text-warning" : "text-danger";
  const stock = [...metrics.inventory.outOfStockItems, ...metrics.inventory.criticalItems].slice(0, 4);

  return (
    <article className="relative mx-auto aspect-[1080/1350] w-full max-w-[540px] overflow-hidden rounded-[22px] border border-border bg-bg p-6 text-text shadow-[var(--shadow-card)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,156,224,0.14),transparent_32%)]" />
      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-center justify-between text-[10px] lowercase tracking-[0.22em] text-accent">
          <span>acal intelligence</span>
          <span>relatório {periodLabel(metrics.period).toLowerCase()}</span>
        </div>
        <div>
          <h3 className="text-3xl tracking-tight">{metrics.storeName}</h3>
          <p className="mt-1 text-sm text-text-muted">
            {metrics.city} · {formatDateBr(metrics.referenceDate)} · {metrics.managerName}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Kpi label="Vendas" value={formatCurrency(metrics.sales.actual)} />
          <Kpi label="Meta" value={formatCurrency(metrics.sales.target)} />
          <Kpi label="Atingimento" value={formatPercent(achievement)} valueClass={achievementClass} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Panel title="Performance">
            {metrics.consultants.topPerformers.map((item, index) => (
              <Row
                key={item.id}
                rank={`0${index + 1}`}
                name={item.name}
                detail={`${formatCurrency(item.sales)} · meta ${formatCurrency(item.target)}`}
                value={formatPercent(item.achievementPercentage)}
              />
            ))}
          </Panel>
          <Panel title="Atenção">
            {metrics.consultants.attentionRequired.map((item, index) => (
              <Row
                key={item.id}
                rank={`0${index + 1}`}
                name={item.name}
                detail={`${formatCurrency(item.sales)} · meta ${formatCurrency(item.target)}`}
                value={formatPercent(item.achievementPercentage)}
                warn
              />
            ))}
          </Panel>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Panel title="Estoque">
            {stock.length === 0 ? (
              <p className="text-xs text-text-muted">Nenhum alerta de estoque neste recorte.</p>
            ) : (
              stock.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between border-b border-border py-1.5 text-xs last:border-0"
                >
                  <span>{item.name}</span>
                  <span className="text-accent-strong">{item.quantity === 0 ? "Zerado" : `${item.quantity} un`}</span>
                </div>
              ))
            )}
          </Panel>
          <Panel title="Clientes">
            <div className="flex items-center justify-between border-b border-border py-1.5 text-xs">
              <span>Novos clientes</span>
              <span>{formatInteger(metrics.customers.newCustomers)}</span>
            </div>
            <div className="flex items-center justify-between py-1.5 text-xs">
              <span>Clientes inativos</span>
              <span>{formatInteger(metrics.customers.inactiveCustomers)}</span>
            </div>
          </Panel>
        </div>
        <Panel title="Inteligência">
          <p className="text-[13px] leading-relaxed text-text-muted">{analysis.executiveSummary}</p>
        </Panel>
        <Panel title="Plano de ação">
          <ol className="space-y-2">
            {analysis.actionPlan.map((item, index) => (
              <li key={item} className="flex gap-2 text-[13px] leading-relaxed">
                <span className="text-[10px] text-accent">0{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Panel>
        <div className="mt-auto flex justify-between text-[10px] uppercase tracking-[0.14em] text-text-subtle">
          <span>Números oficiais do Analytics Engine</span>
          <span>1080 × 1350 · Mock</span>
        </div>
      </div>
    </article>
  );
}

function Kpi({
  label,
  value,
  valueClass,
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-[14px] border border-border bg-bg-card p-3">
      <p className="text-[10px] uppercase tracking-[0.16em] text-text-muted">{label}</p>
      <p className={`number mt-2 text-xl ${valueClass ?? ""}`}>{value}</p>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[14px] border border-border bg-bg-card p-3">
      <h4 className="mb-2 text-[10px] lowercase tracking-[0.18em] text-accent">{title}</h4>
      {children}
    </section>
  );
}

function Row({
  rank,
  name,
  detail,
  value,
  warn,
}: {
  rank: string;
  name: string;
  detail: string;
  value: string;
  warn?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-border py-1.5 last:border-0">
      <span className="w-6 text-[10px] text-accent">{rank}</span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs">{name}</p>
        <p className="truncate text-[10px] text-text-muted">{detail}</p>
      </div>
      <span className={`number text-xs ${warn ? "text-warning" : "text-accent-strong"}`}>{value}</span>
    </div>
  );
}
