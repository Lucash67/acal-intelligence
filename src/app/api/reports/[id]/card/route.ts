import { NextResponse } from "next/server";
import { getReportById } from "@/repositories";
import { renderExecutiveReportHtml } from "@/templates/morning-report-html";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getReportById(id);
  if (!report) {
    return NextResponse.json({ ok: false, error: "Relatório não encontrado." }, { status: 404 });
  }

  const html = report.visualHtml ?? renderExecutiveReportHtml(report);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "private, no-store",
    },
  });
}
