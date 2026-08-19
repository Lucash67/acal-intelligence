import type {
  DocumentMessage,
  ImageMessage,
  MessageResult,
  MessagingProvider,
  TextMessage,
} from "@/providers/messaging/messaging-provider";

export class MockMessagingProvider implements MessagingProvider {
  async sendText(message: TextMessage): Promise<MessageResult> {
    void message;
    return { ok: true, provider: "mock", simulated: true };
  }

  async sendImage(message: ImageMessage): Promise<MessageResult> {
    void message;
    return { ok: true, provider: "mock", simulated: true };
  }

  async sendDocument(message: DocumentMessage): Promise<MessageResult> {
    void message;
    return { ok: true, provider: "mock", simulated: true };
  }
}
