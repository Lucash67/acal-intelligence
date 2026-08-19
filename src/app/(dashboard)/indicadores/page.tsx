import { AchievementChart } from "@/components/charts/achievement-chart";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatPercent } from "@/lib/format";
import { getIndicators } from "@/services/dashboard-data";

export default async function IndicatorsPage() {
  const rows = await getIndicators();

  return (
    <div>
      <PageHeader
        eyebrow="Indicadores"
        title="Leitura por loja"
        description="Nomes das lojas são públicos. Valores de venda, meta, estoque e clientes são 100% simulados."
      />
      <Card className="mb-4">
        <CardTitle>Atingimento por loja</CardTitle>
        <AchievementChart
          data={rows.map(({ store, metrics }) => ({
            name: store.name.replace("Loja ", ""),
            achievement: metrics.sales.achievementPercentage,
          }))}
        />
      </Card>
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-text-subtle">
            <tr>
              <th className="px-5 pb-3 pt-5 font-medium">Loja</th>
              <th className="px-5 pb-3 pt-5 font-medium">Vendas</th>
              <th className="px-5 pb-3 pt-5 font-medium">Meta</th>
              <th className="px-5 pb-3 pt-5 font-medium">Atingimento</th>
              <th className="px-5 pb-3 pt-5 font-medium">Zerados</th>
              <th className="px-5 pb-3 pt-5 font-medium">Novos</th>
              <th className="px-5 pb-3 pt-5 font-medium">Inativos</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ store, metrics }) => (
              <tr key={store.id} className="border-t border-border">
                <td className="px-5 py-4">{store.name}</td>
                <td className="number px-5 py-4">{formatCurrency(metrics.sales.actual)}</td>
                <td className="number px-5 py-4 text-text-muted">{formatCurrency(metrics.sales.target)}</td>
                <td className="number px-5 py-4">{formatPercent(metrics.sales.achievementPercentage)}</td>
                <td className="px-5 py-4">{metrics.inventory.outOfStockItems.length}</td>
                <td className="px-5 py-4">{metrics.customers.newCustomers}</td>
                <td className="px-5 py-4">{metrics.customers.inactiveCustomers}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
