import { env, isOpenAiConfigured } from "@/lib/env";
import type { AIProvider } from "@/providers/ai/ai-provider";
import { MockAIProvider } from "@/providers/ai/mock-ai-provider";
import { OpenAIProvider } from "@/providers/ai/openai-provider";

export function getAIProvider(): AIProvider {
  if (env.aiProvider === "openai" && isOpenAiConfigured()) {
    return new OpenAIProvider();
  }

  return new MockAIProvider();
}

export type { AIProvider } from "@/providers/ai/ai-provider";
