"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import {
  createComment,
  deleteComment,
  getComments,
  updateComment,
} from "@/api/comments";

type CommentsProps = {
  postId: number;
  postOwnerId: number;
};

const Comments = ({
  postId,
  postOwnerId,
}: CommentsProps) => {
  const { user, token } = useAuth();

  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [editingCommentId, setEditingCommentId] =
    useState<number | null>(null);
  const [editingContent, setEditingContent] =
    useState("");

  // GET COMMENTS
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(token!, postId),
    enabled: Boolean(token),
  });

  // CREATE COMMENT
  const createMutation = useMutation({
    mutationFn: () =>
      createComment(
        token!,
        postId,
        content.trim()
      ),

    onSuccess: () => {
      setContent("");

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  // UPDATE COMMENT
  const updateMutation = useMutation({
    mutationFn: ({
      commentId,
      content,
    }: {
      commentId: number;
      content: string;
    }) =>
      updateComment(
        token!,
        commentId,
        content
      ),

    onSuccess: () => {
      setEditingCommentId(null);
      setEditingContent("");

      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  // DELETE COMMENT
  const deleteMutation = useMutation({
    mutationFn: (commentId: number) =>
      deleteComment(token!, commentId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["comments", postId],
      });
    },
  });

  const handleCreate = (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!token || !content.trim()) {
      return;
    }

    createMutation.mutate();
  };

  const handleUpdate = (commentId: number) => {
    if (!token || !editingContent.trim()) {
      return;
    }

    updateMutation.mutate({
      commentId,
      content: editingContent.trim(),
    });
  };

  const startEditing = (
    commentId: number,
    currentContent: string
  ) => {
    setEditingCommentId(commentId);
    setEditingContent(currentContent);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const comments = data?.comments ?? [];

  return (
    <div>

      {/* WRITE COMMENT */}

      <form
        onSubmit={handleCreate}
        className="flex items-center gap-4"
      >
        <Image
          src="https://images.pexels.com/photos/30299053/pexels-photo-30299053.jpeg"
          alt=""
          width={32}
          height={32}
          className="w-8 h-8 rounded-full object-cover"
        />

        <div className="flex-1 flex items-center justify-between bg-slate-100 rounded-xl text-sm px-6 py-2">
          <input
            type="text"
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Write a comment..."
            disabled={createMutation.isPending}
            className="bg-transparent outline-none flex-1"
          />

          <Image
            src="/emoji.png"
            alt=""
            width={16}
            height={16}
            className="cursor-pointer"
          />
        </div>

        <button
          type="submit"
          disabled={
            createMutation.isPending ||
            !content.trim()
          }
          className="bg-blue-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {createMutation.isPending
            ? "..."
            : "Post"}
        </button>
      </form>

      {/* CREATE ERROR */}

      {createMutation.isError && (
        <p className="text-red-500 text-sm mt-2">
          {createMutation.error instanceof Error
            ? createMutation.error.message
            : "Failed to create comment"}
        </p>
      )}

      {/* COMMENTS */}

      <div>
        {isLoading && (
          <p className="text-sm text-gray-500 mt-6">
            Loading comments...
          </p>
        )}

        {isError && (
          <p className="text-sm text-red-500 mt-6">
            {error instanceof Error
              ? error.message
              : "Failed to load comments"}
          </p>
        )}

        {!isLoading &&
          !isError &&
          comments.length === 0 && (
            <p className="text-sm text-gray-500 mt-6">
              No comments yet.
            </p>
          )}

        {comments.map((comment) => {
          const isCommentOwner =
            user?.id === comment.user_id;

          const isPostOwner =
            user?.id === postOwnerId;

          return (
            <div
              key={comment.id}
              className="flex gap-4 justify-between mt-6"
            >
              {/* AVATAR */}

              <Image
                src="https://images.pexels.com/photos/30299053/pexels-photo-30299053.jpeg"
                alt=""
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover"
              />

              {/* CONTENT */}

              <div className="flex flex-col gap-2 flex-1">

                <span className="font-medium">
                  {comment.user.name}
                </span>

                {editingCommentId ===
                comment.id ? (
                  <div className="flex flex-col gap-2">

                    <input
                      type="text"
                      value={editingContent}
                      onChange={(e) =>
                        setEditingContent(
                          e.target.value
                        )
                      }
                      className="bg-slate-100 rounded-lg px-3 py-2 outline-none"
                    />

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(comment.id)
                        }
                        disabled={
                          updateMutation.isPending ||
                          !editingContent.trim()
                        }
                        className="text-blue-500 text-sm disabled:opacity-50"
                      >
                        {updateMutation.isPending
                          ? "Saving..."
                          : "Save"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelEditing}
                        className="text-gray-500 text-sm"
                      >
                        Cancel
                      </button>

                    </div>

                  </div>
                ) : (
                  <p>{comment.content}</p>
                )}

                {/* COMMENT META */}

                <div className="flex items-center gap-8 text-xs text-gray-500 mt-2">

                  <div className="flex items-center gap-4">
                    <Image
                      src="/like.png"
                      alt=""
                      width={12}
                      height={12}
                      className="cursor-pointer w-4 h-4"
                    />

                    <span className="text-gray-300">
                      |
                    </span>

                    <span>
                      0 Likes
                    </span>
                  </div>

                  <span className="cursor-pointer">
                    Reply
                  </span>

                </div>
              </div>

              {/* ACTIONS */}

              {(isCommentOwner ||
                isPostOwner) && (
                <div className="flex items-center gap-3">

                  {isCommentOwner && (
                    <button
                      type="button"
                      onClick={() =>
                        startEditing(
                          comment.id,
                          comment.content
                        )
                      }
                      disabled={
                        updateMutation.isPending
                      }
                      className="text-blue-500 text-sm hover:text-blue-700"
                    >
                      Edit
                    </button>
                  )}

                  {(isCommentOwner ||
                    isPostOwner) && (
                    <button
                      type="button"
                      onClick={() =>
                        deleteMutation.mutate(
                          comment.id
                        )
                      }
                      disabled={
                        deleteMutation.isPending
                      }
                      className="text-red-500 text-sm hover:text-red-700 disabled:opacity-50"
                    >
                      {deleteMutation.isPending
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}

                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Comments;