import type { MessagingProvider } from "@/providers/messaging/messaging-provider";
import { MockMessagingProvider } from "@/providers/messaging/mock-messaging-provider";

export function getMessagingProvider(): MessagingProvider {
  // Real WhatsApp dispatch is intentionally disabled in this phase.
  return new MockMessagingProvider();
}

export type { MessagingProvider } from "@/providers/messaging/messaging-provider";
