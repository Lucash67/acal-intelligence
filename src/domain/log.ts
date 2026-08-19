export type LogStatus = "INFO" | "SUCCESS" | "FAILED";

export type PipelineStage =
  | "START"
  | "DATA_SOURCE"
  | "VALIDATION"
  | "ANALYTICS"
  | "AI_ANALYSIS"
  | "REPORT"
  | "VISUAL_RENDER"
  | "DELIVERY"
  | "FINISH";

export type SystemLog = {
  id: string;
  executionId: string | null;
  storeId: string | null;
  stage: PipelineStage | string;
  timestamp: string;
  durationMs: number | null;
  status: LogStatus;
  error: string | null;
  message: string | null;
};
