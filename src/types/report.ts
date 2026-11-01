
export type ReportTarget =
  | "post"
  | "comment";

export type ReportReason =
  | "spam"
  | "harassment"
  | "hate_speech"
  | "violence"
  | "sexual_content"
  | "false_information"
  | "other";

export type CreateReportPayload = {
  targetType: ReportTarget;
  targetId: number;
  reason: ReportReason;
  description?: string;
};

export type ReportResponse = {
  message: string;
};
