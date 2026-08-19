import type { ReportDelivery } from "@/domain/delivery";
import { deliveryKey, executionKey, parseDeliveryKey } from "@/lib/demo-keys";
import { tryPrisma } from "@/lib/prisma";
import { getMockStore } from "@/mocks/stores";
import { getMemoryState } from "@/repositories/memory-store";

function mapDelivery(
  row: {
    id: string;
    executionId: string;
    channel: ReportDelivery["channel"];
    recipient: string;
    status: ReportDelivery["status"];
    attempts: number;
    sentAt: Date | string | null;
    error: string | null;
    createdAt: Date | string;
  },
  storeId: string,
): ReportDelivery {
  return {
    id: row.id,
    executionId: row.executionId,
    storeId,
    channel: row.channel,
    recipient: row.recipient,
    status: row.status,
    attempts: row.attempts,
    sentAt: row.sentAt ? new Date(row.sentAt).toISOString() : null,
    error: row.error,
    createdAt: new Date(row.createdAt).toISOString(),
  };
}

export async function listDeliveries(): Promise<ReportDelivery[]> {
  const rows = await tryPrisma((prisma) =>
    prisma.reportDelivery.findMany({
      include: { execution: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
  );
  if (rows && rows.length > 0) {
    return rows.map((row) => mapDelivery(row, row.execution.storeId));
  }

  return [...getMemoryState().deliveries].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function createDelivery(delivery: ReportDelivery): Promise<ReportDelivery> {
  const saved = await tryPrisma((prisma) =>
    prisma.reportDelivery.create({
      data: {
        id: delivery.id,
        executionId: delivery.executionId,
        channel: delivery.channel,
        recipient: delivery.recipient,
        status: delivery.status,
        attempts: delivery.attempts,
        sentAt: delivery.sentAt ? new Date(delivery.sentAt) : null,
        error: delivery.error,
      },
    }),
  );
  if (saved) return delivery;

  const memory = getMemoryState();
  memory.deliveries = memory.deliveries.filter((item) => item.id !== delivery.id);
  memory.deliveries.unshift(delivery);
  return delivery;
}

export async function getDeliveryById(id: string): Promise<ReportDelivery | null> {
  const deliveries = await listDeliveries();
  const found = deliveries.find((item) => item.id === id);
  if (found) return found;

  const parsed = parseDeliveryKey(id);
  if (!parsed) return null;
  const store = getMockStore(parsed.storeId);
  if (!store) return null;

  return {
    id: deliveryKey(parsed.storeId, parsed.period, parsed.date),
    executionId: executionKey(parsed.storeId, parsed.period, parsed.date),
    storeId: parsed.storeId,
    channel: "WHATSAPP",
    recipient: store.manager.phone,
    status: "SUCCESS",
    attempts: 1,
    sentAt: `${parsed.date}T16:00:00.000Z`,
    error: null,
    createdAt: `${parsed.date}T16:00:00.000Z`,
  };
}
