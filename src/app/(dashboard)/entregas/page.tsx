import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, statusTone } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatDateTimeBr } from "@/lib/dates";
import { statusLabel } from "@/lib/labels";
import { listDeliveries, listStores } from "@/repositories";

export default async function DeliveriesPage() {
  const [deliveries, stores] = await Promise.all([listDeliveries(), listStores()]);

  return (
    <div>
      <PageHeader
        eyebrow="Entregas"
        title="Caixa de saída"
        description="Cada disparo registra texto + card 1080×1350 no WhatsApp simulado. Nenhum número real recebe mensagem até a Z-API ser ligada no seu teste."
      />
      <Card className="overflow-x-auto p-0">
        <table className="w-full text-left text-sm">
          <thead className="text-[11px] uppercase tracking-[0.14em] text-text-subtle">
            <tr>
              <th className="px-5 pb-3 pt-5 font-medium">Loja</th>
              <th className="px-5 pb-3 pt-5 font-medium">Destinatário</th>
              <th className="px-5 pb-3 pt-5 font-medium">Payload</th>
              <th className="px-5 pb-3 pt-5 font-medium">Horário</th>
              <th className="px-5 pb-3 pt-5 font-medium">Status</th>
              <th className="px-5 pb-3 pt-5 font-medium">Disparo</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => {
              const store = stores.find((item) => item.id === delivery.storeId);
              return (
                <tr key={delivery.id} className="border-t border-border">
                  <td className="px-5 py-4">{store?.name ?? delivery.storeId}</td>
                  <td className="px-5 py-4 text-text-muted">
                    <div>{store?.manager.name ?? "Gerente simulado"}</div>
                    <div className="font-mono text-xs">{delivery.recipient}</div>
                  </td>
                  <td className="px-5 py-4 text-text-muted">
                    {delivery.status === "SUCCESS" ? "Texto + card" : "Não gerado"}
                  </td>
                  <td className="px-5 py-4 text-text-muted">
                    {delivery.sentAt ? formatDateTimeBr(delivery.sentAt) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={statusTone(delivery.status)}>{statusLabel(delivery.status)}</Badge>
                  </td>
                  <td className="px-5 py-4">
                    <Link href={`/entregas/${delivery.id}`} className="text-accent">
                      Abrir
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
