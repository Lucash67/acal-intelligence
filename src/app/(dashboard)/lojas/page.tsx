import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { provenanceLabel, unitTypeLabel } from "@/domain/provenance";
import { formatCurrency } from "@/lib/format";
import { listExecutions, listStores } from "@/repositories";
import { getNextScheduledRun } from "@/jobs/schedules";
import { formatDateTimeBr } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";

export default async function StoresPage() {
  const [stores, executions] = await Promise.all([listStores(), listExecutions()]);
  const next = getNextScheduledRun();
  const reportable = stores.filter((store) => store.reportEnabled && store.status === "ACTIVE").length;

  return (
    <div>
      <PageHeader
        eyebrow="Unidades"
        title="Rede pública Acal"
        description={`${reportable} unidades comerciais no fluxo de relatório. Nomes e endereços vêm do site oficial. Gerentes, metas e vendas continuam simulados. Os 12 gerentes do spec ainda não foram cruzados com esta listagem.`}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {stores.map((store) => {
          const last = executions.find((item) => item.storeId === store.id);
          return (
            <Link key={store.id} href={`/lojas/${store.id}`}>
              <Card className="h-full transition hover:border-border-strong">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg">{store.name}</h3>
                    <p className="mt-1 text-sm text-text-muted">
                      {store.neighborhood ? `${store.neighborhood} · ` : ""}
                      {store.city}/{store.state}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge tone={statusTone(store.status)}>{statusLabel(store.status)}</Badge>
                    <Badge tone={statusTone(store.sourceStatus)}>{provenanceLabel(store.sourceStatus)}</Badge>
                  </div>
                </div>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">Tipo</dt>
                    <dd>{unitTypeLabel(store.unitType)}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">Endereço</dt>
                    <dd className="text-right">{store.address}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">Relatório</dt>
                    <dd>{store.reportEnabled ? "Simulado" : "Não aplicável"}</dd>
                  </div>
                  {store.reportEnabled ? (
                    <>
                      <div className="flex justify-between gap-4">
                        <dt className="text-text-muted">Gerente (simulado)</dt>
                        <dd>{store.manager.name}</dd>
                      </div>
                      <div className="flex justify-between gap-4">
                        <dt className="text-text-muted">Meta mensal (simulada)</dt>
                        <dd className="number">{formatCurrency(store.monthlyTarget)}</dd>
                      </div>
                    </>
                  ) : null}
                  <div className="flex justify-between gap-4">
                    <dt className="text-text-muted">Última execução</dt>
                    <dd>{last ? statusLabel(last.status) : "—"}</dd>
                  </div>
                  {store.reportEnabled ? (
                    <div className="flex justify-between gap-4">
                      <dt className="text-text-muted">Próximo relatório</dt>
                      <dd>{formatDateTimeBr(next.at.toISOString())}</dd>
                    </div>
                  ) : null}
                </dl>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
