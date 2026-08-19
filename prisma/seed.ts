import { PrismaClient } from "@prisma/client";
import { buildMockAnalysis } from "../src/providers/ai/mock-ai-provider";
import { getMockStoreRawData } from "../src/mocks/raw-data";
import { MOCK_STORES } from "../src/mocks/stores";
import { computeStoreMetrics } from "../src/services/analytics-engine";
import { ReportGenerator } from "../src/services/report-generator";

const prisma = new PrismaClient();

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL is not set. Configure the personal Supabase project before running npm run db:seed.",
    );
  }

  console.log("Seeding ACAL Intelligence development data...");

  await prisma.systemLog.deleteMany();
  await prisma.reportDelivery.deleteMany();
  await prisma.report.deleteMany();
  await prisma.reportExecution.deleteMany();
  await prisma.manager.deleteMany();
  await prisma.store.deleteMany();

  for (const store of MOCK_STORES) {
    await prisma.store.create({
      data: {
        id: store.id,
        name: store.name,
        city: store.city,
        status: store.status,
        dailyTarget: store.dailyTarget,
        manager: {
          create: {
            id: store.manager.id,
            name: store.manager.name,
            phone: store.manager.phone,
          },
        },
      },
    });
  }

  const generator = new ReportGenerator();
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const samples = [
    { storeId: "presidente-kennedy", period: "MORNING" as const, date: yesterday, status: "SUCCESS" as const },
    { storeId: "aldeota", period: "MORNING" as const, date: yesterday, status: "SUCCESS" as const },
    { storeId: "messejana", period: "MORNING" as const, date: yesterday, status: "FAILED" as const },
    { storeId: "conceito-aldeota", period: "AFTERNOON" as const, date: yesterday, status: "SUCCESS" as const },
    { storeId: "parangaba", period: "MORNING" as const, date: today, status: "SUCCESS" as const },
    { storeId: "parque-soledade", period: "MORNING" as const, date: today, status: "SUCCESS" as const },
    { storeId: "limoeiro", period: "MORNING" as const, date: today, status: "FAILED" as const },
  ];

  for (const sample of samples) {
    const startedAt = new Date(sample.date);
    startedAt.setHours(sample.period === "MORNING" ? 6 : 13, 41, 0, 0);
    const finishedAt = new Date(startedAt.getTime() + 45_000);
    const store = MOCK_STORES.find((item) => item.id === sample.storeId);
    if (!store) continue;

    const execution = await prisma.reportExecution.create({
      data: {
        storeId: sample.storeId,
        reportType: sample.period,
        referenceDate: sample.date,
        startedAt,
        finishedAt,
        status: sample.status,
        error: sample.status === "FAILED" ? "Falha simulada no provedor de dados (mock)." : null,
        attempts: sample.status === "FAILED" ? 2 : 1,
      },
    });

    await prisma.systemLog.create({
      data: {
        executionId: execution.id,
        storeId: sample.storeId,
        stage: "START",
        timestamp: startedAt,
        durationMs: 6,
        status: "INFO",
        message: "Execução iniciada.",
      },
    });

    if (sample.status === "FAILED") {
      await prisma.systemLog.create({
        data: {
          executionId: execution.id,
          storeId: sample.storeId,
          stage: "DATA_SOURCE",
          timestamp: finishedAt,
          durationMs: 21,
          status: "FAILED",
          error: "Falha simulada no provedor de dados (mock).",
          message: "Pipeline interrompido nesta loja.",
        },
      });
      await prisma.reportDelivery.create({
        data: {
          executionId: execution.id,
          recipient: store.manager.phone,
          status: "FAILED",
          attempts: 2,
          error: "Entrega não realizada por falha na execução.",
        },
      });
      continue;
    }

    const raw = getMockStoreRawData(
      sample.storeId,
      sample.period,
      sample.date.toISOString().slice(0, 10),
    );
    const metrics = computeStoreMetrics(raw);
    const report = generator.generate(metrics, buildMockAnalysis(metrics));

    await prisma.report.create({
      data: {
        id: report.id,
        executionId: execution.id,
        storeId: report.storeId,
        period: report.period,
        referenceDate: sample.date,
        metricsJson: JSON.parse(JSON.stringify(report.metrics)),
        analysisJson: JSON.parse(JSON.stringify(report.analysis)),
        reportJson: JSON.parse(JSON.stringify(report)),
      },
    });

    await prisma.reportDelivery.create({
      data: {
        executionId: execution.id,
        recipient: store.manager.phone,
        status: "SUCCESS",
        attempts: 1,
        sentAt: finishedAt,
      },
    });

    await prisma.systemLog.create({
      data: {
        executionId: execution.id,
        storeId: sample.storeId,
        stage: "FINISH",
        timestamp: finishedAt,
        durationMs: 45,
        status: "SUCCESS",
        message: "Execução concluída com entrega simulada.",
      },
    });
  }

  console.log("Seed completed: public Acal units + fictional operational history.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
