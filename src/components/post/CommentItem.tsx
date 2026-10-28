"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Flag } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useCommentActions } from "@/hooks/comments/useCommentActions";
import { useEmojiInput } from "@/hooks/shared/useEmojiInput";

import EmojiPickerButton from "./EmojiPickerButton";
import ReportModal from "@/components/reports/ReportModal";
import { formatRelativeTime } from "@/lib/date";

import type { Comment } from "@/types/comment";

type CommentItemProps = {
  comment: Comment;
  postId: number;
};

export default function CommentItem({
  comment,
  postId,
}: CommentItemProps) {
  const { user } = useAuth();

  // Local UI state
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);

  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  const isOwner = user?.id === comment.user_id;

  // Comment mutations
  const {
    likeMutation,
    updateMutation,
    deleteMutation,
    replyMutation,
  } = useCommentActions({
    commentId: comment.id,
    postId,
    isLiked: comment.is_liked,
  });

  // Emoji input
  const {
    inputRef: replyInputRef,
    handleEmojiClick,
  } = useEmojiInput(replyContent, setReplyContent);

  const avatarUrl = comment.user.avatar
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${comment.user.avatar}`
    : "/default-avatar.png";

  // Update comment
  const handleUpdate = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent || updateMutation.isPending) {
      return;
    }

    updateMutation.mutate(trimmedContent, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  // Cancel edit
  const handleCancelEdit = () => {
    setContent(comment.content);
    updateMutation.reset();
    setIsEditing(false);
  };

  // Submit reply
  const handleReply = () => {
    const trimmedContent = replyContent.trim();

    if (!trimmedContent || replyMutation.isPending) {
      return;
    }

    replyMutation.mutate(trimmedContent, {
      onSuccess: () => {
        setReplyContent("");
        setShowReplyInput(false);
      },
    });
  };

  // Cancel reply
  const handleCancelReply = () => {
    if (replyMutation.isPending) return;

    setReplyContent("");
    replyMutation.reset();
    setShowReplyInput(false);
  };

  // Close dropdown on outside click or Escape
  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <div className="flex flex-col gap-4">
      {/* COMMENT */}
      <div className="flex min-w-0 gap-3 sm:gap-4">
        {/* Avatar */}
        <Link
          href={`/profile/${comment.user.id}`}
          className="shrink-0"
        >
          <Image
            src={avatarUrl}
            alt={`${comment.user.name}'s profile`}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        </Link>

        <div className="min-w-0 flex-1">
          {/* HEADER */}
          <div className="flex items-center justify-between gap-2">

            <div className="flex min-w-0 flex-col gap-1">
              <Link
                href={`/profile/${comment.user.id}`}
                className="truncate font-medium text-gray-900 transition-colors hover:text-purple-600"
              >
                {comment.user.name}
              </Link>

              <time
                dateTime={comment.created_at}
                title={new Date(comment.created_at).toLocaleString()}
                className="text-xs text-gray-500"
              >
                {formatRelativeTime(comment.created_at)}
              </time>
            </div>


            {/* Comment actions dropdown */}
            <div
              ref={menuRef}
              className="relative shrink-0"
            >
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen((prev) => !prev);
                }}
                aria-label="Comment options"
                aria-haspopup="true"
                aria-expanded={isMenuOpen}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <MoreHorizontal
                  size={18}
                  aria-hidden="true"
                />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-9 z-30 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
                  {isOwner ? (
                    <>
                      {!isEditing && (
                        <button
                          type="button"
                          onClick={() => {
                            setContent(comment.content);
                            updateMutation.reset();
                            setIsEditing(true);
                            setIsMenuOpen(false);
                          }}
                          disabled={
                            updateMutation.isPending ||
                            deleteMutation.isPending
                          }
                          className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          deleteMutation.mutate();
                        }}
                        disabled={
                          deleteMutation.isPending ||
                          updateMutation.isPending
                        }
                        className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deleteMutation.isPending
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsReportOpen(true);
                      }}
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 transition hover:bg-purple-50 hover:text-purple-700"
                    >
                      <Flag
                        size={15}
                        aria-hidden="true"
                      />
                      Report comment
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* CONTENT */}
          {isEditing ? (
            <div className="mt-2 space-y-2">
              <textarea
                value={content}
                onChange={(event) => {
                  setContent(event.target.value);
                }}
                rows={3}
                maxLength={1000}
                disabled={updateMutation.isPending}
                aria-label="Edit comment"
                className="w-full resize-none rounded-lg border border-gray-200 bg-slate-50 p-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:opacity-50"
              />

              <div className="flex gap-3 text-xs">
                <button
                  type="button"
                  onClick={handleUpdate}
                  disabled={
                    !content.trim() ||
                    updateMutation.isPending
                  }
                  className="cursor-pointer font-medium text-purple-600 transition hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {updateMutation.isPending
                    ? "Updating..."
                    : "Save"}
                </button>

                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={updateMutation.isPending}
                  className="cursor-pointer text-gray-500 transition hover:text-gray-700 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>

              {updateMutation.isError && (
                <p
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {updateMutation.error.message}
                </p>
              )}
            </div>
          ) : (
            <p className="mt-2 break-words text-sm text-gray-700">
              {comment.content}
            </p>
          )}

          {/* Delete error */}
          {deleteMutation.isError && (
            <p
              role="alert"
              className="mt-2 text-xs text-red-600"
            >
              {deleteMutation.error.message}
            </p>
          )}

          {/* ACTIONS */}
          <div className="mt-3 flex flex-wrap items-center gap-5 text-xs">
            {/* Like */}
            <button
              type="button"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              aria-label={
                comment.is_liked
                  ? "Unlike comment"
                  : "Like comment"
              }
              aria-pressed={comment.is_liked}
              className={`cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${comment.is_liked
                  ? "font-medium text-purple-600"
                  : "text-gray-500 hover:text-purple-600"
                }`}
            >
              {comment.likes_count} Likes
            </button>

            {/* Reply */}
            <button
              type="button"
              onClick={() => {
                if (showReplyInput) {
                  handleCancelReply();
                } else {
                  replyMutation.reset();
                  setShowReplyInput(true);
                }
              }}
              disabled={replyMutation.isPending}
              className="cursor-pointer text-gray-500 transition-colors hover:text-purple-600 disabled:opacity-50"
            >
              Reply
            </button>
          </div>

          {/* Like error */}
          {likeMutation.isError && (
            <p
              role="alert"
              className="mt-2 text-xs text-red-600"
            >
              {likeMutation.error.message}
            </p>
          )}

          {/* REPLY FORM */}
          {showReplyInput && (
            <div className="mt-3 space-y-2">
              <div className="flex min-w-0 items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm">
                <input
                  ref={(element) => {
                    replyInputRef.current = element;
                  }}
                  type="text"
                  value={replyContent}
                  onChange={(event) => {
                    setReplyContent(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleReply();
                    }
                  }}
                  maxLength={1000}
                  placeholder="Write a reply..."
                  aria-label="Write a reply"
                  disabled={replyMutation.isPending}
                  className="min-w-0 flex-1 bg-transparent outline-none disabled:opacity-50"
                />

                <EmojiPickerButton
                  onEmojiClick={handleEmojiClick}
                />

                <button
                  type="button"
                  onClick={handleReply}
                  disabled={
                    !replyContent.trim() ||
                    replyMutation.isPending
                  }
                  className="cursor-pointer font-medium text-purple-600 transition hover:text-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {replyMutation.isPending
                    ? "Sending..."
                    : "Send"}
                </button>
              </div>

              {replyMutation.isError && (
                <p
                  role="alert"
                  className="text-xs text-red-600"
                >
                  {replyMutation.error.message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* NESTED REPLIES */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-6 flex flex-col gap-5 border-l border-purple-100 pl-3 sm:ml-10">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
            />
          ))}
        </div>
      )}

      {/* REPORT MODAL */}
      {isReportOpen && (
        <ReportModal
          isOpen
          targetType="comment"
          targetId={comment.id}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </div>
  );
}
