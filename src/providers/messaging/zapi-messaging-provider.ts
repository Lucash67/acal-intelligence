import type { MessageResult, MessagingProvider } from "@/providers/messaging/messaging-provider";

export class ZApiMessagingProvider implements MessagingProvider {
  async sendText(): Promise<MessageResult> {
    // TODO(ACAL-WHATSAPP): implementar disparo real via Z-API após definição de instância, tokens e destinatários oficiais.
    throw new Error("Z-API messaging is not enabled in this MVP.");
  }

  async sendImage(): Promise<MessageResult> {
    // TODO(ACAL-WHATSAPP): implementar envio de imagem 1080x1350 via Z-API.
    throw new Error("Z-API messaging is not enabled in this MVP.");
  }

  async sendDocument(): Promise<MessageResult> {
    // TODO(ACAL-WHATSAPP): implementar envio de documento/PDF via Z-API.
    throw new Error("Z-API messaging is not enabled in this MVP.");
  }
}
