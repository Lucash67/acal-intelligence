import type { ReportPeriod } from "@/domain/period";
import type { PipelineStage } from "@/domain/log";
import { createId } from "@/lib/ids";
import { getAIProvider } from "@/providers/ai";
import { getDataSourceProvider } from "@/providers/data-source";
import { getMessagingProvider } from "@/providers/messaging";
import { createDelivery } from "@/repositories/delivery-repository";
import { createExecution, updateExecution } from "@/repositories/execution-repository";
import { createLog } from "@/repositories/log-repository";
import { saveReport } from "@/repositories/report-repository";
import { isReportableStore } from "@/domain/store";
import { getStoreById } from "@/repositories/store-repository";
import { AnalyticsEngine } from "@/services/analytics-engine";
import { getExecutivePrompt } from "@/services/prompt-engine";
import { ReportGenerator } from "@/services/report-generator";
import { renderVisualReport } from "@/services/visual-report-renderer";
import { validateStoreRawData } from "@/services/raw-data-validator";
import { buildWhatsAppPreview } from "@/lib/whatsapp-preview";

export type PipelineInput = {
  storeId: string;
  period: ReportPeriod;
  referenceDate: string;
};

export type PipelineResult = {
  executionId: string;
  storeId: string;
  status: "SUCCESS" | "FAILED";
  reportId?: string;
  error?: string;
};

async function logStage(input: {
  executionId: string;
  storeId: string;
  stage: PipelineStage;
  startedAt: number;
  status: "INFO" | "SUCCESS" | "FAILED";
  message?: string;
  error?: string;
}) {
  await createLog({
    id: createId(),
    executionId: input.executionId,
    storeId: input.storeId,
    stage: input.stage,
    timestamp: new Date().toISOString(),
    durationMs: Date.now() - input.startedAt,
    status: input.status,
    error: input.error ?? null,
    message: input.message ?? null,
  });
}

export async function runReportPipeline(input: PipelineInput): Promise<PipelineResult> {
  const executionId = createId();
  const startedAt = new Date().toISOString();

  await createExecution({
    id: executionId,
    storeId: input.storeId,
    reportType: input.period,
    referenceDate: input.referenceDate,
    startedAt,
    finishedAt: null,
    status: "PROCESSING",
    error: null,
    attempts: 1,
  });

  try {
    await logStage({
      executionId,
      storeId: input.storeId,
      stage: "START",
      startedAt: Date.now(),
      status: "INFO",
      message: `Pipeline iniciado para ${input.storeId}.`,
    });

    const store = await getStoreById(input.storeId);
    if (!store) {
      throw new Error(`Store ${input.storeId} was not found.`);
    }
    if (!isReportableStore(store)) {
      throw new Error(`Unidade ${store.name} não recebe relatório de gerente de loja.`);
    }

    const dataStarted = Date.now();
    const raw = await getDataSourceProvider().getStoreData(
      input.storeId,
      input.period,
      input.referenceDate,
    );
    validateStoreRawData(raw);
    await logStage({
      executionId,
      storeId: input.storeId,
      stage: "DATA_SOURCE",
      startedAt: dataStarted,
      status: "SUCCESS",
      message: "Dados da loja carregados e validados.",
    });

    const analyticsStarted = Date.now();
    const metrics = new AnalyticsEngine().compute(raw);
    await logStage({
      executionId,
      storeId: input.storeId,
      stage: "ANALYTICS",
      startedAt: analyticsStarted,
      status: "SUCCESS",
      message: "Métricas calculadas deterministicamente.",
    });

    const aiStarted = Date.now();
    const analysis = await getAIProvider().analyze({
      metrics,
      systemPrompt: getExecutivePrompt(input.period),
    });
    await logStage({
      executionId,
      storeId: input.storeId,
      stage: "AI_ANALYSIS",
      startedAt: aiStarted,
      status: "SUCCESS",
      message: "Análise executiva gerada e validada.",
    });

    const reportStarted = Date.now();
    const report = new ReportGenerator().generate(metrics, analysis);
    const visual = await renderVisualReport(report);
    await saveReport({
      ...report,
      executionId,
      visualHtml: visual.html,
    });
    await logStage({
      executionId,
      storeId: input.storeId,
      stage: "REPORT",
      startedAt: reportStarted,
      status: "SUCCESS",
      message: visual.skippedReason ?? "Relatório executivo e visual gerados.",
    });

    const deliveryStarted = Date.now();
    const previewText = buildWhatsAppPreview(report);
    const messaging = getMessagingProvider();
    const message = await messaging.sendText({
      to: store.manager.phone,
      text: previewText,
    });
    if (message.ok) {
      await messaging.sendImage({
        to: store.manager.phone,
        imagePath: visual.imagePath ?? undefined,
        caption: `${report.title} · card 1080×1350`,
      });
    }

    await createDelivery({
      id: createId(),
      executionId,
      storeId: input.storeId,
      channel: "WHATSAPP",
      recipient: store.manager.phone,
      status: message.ok ? "SUCCESS" : "FAILED",
      attempts: 1,
      sentAt: message.ok ? new Date().toISOString() : null,
      error: message.error ?? null,
      createdAt: new Date().toISOString(),
    });
    await logStage({
      executionId,
      storeId: input.storeId,
      stage: "DELIVERY",
      startedAt: deliveryStarted,
      status: message.ok ? "SUCCESS" : "FAILED",
      message: message.simulated ? "Entrega simulada pelo MockMessagingProvider." : "Entrega registrada.",
      error: message.error,
    });

    await updateExecution(executionId, {
      status: "SUCCESS",
      finishedAt: new Date().toISOString(),
      error: null,
    });
    await logStage({
      executionId,
      storeId: input.storeId,
      stage: "FINISH",
      startedAt: Date.now(),
      status: "SUCCESS",
      message: "Execução concluída.",
    });

    return {
      executionId,
      storeId: input.storeId,
      status: "SUCCESS",
      reportId: report.id,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown pipeline error.";
    await updateExecution(executionId, {
      status: "FAILED",
      finishedAt: new Date().toISOString(),
      error: message,
    });
    await logStage({
      executionId,
      storeId: input.storeId,
      stage: "FINISH",
      startedAt: Date.now(),
      status: "FAILED",
      error: message,
      message: "Execução falhou. As demais lojas não são interrompidas.",
    });
    return {
      executionId,
      storeId: input.storeId,
      status: "FAILED",
      error: message,
    };
  }
}

export async function runPipelineForStores(
  storeIds: string[],
  period: ReportPeriod,
  referenceDate: string,
): Promise<PipelineResult[]> {
  const results: PipelineResult[] = [];
  for (const storeId of storeIds) {
    results.push(await runReportPipeline({ storeId, period, referenceDate }));
  }
  return results;
}
