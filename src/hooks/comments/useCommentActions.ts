
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import {
  createComment,
  updateComment,
  deleteComment,
} from "@/api/comments";
import { likeComment, unlikeComment } from "@/api/likes";

type CommentActionsParams = {
  commentId: number;
  postId: number;
  isLiked: boolean;
};

export function useCommentActions({
  commentId,
  postId,
  isLiked,
}: CommentActionsParams) {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const getToken = (): string => {
    if (!token) {
      throw new Error("Authentication required");
    }

    return token;
  };

  const invalidateComments = () =>
    queryClient.invalidateQueries({
      queryKey: ["comments", postId],
    });

  const invalidatePosts = () =>
    queryClient.invalidateQueries({
      queryKey: ["posts"],
    });

  const likeMutation = useMutation({
    mutationFn: () =>
      isLiked
        ? unlikeComment(getToken(), commentId)
        : likeComment(getToken(), commentId),

    onSuccess: invalidateComments,
  });

  const updateMutation = useMutation({
    mutationFn: (content: string) =>
      updateComment(getToken(), commentId, content),

    onSuccess: invalidateComments,
  });

  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteComment(getToken(), commentId),

    onSuccess: async () => {
      await Promise.all([
        invalidateComments(),
        invalidatePosts(),
      ]);
    },
  });

  const replyMutation = useMutation({
    mutationFn: (content: string) =>
      createComment(
        getToken(),
        postId,
        content,
        commentId
      ),

    onSuccess: async () => {
      await Promise.all([
        invalidateComments(),
        invalidatePosts(),
      ]);
    },
  });

  return {
    likeMutation,
    updateMutation,
    deleteMutation,
    replyMutation,
  };
}
