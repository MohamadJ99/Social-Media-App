"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import {
  createComment,
  getComments,
} from "@/api/comments";

import CommentItem from "./CommentItem";

type CommentsProps = {
  postId: number;
};

const Comments = ({ postId }: CommentsProps) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");

  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(token!, postId),
    enabled: Boolean(token),
  });

  const createCommentMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return createComment(
        token,
        postId,
        content.trim()
      );
    },

    onSuccess: () => {
      setContent("");

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  const handleSubmit = () => {
    const trimmedContent = content.trim();

    if (
      !trimmedContent ||
      createCommentMutation.isPending
    ) {
      return;
    }

    createCommentMutation.mutate();
  };

  if (isLoading) {
    return (
      <p className="text-sm text-gray-500">
        Loading comments...
      </p>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Failed to load comments.
      </p>
    );
  }

  const comments = data?.comments ?? [];

  return (
    <div className="flex flex-col gap-6">

      {/* WRITE COMMENT */}
      <div className="flex items-center gap-4">

        {/* USER AVATAR */}
        <Image
          src="https://images.pexels.com/photos/30299053/pexels-photo-30299053.jpeg"
          alt="Your profile"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover"
        />

        {/* COMMENT INPUT */}
        <div className="flex flex-1 items-center rounded-xl bg-slate-100 px-4 py-2 text-sm">

          <input
            type="text"
            value={content}
            onChange={(event) =>
              setContent(event.target.value)
            }
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleSubmit();
              }
            }}
            placeholder="Write a comment..."
            disabled={createCommentMutation.isPending}
            className="flex-1 bg-transparent outline-none disabled:cursor-not-allowed"
            aria-label="Write a comment"
          />

          {/* EMOJI */}
          <button
            type="button"
            className="mr-3"
            aria-label="Add emoji"
          >
            <Image
              src="/emoji.png"
              alt="Emoji"
              width={16}
              height={16}
              className="h-4 w-4 cursor-pointer"
            />
          </button>

          {/* SEND */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              !content.trim() ||
              createCommentMutation.isPending
            }
            className="text-sm font-medium text-blue-500 transition hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {createCommentMutation.isPending
              ? "Sending..."
              : "Send"}
          </button>

        </div>

      </div>

      {/* COMMENTS */}
      <div className="flex flex-col gap-6">

        {comments.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No comments yet.
          </p>
        ) : (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
            />
          ))
        )}

      </div>

    </div>
  );
};

export default Comments;
