import type { ExecutiveReport } from "@/domain/report";
import { formatDateBr, periodLabel } from "@/lib/dates";
import { formatCurrency, formatInteger, formatPercent } from "@/lib/format";
import { tokens } from "@/lib/tokens";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderMorningReportHtml(report: ExecutiveReport): string {
  const { metrics, analysis } = report;
  const period = periodLabel(metrics.period).toUpperCase();
  const achievement = metrics.sales.achievementPercentage;
  const achievementTone =
    achievement >= 100 ? tokens.success : achievement >= 90 ? tokens.warning : tokens.danger;

  const performers = metrics.consultants.topPerformers
    .map(
      (item, index) => `
        <div class="row">
          <span class="rank">0${index + 1}</span>
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${formatCurrency(item.sales)} · meta ${formatCurrency(item.target)}</small>
          </div>
          <em>${formatPercent(item.achievementPercentage)}</em>
        </div>`,
    )
    .join("");

  const attention = metrics.consultants.attentionRequired
    .map(
      (item, index) => `
        <div class="row">
          <span class="rank muted">0${index + 1}</span>
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <small>${formatCurrency(item.sales)} · meta ${formatCurrency(item.target)}</small>
          </div>
          <em class="warn">${formatPercent(item.achievementPercentage)}</em>
        </div>`,
    )
    .join("");

  const stock = [...metrics.inventory.outOfStockItems, ...metrics.inventory.criticalItems]
    .slice(0, 4)
    .map(
      (item) => `
        <div class="chip">
          <strong>${escapeHtml(item.name)}</strong>
          <span>${item.quantity === 0 ? "Zerado" : `${item.quantity} un`}</span>
        </div>`,
    )
    .join("");

  const actions = analysis.actionPlan
    .map((item, index) => `<li><span>0${index + 1}</span><p>${escapeHtml(item)}</p></li>`)
    .join("");

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(report.title)}</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        width: 1080px;
        height: 1350px;
        background: ${tokens.backgroundPrimary};
        color: ${tokens.textPrimary};
        font-family: "Segoe UI", "IBM Plex Sans", sans-serif;
        padding: 48px 52px;
      }
      .frame {
        height: 100%;
        border: 1px solid ${tokens.border};
        border-radius: 22px;
        background:
          radial-gradient(circle at top left, rgba(0,156,224,.14), transparent 28%),
          linear-gradient(180deg, ${tokens.backgroundSecondary} 0%, ${tokens.backgroundPrimary} 100%);
        padding: 42px 44px;
        display: flex;
        flex-direction: column;
        gap: 22px;
      }
      .kicker {
        display: flex;
        justify-content: space-between;
        color: ${tokens.acalPrimary};
        font-size: 13px;
        letter-spacing: .22em;
        text-transform: lowercase;
      }
      h1 { font-size: 42px; letter-spacing: .02em; font-weight: 560; }
      .meta { color: ${tokens.textSecondary}; font-size: 18px; }
      .hero {
        display: grid;
        grid-template-columns: 1.3fr .9fr .9fr;
        gap: 16px;
      }
      .kpi {
        background: ${tokens.surface};
        border: 1px solid ${tokens.border};
        border-radius: 14px;
        padding: 22px 24px;
      }
      .kpi span { display: block; color: ${tokens.textSecondary}; letter-spacing: .16em; font-size: 12px; margin-bottom: 10px; }
      .kpi strong { font-size: 36px; font-weight: 560; }
      .kpi em { font-style: normal; color: ${achievementTone}; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
      .panel {
        background: ${tokens.surface};
        border: 1px solid ${tokens.border};
        border-radius: 14px;
        padding: 18px 20px;
        min-height: 210px;
      }
      .panel h2 {
        color: ${tokens.acalPrimary};
        font-size: 12px;
        letter-spacing: .18em;
        margin-bottom: 14px;
        text-transform: lowercase;
      }
      .row { display: flex; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid ${tokens.border}; }
      .row:last-child { border-bottom: 0; }
      .rank { width: 28px; color: ${tokens.acalPrimary}; font-size: 12px; }
      .rank.muted { color: ${tokens.textSubtle}; }
      .row strong { display: block; font-size: 16px; font-weight: 540; }
      .row small { color: ${tokens.textSecondary}; font-size: 12px; }
      .row em { margin-left: auto; font-style: normal; color: ${tokens.acalPrimaryLight}; }
      .row em.warn { color: ${tokens.warning}; }
      .chip { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid ${tokens.border}; color: ${tokens.textPrimary}; }
      .summary { color: ${tokens.textSecondary}; line-height: 1.55; font-size: 17px; }
      ol { list-style: none; display: flex; flex-direction: column; gap: 12px; }
      li { display: flex; gap: 12px; color: ${tokens.textPrimary}; line-height: 1.45; }
      li span { color: ${tokens.acalPrimary}; font-size: 12px; padding-top: 3px; }
      .footer { margin-top: auto; display: flex; justify-content: space-between; color: ${tokens.textSubtle}; font-size: 12px; letter-spacing: .08em; }
    </style>
  </head>
  <body>
    <div class="frame">
      <div class="kicker">
        <span>ACAL Intelligence</span>
        <span>Relatório ${escapeHtml(period)}</span>
      </div>
      <div>
        <h1>${escapeHtml(metrics.storeName)}</h1>
        <p class="meta">${escapeHtml(metrics.city)} · ${formatDateBr(metrics.referenceDate)} · ${escapeHtml(metrics.managerName)}</p>
      </div>
      <div class="hero">
        <div class="kpi">
          <span>Vendas</span>
          <strong>${formatCurrency(metrics.sales.actual)}</strong>
        </div>
        <div class="kpi">
          <span>Meta</span>
          <strong>${formatCurrency(metrics.sales.target)}</strong>
        </div>
        <div class="kpi">
          <span>Atingimento</span>
          <strong><em>${formatPercent(achievement)}</em></strong>
        </div>
      </div>
      <div class="grid">
        <section class="panel">
          <h2>Performance</h2>
          ${performers}
        </section>
        <section class="panel">
          <h2>Atenção</h2>
          ${attention}
        </section>
      </div>
      <div class="grid">
        <section class="panel">
          <h2>Estoque</h2>
          ${stock || "<p class='summary'>Nenhum alerta de estoque neste recorte.</p>"}
        </section>
        <section class="panel">
          <h2>Clientes</h2>
          <div class="chip"><strong>Novos clientes</strong><span>${formatInteger(metrics.customers.newCustomers)}</span></div>
          <div class="chip"><strong>Clientes inativos</strong><span>${formatInteger(metrics.customers.inactiveCustomers)}</span></div>
        </section>
      </div>
      <section class="panel">
        <h2>Inteligência</h2>
        <p class="summary">${escapeHtml(analysis.executiveSummary)}</p>
      </section>
      <section class="panel">
        <h2>Plano de ação</h2>
        <ol>${actions}</ol>
      </section>
      <div class="footer">
        <span>Números oficiais do Analytics Engine</span>
        <span>1080 × 1350 · estrutura Acal · dados simulados</span>
      </div>
    </div>
  </body>
</html>`;
}
