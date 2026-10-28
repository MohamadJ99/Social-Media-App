
import { apiFetch } from "@/lib/api";

import type {
  CreateReportPayload,
  ReportResponse,
} from "@/types/report";

export const createReport = (
  token: string,
  payload: CreateReportPayload
): Promise<ReportResponse> => {
  const { targetType, targetId, reason, description } =
    payload;

  const endpoint =
    targetType === "post"
      ? `/posts/${targetId}/reports`
      : `/comments/${targetId}/reports`;

  return apiFetch<ReportResponse>(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      reason,
      description: description?.trim() || null,
    }),
  });
};
