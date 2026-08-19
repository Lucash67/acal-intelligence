function read(name: string, fallback = ""): string {
  return process.env[name]?.trim() || fallback;
}

export const env = {
  databaseUrl: read("DATABASE_URL"),
  directUrl: read("DIRECT_URL"),
  openaiApiKey: read("OPENAI_API_KEY"),
  openaiModel: read("OPENAI_MODEL", "gpt-4o-mini"),
  zapiInstanceId: read("ZAPI_INSTANCE_ID"),
  zapiToken: read("ZAPI_TOKEN"),
  zapiClientToken: read("ZAPI_CLIENT_TOKEN"),
  mockMode: read("MOCK_MODE", "true") !== "false",
  dataSourceProvider: read("DATA_SOURCE_PROVIDER", "mock"),
  aiProvider: read("AI_PROVIDER", "mock"),
  messagingProvider: read("MESSAGING_PROVIDER", "mock"),
  authUsername: read("AUTH_USERNAME", "acal"),
};

export function isDatabaseConfigured(): boolean {
  return Boolean(env.databaseUrl);
}

export function isOpenAiConfigured(): boolean {
  return Boolean(env.openaiApiKey);
}

export function isMockMode(): boolean {
  return env.mockMode || env.dataSourceProvider === "mock";
}
