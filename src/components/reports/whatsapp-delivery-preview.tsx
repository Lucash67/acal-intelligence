import type { ExecutiveReport } from "@/domain/report";
import { buildWhatsAppPreview } from "@/lib/whatsapp-preview";

export function WhatsAppDeliveryPreview({
  report,
  recipient,
  sent = false,
}: {
  report: ExecutiveReport;
  recipient: string;
  sent?: boolean;
}) {
  const text = buildWhatsAppPreview(report);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-[#061018]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm text-white">WhatsApp simulado</p>
          <p className="text-[12px] text-white/55">{recipient}</p>
        </div>
        <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] text-white/70">
          {sent ? "Enviado · simulado" : "Não enviado"}
        </span>
      </div>
      <div className="space-y-3 px-4 py-4">
        <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-md bg-[#0077ab] px-3.5 py-3 text-[13px] leading-relaxed whitespace-pre-wrap text-white">
          {text}
        </div>
        <div className="ml-auto max-w-[92%] rounded-2xl rounded-tr-md bg-white/10 px-3.5 py-3 text-[12px] text-white/70">
          Anexo: card 1080×1350 · {report.storeName}
        </div>
      </div>
    </div>
  );
}
