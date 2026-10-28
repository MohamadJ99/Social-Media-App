"use client";

import Image from "next/image";
import Comments from "./Comments";
import { useState, useRef, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";

import type { PostType } from "@/types/post";

import { useUpdatePost } from "@/hooks/posts/useUpdatePost";

import { useDeletePost } from "@/hooks/posts/useDeletePost";

import { useTogglePostLike } from "@/hooks/posts/useTogglePostLike";

import Link from "next/link";

import { formatRelativeTime } from "@/lib/date";
import { MoreHorizontal, Flag } from "lucide-react";
import ReportModal from "@/components/reports/ReportModal";


type PostProps = {
  post: PostType;
};

const Post = ({ post }: PostProps) => {
  const { user } = useAuth();

  const commentInputRef = useRef<HTMLInputElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content ?? "");

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const isOwner = user?.id === post.user_id;


  const updateMutation = useUpdatePost();

  const deleteMutation = useDeletePost();

  const likeMutation = useTogglePostLike(post);

  // Handlers

  const handleUpdate = () => {
    const trimmedContent = content.trim();

    if (
      !trimmedContent ||
      updateMutation.isPending
    ) {
      return;
    }

    updateMutation.mutate(
      {
        postId: post.id,
        content: trimmedContent,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setContent(post.content ?? "");
    setIsEditing(false);
  };

  const imageUrl = post.image
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.image}`
    : null;

  const videoUrl = post.video
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.video}`
    : null;

  const avatarUrl = post.user.avatar
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.user.avatar}`
    : "/default-avatar.png";

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const handleClickOutside = (
      event: MouseEvent
    ) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          event.target as Node
        )
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [isMenuOpen]);

  return (
    <div className="flex flex-col gap-4">

      {/* User */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <Link
            href={`/profile/${post.user.id}`}
            className="flex cursor-pointer items-center gap-4"
          >
            <Image
              src={avatarUrl}
              alt={post.user.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover"
            />

            <div className="flex flex-col">
              <span className="font-medium transition-colors hover:text-purple-600">
                {post.user.name}
              </span>

              <time
                dateTime={post.created_at}
                title={new Date(
                  post.created_at
                ).toLocaleString()}
                className="text-xs text-gray-500"
              >
                {formatRelativeTime(post.created_at)}
              </time>
            </div>
          </Link>

        </div>

        {/* Post actions */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Post options"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <MoreHorizontal className="h-5 w-5" />
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 top-10 z-20 w-40 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-lg">
              {isOwner ? (
                <>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setIsMenuOpen(false);
                      }}
                      className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Edit
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      deleteMutation.mutate(post.id);
                    }}
                    disabled={
                      deleteMutation.isPending ||
                      updateMutation.isPending
                    }
                    className="w-full cursor-pointer px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
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
                  className="flex w-full cursor-pointer items-center gap-2 px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700"
                >
                  <Flag size={16} />
                  Report post
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}

      <div className="flex flex-col gap-4">


        {imageUrl && (
          <div className="relative h-96 w-full">

            <Image
              src={imageUrl}
              alt=""
              fill
              className="rounded-md object-cover"
            />

          </div>
        )}

        {videoUrl && (
          <video
            src={videoUrl}
            controls
            className="max-h-[500px] w-full rounded-md object-cover"
          />
        )}

        {/* Edit */}

        {isEditing ? (
          <div className="flex flex-col gap-3">

            <textarea
              value={content ?? ""}
              onChange={(event) =>
                setContent(event.target.value)
              }
              rows={4}
              disabled={
                updateMutation.isPending
              }
              className="w-full resize-none rounded-lg bg-slate-100 p-3 outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />

            <div className="flex items-center gap-4 text-sm">

              <button
                type="button"
                onClick={handleUpdate}
                disabled={
                  !content?.trim() ||
                  updateMutation.isPending
                }
                className="font-medium text-blue-500 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {updateMutation.isPending
                  ? "Updating..."
                  : "Update"}
              </button>

              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={
                  updateMutation.isPending
                }
                className=" cursor-pointer text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

            </div>

          </div>
        ) : (
          <p>{post.content}</p>
        )}

      </div>

      {/* Interaction */}

      <div className="my-4 flex items-center justify-between text-sm">

        <div className="flex gap-8">

          {/* Like */}

          <button
            type="button"
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-2 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Image
              src="/like.png"
              alt="Like"
              width={16}
              height={16}
            />

            <span className="text-gray-300">|</span>

            <span
              className={
                post.is_liked
                  ? "font-medium text-blue-500"
                  : "text-gray-500"
              }
            >
              {post.likes_count}{" "}
              <span className="hidden md:inline">
                Likes
              </span>
            </span>
          </button>

          {/* Comment */}

          <button
            type="button"
            onClick={() => commentInputRef.current?.focus()}
            className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-2 transition hover:bg-slate-100"
          >
            <Image
              src="/comment.png"
              alt="Comments"
              width={16}
              height={16}
            />

            <span className="text-gray-300">|</span>

            <span className="text-gray-500">
              {post.comments_count}{" "}
              <span className="hidden md:inline">
                Comments
              </span>
            </span>
          </button>

        </div>

        {/* Share */}

        <button
          type="button"
          onClick={() => {
            // Share logic
          }}
          className="flex cursor-pointer items-center gap-4 rounded-xl bg-slate-50 p-2 transition hover:bg-slate-100"
        >
          <Image
            src="/share.png"
            alt="Share"
            width={16}
            height={16}
          />

          <span className="text-gray-300">|</span>

          <span className="text-gray-500">
            4{" "}
            <span className="hidden md:inline">
              Shares
            </span>
          </span>
        </button>

      </div>

      {/* Comments */}

      <Comments postId={post.id} commentInputRef={commentInputRef} />

      {isReportOpen && (
        <ReportModal
          isOpen={isReportOpen}
          targetType="post"
          targetId={post.id}
          onClose={() => setIsReportOpen(false)}
        />
      )}

    </div>
  );
};

export default Post;

