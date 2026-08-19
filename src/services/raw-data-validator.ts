import { z } from "zod";
import type { StoreRawData } from "@/domain/raw-data";

const storeRawDataSchema = z.object({
  storeId: z.string().min(1),
  storeName: z.string().min(1),
  managerName: z.string().min(1),
  managerPhone: z.string().min(1),
  city: z.string().min(1),
  referenceDate: z.string().min(8),
  period: z.enum(["MORNING", "AFTERNOON"]),
  sales: z.object({
    target: z.number().nonnegative(),
    actual: z.number().nonnegative(),
  }),
  consultants: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      sales: z.number().nonnegative(),
      target: z.number().nonnegative(),
      conversionRate: z.number().nullable(),
      status: z.enum(["HIGHLIGHT", "STABLE", "ATTENTION"]),
    }),
  ),
  inventory: z.array(
    z.object({
      sku: z.string(),
      name: z.string(),
      quantity: z.number().int().nonnegative(),
      demandFlag: z.enum(["HIGH", "NORMAL", "LOW"]),
      salesTrend: z.enum(["UP", "FLAT", "DOWN"]),
      criticalThreshold: z.number().int().nonnegative(),
    }),
  ),
  customers: z.object({
    newCustomers: z.number().int().nonnegative(),
    inactiveCustomers: z.number().int().nonnegative(),
  }),
});

export function validateStoreRawData(raw: StoreRawData): StoreRawData {
  return storeRawDataSchema.parse(raw);
}
