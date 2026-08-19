-- CreateEnum
CREATE TYPE "ReportPeriod" AS ENUM ('MORNING', 'AFTERNOON');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "DeliveryStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'RETRYING');

-- CreateEnum
CREATE TYPE "DeliveryChannel" AS ENUM ('WHATSAPP');

-- CreateEnum
CREATE TYPE "LogStatus" AS ENUM ('INFO', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "dailyTarget" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "managers" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "managers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_executions" (
    "id" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "reportType" "ReportPeriod" NOT NULL,
    "referenceDate" DATE NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "report_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "storeId" TEXT NOT NULL,
    "period" "ReportPeriod" NOT NULL,
    "referenceDate" DATE NOT NULL,
    "metricsJson" JSONB NOT NULL,
    "analysisJson" JSONB NOT NULL,
    "reportJson" JSONB NOT NULL,
    "visualHtml" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_deliveries" (
    "id" TEXT NOT NULL,
    "executionId" TEXT NOT NULL,
    "channel" "DeliveryChannel" NOT NULL DEFAULT 'WHATSAPP',
    "recipient" TEXT NOT NULL,
    "status" "DeliveryStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "sentAt" TIMESTAMP(3),
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "report_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_logs" (
    "id" TEXT NOT NULL,
    "executionId" TEXT,
    "storeId" TEXT,
    "stage" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "durationMs" INTEGER,
    "status" "LogStatus" NOT NULL,
    "error" TEXT,
    "message" TEXT,

    CONSTRAINT "system_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "managers_storeId_key" ON "managers"("storeId");

-- CreateIndex
CREATE INDEX "report_executions_storeId_startedAt_idx" ON "report_executions"("storeId", "startedAt");

-- CreateIndex
CREATE INDEX "report_executions_status_idx" ON "report_executions"("status");

-- CreateIndex
CREATE INDEX "reports_storeId_createdAt_idx" ON "reports"("storeId", "createdAt");

-- CreateIndex
CREATE INDEX "report_deliveries_status_createdAt_idx" ON "report_deliveries"("status", "createdAt");

-- CreateIndex
CREATE INDEX "system_logs_executionId_idx" ON "system_logs"("executionId");

-- CreateIndex
CREATE INDEX "system_logs_storeId_timestamp_idx" ON "system_logs"("storeId", "timestamp");

-- CreateIndex
CREATE INDEX "system_logs_timestamp_idx" ON "system_logs"("timestamp");

-- AddForeignKey
ALTER TABLE "managers" ADD CONSTRAINT "managers_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_executions" ADD CONSTRAINT "report_executions_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "report_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "report_deliveries" ADD CONSTRAINT "report_deliveries_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "report_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "report_executions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
