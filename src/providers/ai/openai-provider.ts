import { env } from "@/lib/env";
import { aiAnalysisSchema } from "@/providers/ai/ai-analysis.schema";
import type { AIAnalysisInput, AIProvider } from "@/providers/ai/ai-provider";

export class OpenAIProvider implements AIProvider {
  async analyze(input: AIAnalysisInput) {
    if (!env.openaiApiKey) {
      throw new Error("OPENAI_API_KEY is not configured.");
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openaiApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.openaiModel,
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: input.systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              instruction:
                "Interprete as métricas oficiais abaixo. Não recalcule números. Não invente valores. Responda apenas JSON válido.",
              metrics: input.metrics,
            }),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI request failed with status ${response.status}.`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI returned an empty analysis.");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("OpenAI returned invalid JSON.");
    }

    return aiAnalysisSchema.parse(parsed);
  }
}
