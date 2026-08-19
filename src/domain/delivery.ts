export const DELIVERY_STATUSES = [
  "PENDING",
  "SUCCESS",
  "FAILED",
  "RETRYING",
] as const;

export type DeliveryStatus = (typeof DELIVERY_STATUSES)[number];
export type DeliveryChannel = "WHATSAPP";

export type ReportDelivery = {
  id: string;
  executionId: string;
  storeId: string;
  channel: DeliveryChannel;
  recipient: string;
  status: DeliveryStatus;
  attempts: number;
  sentAt: string | null;
  error: string | null;
  createdAt: string;
};
