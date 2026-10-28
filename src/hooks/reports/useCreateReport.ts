
"use client";

import { useMutation } from "@tanstack/react-query";

import { createReport } from "@/api/reports";
import { useAuth } from "@/context/AuthContext";
import type { CreateReportPayload } from "@/types/report";

export const useCreateReport = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (payload: CreateReportPayload) => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return createReport(token, payload);
    },
  });
};
