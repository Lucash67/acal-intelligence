import { mkdir, writeFile } from "fs/promises";
import path from "path";
import type { ExecutiveReport } from "@/domain/report";
import { renderMorningReportHtml } from "@/templates/morning-report-html";

export type VisualRenderResult = {
  html: string;
  imagePath: string | null;
  skippedReason: string | null;
};

export async function renderVisualReport(report: ExecutiveReport): Promise<VisualRenderResult> {
  const html = renderMorningReportHtml(report);

  try {
    const { chromium } = await import("playwright");
    const outputDir = path.join(process.cwd(), "generated-reports");
    await mkdir(outputDir, { recursive: true });
    const imagePath = path.join(outputDir, `${report.id}.png`);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({
      viewport: { width: 1080, height: 1350 },
      deviceScaleFactor: 1,
    });
    await page.setContent(html, { waitUntil: "domcontentloaded" });
    await page.screenshot({ path: imagePath, type: "png" });
    await browser.close();

    return { html, imagePath, skippedReason: null };
  } catch {
    return {
      html,
      imagePath: null,
      skippedReason: "Playwright/Chromium indisponível. Preview HTML gerado; PNG omitido.",
    };
  }
}

export async function writeHtmlPreview(reportId: string, html: string): Promise<string> {
  const outputDir = path.join(process.cwd(), "generated-reports");
  await mkdir(outputDir, { recursive: true });
  const filePath = path.join(outputDir, `${reportId}.html`);
  await writeFile(filePath, html, "utf8");
  return filePath;
}
