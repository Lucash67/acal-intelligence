export type TextMessage = {
  to: string;
  text: string;
};

export type ImageMessage = {
  to: string;
  imagePath?: string;
  imageBase64?: string;
  caption?: string;
};

export type DocumentMessage = {
  to: string;
  fileName: string;
  documentPath?: string;
  caption?: string;
};

export type MessageResult = {
  ok: boolean;
  provider: string;
  simulated: boolean;
  error?: string;
};

export interface MessagingProvider {
  sendText(message: TextMessage): Promise<MessageResult>;
  sendImage(message: ImageMessage): Promise<MessageResult>;
  sendDocument(message: DocumentMessage): Promise<MessageResult>;
}
