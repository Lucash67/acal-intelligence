import { NextResponse } from "next/server";
import { z } from "zod";
import { getRequestSession } from "@/lib/auth-request";
import { toIsoDate } from "@/lib/dates";
import { listReportableStores } from "@/mocks/stores";
import { runPipelineForStores, runReportPipeline } from "@/services/report-pipeline";

const bodySchema = z.object({
  storeId: z.string().optional(),
  period: z.enum(["MORNING", "AFTERNOON"]).default("MORNING"),
  referenceDate: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await getRequestSession();
  if (session.role !== "admin") {
    return NextResponse.json(
      { ok: false, error: "Esta etapa ainda não está liberada neste acesso." },
      { status: 403 },
    );
  }

  try {
    const json = await request.json().catch(() => ({}));
    const body = bodySchema.parse(json);
    const referenceDate = body.referenceDate ?? toIsoDate();

    const results = body.storeId
      ? [await runReportPipeline({ storeId: body.storeId, period: body.period, referenceDate })]
      : await runPipelineForStores(
          listReportableStores().map((store) => store.id),
          body.period,
          referenceDate,
        );

    const success = results.filter((item) => item.status === "SUCCESS").length;
    const failed = results.filter((item) => item.status === "FAILED").length;

    return NextResponse.json({
      ok: true,
      summary: `${success} loja(s) processada(s) com sucesso, ${failed} falha(s).`,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pipeline request failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
