import { PrismaClient } from "@prisma/client";
import { isDatabaseConfigured } from "@/lib/env";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  prismaAvailable?: boolean;
};

export function getPrisma(): PrismaClient | null {
  if (!isDatabaseConfigured()) {
    return null;
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }

  return globalForPrisma.prisma;
}

export async function tryPrisma<T>(
  operation: (prisma: PrismaClient) => Promise<T>,
): Promise<T | null> {
  if (globalForPrisma.prismaAvailable === false) {
    return null;
  }

  const prisma = getPrisma();
  if (!prisma) {
    globalForPrisma.prismaAvailable = false;
    return null;
  }

  try {
    const result = await operation(prisma);
    globalForPrisma.prismaAvailable = true;
    return result;
  } catch {
    globalForPrisma.prismaAvailable = false;
    return null;
  }
}

export function isDatabaseReachable(): boolean {
  return Boolean(isDatabaseConfigured() && globalForPrisma.prismaAvailable);
}
