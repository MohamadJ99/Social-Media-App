"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updatePost } from "@/api/posts";
import { useAuth } from "@/context/AuthContext";

type UpdatePostPayload = {
  postId: number;
  content: string;
};

export const useUpdatePost = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      content,
    }: UpdatePostPayload) => {
      if (!token) {
        throw new Error(
          "Authentication required"
        );
      }

      return updatePost(
        token,
        postId,
        content
      );
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};