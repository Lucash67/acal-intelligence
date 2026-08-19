import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { RunPipelineButton } from "@/components/pipeline/run-pipeline-button";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateBr, formatTimeBr, periodLabel } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { listExecutions, listReports, listStores } from "@/repositories";

export default async function ReportsPage() {
  const [reports, executions, stores] = await Promise.all([
    listReports(),
    listExecutions(),
    listStores(),
  ]);

  const rows = reports.map((report) => {
    const execution = executions.find((item) => item.id === report.executionId);
    const store = stores.find((item) => item.id === report.storeId);
    return { report, execution, store };
  });

  return (
    <div>
      <PageHeader
        eyebrow="Relatórios"
        title="Histórico executivo"
        description="Cada relatório é isolado por loja. Os números oficiais vêm do Analytics Engine."
        action={
          <div className="flex flex-wrap gap-2">
            <RunPipelineButton storeId="aldeota" period="MORNING" label="Simular matinal Aldeota" />
            <RunPipelineButton storeId="aldeota" period="AFTERNOON" label="Simular vespertino Aldeota" />
          </div>
        }
      />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-text-subtle">
            <tr>
              <th className="px-5 pb-3 pt-5 font-medium">Loja</th>
              <th className="px-5 pb-3 pt-5 font-medium">Período</th>
              <th className="px-5 pb-3 pt-5 font-medium">Data</th>
              <th className="px-5 pb-3 pt-5 font-medium">Status</th>
              <th className="px-5 pb-3 pt-5 font-medium">Horário</th>
              <th className="px-5 pb-3 pt-5 font-medium">Preview</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ report, execution, store }) => (
              <tr key={report.id} className="border-t border-border">
                <td className="px-5 py-4">{store?.name ?? report.storeName}</td>
                <td className="px-5 py-4 text-text-muted">{periodLabel(report.period)}</td>
                <td className="px-5 py-4 text-text-muted">{formatDateBr(report.referenceDate)}</td>
                <td className="px-5 py-4">
                  <Badge tone={statusTone(execution?.status ?? "SUCCESS")}>
                    {statusLabel(execution?.status ?? "SUCCESS")}
                  </Badge>
                </td>
                <td className="px-5 py-4 text-text-muted">{formatTimeBr(report.generatedAt)}</td>
                <td className="px-5 py-4">
                  <Link href={`/relatorios/${report.id}`} className="text-accent">
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
