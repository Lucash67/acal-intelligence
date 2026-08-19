import type { StoreProfile } from "@/domain/store";
import { MOCK_STORES } from "@/mocks/stores";
import { tryPrisma } from "@/lib/prisma";
import { getMemoryState } from "@/repositories/memory-store";

function overlayFromPrisma(
  catalog: StoreProfile,
  row?: {
    status: string;
    dailyTarget: { toNumber(): number } | number;
    manager: { id: string; name: string; phone: string } | null;
  },
): StoreProfile {
  if (!row) return catalog;

  return {
    ...catalog,
    dailyTarget: typeof row.dailyTarget === "number" ? row.dailyTarget : row.dailyTarget.toNumber(),
    manager: catalog.manager,
  };
}

export async function listStores(): Promise<StoreProfile[]> {
  const rows = await tryPrisma((prisma) =>
    prisma.store.findMany({
      include: { manager: true },
      orderBy: { name: "asc" },
    }),
  );

  if (rows && rows.length > 0) {
    const byId = new Map(rows.map((row) => [row.id, row]));
    return MOCK_STORES.map((store) => overlayFromPrisma(store, byId.get(store.id)));
  }

  return getMemoryState().stores;
}

export async function getStoreById(storeId: string): Promise<StoreProfile | null> {
  const stores = await listStores();
  return stores.find((store) => store.id === storeId) ?? MOCK_STORES.find((store) => store.id === storeId) ?? null;
}
