import { AchievementChart } from "@/components/charts/achievement-chart";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { formatDateBr } from "@/lib/dates";
import { formatCurrency, formatPercent } from "@/lib/format";
import { getIndicators } from "@/services/dashboard-data";

export default async function IndicatorsPage() {
  const rows = await getIndicators();
  const referenceDate = rows[0]?.referenceDate;

  return (
    <div>
      <PageHeader
        eyebrow="Indicadores"
        title="Leitura por loja"
        description="Vendas D-1 e meta do dia são as mesmas do relatório matinal. Vendas mês = D-1 × dias de venda da loja (simulado)."
      />
      <Card className="mb-4">
        <CardTitle>Atingimento por loja</CardTitle>
        <p className="mb-4 text-sm text-text-muted">
          Recorte D-1{referenceDate ? ` · ${formatDateBr(referenceDate)}` : ""}. O percentual é o mesmo do card matinal.
        </p>
        <AchievementChart
          data={rows.map(({ store, dailyAchievement }) => ({
            name: store.name.replace("Loja ", ""),
            achievement: dailyAchievement,
          }))}
        />
      </Card>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-text-subtle">
            <tr>
              <th className="px-5 pb-3 pt-5 font-medium">Loja</th>
              <th className="px-5 pb-3 pt-5 font-medium">Vendas D-1</th>
              <th className="px-5 pb-3 pt-5 font-medium">Meta do dia</th>
              <th className="px-5 pb-3 pt-5 font-medium">Vendas mês</th>
              <th className="px-5 pb-3 pt-5 font-medium">Meta mês</th>
              <th className="px-5 pb-3 pt-5 font-medium">Atingimento</th>
              <th className="px-5 pb-3 pt-5 font-medium">Zerados</th>
              <th className="px-5 pb-3 pt-5 font-medium">Novos</th>
              <th className="px-5 pb-3 pt-5 font-medium">Inativos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.store.id} className="border-t border-border">
                <td className="px-5 py-4">{row.store.name}</td>
                <td className="number px-5 py-4">{formatCurrency(row.dailySales)}</td>
                <td className="number px-5 py-4 text-text-muted">{formatCurrency(row.dailyTarget)}</td>
                <td className="number px-5 py-4">{formatCurrency(row.monthlySales)}</td>
                <td className="number px-5 py-4 text-text-muted">{formatCurrency(row.monthlyTarget)}</td>
                <td className="number px-5 py-4">{formatPercent(row.dailyAchievement)}</td>
                <td className="px-5 py-4">{row.metrics.inventory.outOfStockItems.length}</td>
                <td className="px-5 py-4">{row.metrics.customers.newCustomers}</td>
                <td className="px-5 py-4">{row.metrics.customers.inactiveCustomers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
