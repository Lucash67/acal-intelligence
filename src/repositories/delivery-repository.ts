import type { ReportDelivery } from "@/domain/delivery";
import { tryPrisma } from "@/lib/prisma";
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

  getMemoryState().deliveries.unshift(delivery);
  return delivery;
}
