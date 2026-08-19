import type { AIAnalysis } from "@/domain/ai";
import type { StoreMetrics } from "@/domain/metrics";

export type AIAnalysisInput = {
  metrics: StoreMetrics;
  systemPrompt: string;
};

export interface AIProvider {
  analyze(input: AIAnalysisInput): Promise<AIAnalysis>;
}
