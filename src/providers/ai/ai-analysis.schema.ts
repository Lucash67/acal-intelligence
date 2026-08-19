import { z } from "zod";

export const aiAnalysisSchema = z.object({
  executiveSummary: z.string().min(20),
  highlights: z.array(z.string().min(4)).min(1).max(5),
  attentionPoints: z.array(z.string().min(4)).min(1).max(5),
  actionPlan: z.array(z.string().min(8)).min(2).max(3),
});
