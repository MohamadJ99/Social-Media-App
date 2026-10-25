"use client";

import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deletePost } from "@/api/posts";
import { useAuth } from "@/context/AuthContext";

export const useDeletePost = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: number) => {
      if (!token) {
        throw new Error(
          "Authentication required"
        );
      }

      return deletePost(token, postId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
};