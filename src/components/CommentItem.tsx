"use client";

import Image from "next/image";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import {
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

const CommentItem = ({
  comment,
  postId,
}: CommentItemProps) => {
  const { user, token } = useAuth();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const isOwner = user?.id === comment.user_id;

  // LIKE
  const likeMutation = useMutation({
    mutationFn: () => {
      if (comment.is_liked) {
        return unlikeComment(token!, comment.id);
      }

      return likeComment(token!, comment.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  // UPDATE
  const updateMutation = useMutation({
    mutationFn: () =>
      updateComment(
        token!,
        comment.id,
        content
      ),

    onSuccess: () => {
      setIsEditing(false);

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  // DELETE
  const deleteMutation = useMutation({
    mutationFn: () =>
      deleteComment(
        token!,
        comment.id
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  const handleUpdate = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent) {
      return;
    }

    updateMutation.mutate();
  };

  return (
    <div className="flex flex-col gap-4">

      {/* COMMENT */}
      <div className="flex gap-4">

        {/* AVATAR */}
        <Image
          src="https://images.pexels.com/photos/30299053/pexels-photo-30299053.jpeg"
          alt=""
          width={40}
          height={40}
          className="w-10 h-10 rounded-full object-cover"
        />

        {/* CONTENT */}
        <div className="flex-1">

          <div className="flex items-center justify-between">

            <span className="font-medium">
              {comment.user.name}
            </span>

            {/* ACTIONS */}
            {isOwner && (
              <div className="flex items-center gap-3 text-xs">

                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Edit
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => deleteMutation.mutate()}
                  disabled={deleteMutation.isPending}
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  {deleteMutation.isPending
                    ? "Deleting..."
                    : "Delete"}
                </button>

              </div>
            )}

          </div>

          {/* EDIT */}
          {isEditing ? (
            <div className="flex flex-col gap-2 mt-2">

              <textarea
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                className="w-full bg-slate-100 rounded-lg p-3 outline-none resize-none"
                rows={3}
              />

              <div className="flex gap-3 text-xs">

                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={updateMutation.isPending}
                  className="text-blue-500 hover:text-blue-700 disabled:opacity-50"
                >
                  {updateMutation.isPending
                    ? "Updating..."
                    : "Update"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setContent(comment.content);
                    setIsEditing(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
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

          {/* INTERACTION */}
          <div className="flex items-center gap-6 text-xs text-gray-500 mt-3">

            {/* LIKE */}
            <button
              type="button"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="flex items-center gap-2"
            >
              <Image
                src="/like.png"
                alt="Like"
                width={16}
                height={16}
                className="w-4 h-4"
              />

              <span>
                {comment.likes_count} Likes
              </span>
            </button>

            {/* REPLY */}
            <button
              type="button"
              className="hover:text-gray-800"
            >
              Reply
            </button>

          </div>

        </div>

      </div>

      {/* REPLIES */}
      {(comment.replies ?? []).length > 0 && (
        <div className="ml-12 flex flex-col gap-5">

          {(comment.replies ?? []).map((reply) => (
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

