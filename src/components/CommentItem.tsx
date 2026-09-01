"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";

import {
  createComment,
  updateComment,
  deleteComment,
  type Comment,
} from "@/api/comments";

import {
  likeComment,
  unlikeComment,
} from "@/api/likes";

type CommentItemProps = {
  comment: Comment;
  postId: number;
};

const CommentItem = ({ comment, postId }: CommentItemProps) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const [showReply, setShowReply] = useState(false);
  const [reply, setReply] = useState("");

  const isOwner = user?.id === comment.user_id;

  const refreshComments = () => {
    queryClient.invalidateQueries({
      queryKey: ["comments", postId],
    });
  };

  // LIKE
  const likeMutation = useMutation({
    mutationFn: () => {
      if (comment.is_liked) {
        return unlikeComment(token!, comment.id);
      }

      return likeComment(token!, comment.id);
    },
    onSuccess: refreshComments,
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: () =>
      updateComment(token!, comment.id, content.trim()),

    onSuccess: () => {
      setIsEditing(false);
      refreshComments();
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteComment(token!, comment.id),

    onSuccess: refreshComments,
  });

  // REPLY
  const replyMutation = useMutation({
    mutationFn: () =>
      createComment(
        token!,
        postId,
        reply.trim(),
        comment.id
      ),

    onSuccess: () => {
      setReply("");
      setShowReply(false);
      refreshComments();
    },
  });

  const handleUpdate = () => {
    if (!content.trim()) return;

    updateMutation.mutate();
  };

  const handleReply = () => {
    if (!reply.trim()) return;

    replyMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4">

      {/* COMMENT */}
      <div className="flex gap-4">

        <Image
          src="https://images.pexels.com/photos/30299053/pexels-photo-30299053.jpeg"
          alt=""
          width={40}
          height={40}
          className="h-10 w-10 rounded-full object-cover"
        />

        <div className="flex-1">

          {/* USER */}
          <div className="flex justify-between">

            <span className="font-medium">
              {comment.user.name}
            </span>

            {isOwner && (
              <div className="flex gap-3 text-xs">

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 disabled:opacity-50"
                >
                  {deleteMutation.isPending
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>
            )}

          </div>

          {/* CONTENT */}
          {isEditing ? (
            <div className="mt-2">

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={2}
                className="w-full rounded-lg bg-slate-100 p-2 outline-none"
              />

              <div className="mt-2 flex gap-3 text-xs">

                <button
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="text-blue-500"
                >
                  {updateMutation.isPending
                    ? "Updating..."
                    : "Update"}
                </button>

                <button
                  onClick={() => {
                    setContent(comment.content);
                    setIsEditing(false);
                  }}
                  className="text-gray-500"
                >
                  Cancel
                </button>

              </div>

            </div>
          ) : (
            <p className="mt-2">
              {comment.content}
            </p>
          )}

          {/* ACTIONS */}
          <div className="mt-3 flex gap-6 text-xs text-gray-500">

            <button
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="flex items-center gap-2 disabled:opacity-50"
            >
              <Image
                src="/like.png"
                alt="Like"
                width={16}
                height={16}
              />

              {comment.likes_count} Likes
            </button>

            <button
              onClick={() => setShowReply(!showReply)}
              className="hover:text-gray-800"
            >
              Reply
            </button>

          </div>

          {/* REPLY INPUT */}
          {showReply && (
            <div className="mt-3 flex gap-2">

              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleReply();
                  }
                }}
                placeholder="Write a reply..."
                disabled={replyMutation.isPending}
                className="flex-1 rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none"
              />

              <button
                onClick={handleReply}
                disabled={
                  !reply.trim() ||
                  replyMutation.isPending
                }
                className="text-sm text-blue-500 disabled:opacity-50"
              >
                {replyMutation.isPending
                  ? "Sending..."
                  : "Send"}
              </button>

            </div>
          )}

        </div>

      </div>

      {/* REPLIES */}
      {(comment.replies ?? []).length > 0 && (
        <div className="ml-12 flex flex-col gap-4">

          {(comment.replies ??[]).map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
            />
          ))}

        </div>
      )}

    </div>
  );
};

export default CommentItem;

