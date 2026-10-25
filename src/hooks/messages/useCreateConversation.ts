"use client";

import { useMutation } from "@tanstack/react-query";

import { createConversation } from "@/api/conversations";
import { useAuth } from "@/context/AuthContext";

export const useCreateConversation = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error("Authentication required.");
      }

      return createConversation(
        token,
        userId
      );
    },
  });
};