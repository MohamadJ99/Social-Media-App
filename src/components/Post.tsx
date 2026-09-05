"use client";

import Image from "next/image";
import Comments from "./Comments";
import { useState } from "react";
import type { PostType } from "@/types/post";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";

import {
  deletePost,
  updatePost,
} from "@/api/posts";

import {
  likePost,
  unlikePost,
} from "@/api/likes";



type PostsResponse = {
  posts: PostType[];
};

type PostProps = {
  post: PostType;
};

const Post = ({ post }: PostProps) => {
  const { user, token } = useAuth();

  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(post.content ?? "");

  const isOwner = user?.id === post.user_id;

  // Update post

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return updatePost(
        token,
        post.id,
        content.trim()
      );
    },

    onSuccess: () => {
      setIsEditing(false);

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // Delete post

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      return deletePost(token, post.id);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // Like / unlike post

  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error("Authentication required");
      }

      if (post.is_liked) {
        return unlikePost(token, post.id);
      }

      return likePost(token, post.id);
    },

    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["posts"],
      });

      const previousPosts =
        queryClient.getQueryData<PostsResponse>([
          "posts",
        ]);

      queryClient.setQueryData<PostsResponse>(
        ["posts"],
        (oldData) => {
          if (!oldData) {
            return oldData;
          }

          return {
            ...oldData,

            posts: oldData.posts.map(
              (currentPost) => {
                if (currentPost.id !== post.id) {
                  return currentPost;
                }

                const newIsLiked =
                  !currentPost.is_liked;

                return {
                  ...currentPost,
                  is_liked: newIsLiked,
                  likes_count:
                    currentPost.likes_count +
                    (newIsLiked ? 1 : -1),
                };
              }
            ),
          };
        }
      );

      return {
        previousPosts,
      };
    },

    onError: (
      _error,
      _variables,
      context
    ) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(
          ["posts"],
          context.previousPosts
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  // Handlers

  const handleUpdate = () => {
    const trimmedContent = content.trim();

    if (
      !trimmedContent ||
      updateMutation.isPending
    ) {
      return;
    }

    updateMutation.mutate();
  };

  const handleCancelEdit = () => {
    setContent(post.content?? "");
    setIsEditing(false);
  };

  const imageUrl = post.image
    ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${post.image}`
    : null;

  return (
    <div className="flex flex-col gap-4">

      {/* User */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <Image
            src="https://images.pexels.com/photos/1311311/pexels-photo-1311311.jpeg"
            alt=""
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />

          <span className="font-medium">
            {post.user.name}
          </span>

        </div>

        {/* Owner actionser */}

        {isOwner && (
          <div className="flex items-center gap-3 text-sm">

            {!isEditing && (
              <button
                type="button"
                onClick={() =>
                  setIsEditing(true)
                }
                className="text-blue-500 hover:text-blue-700"
              >
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={() =>
                deleteMutation.mutate()
              }
              disabled={
                deleteMutation.isPending ||
                updateMutation.isPending
              }
              className="text-red-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleteMutation.isPending
                ? "Deleting..."
                : "Delete"}
            </button>

          </div>
        )}

      </div>

      {/* Content */}

      <div className="flex flex-col gap-4">


        {imageUrl && (
          <div className="relative h-96 w-full">

            <Image
              src={imageUrl}
              alt=""
              fill
              unoptimized
              className="rounded-md object-cover"
            />

          </div>
        )}

        {/* Edit */}

        {isEditing ? (
          <div className="flex flex-col gap-3">

            <textarea
              value={content?? ""}
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
                className="text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
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

          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-2">

            <button
              type="button"
              onClick={() =>
                likeMutation.mutate()
              }
              disabled={
                likeMutation.isPending
              }
              className="cursor-pointer disabled:opacity-50"
            >

              <Image
                src="/like.png"
                alt="Like"
                width={16}
                height={16}
              />

            </button>

            <span className="text-gray-300">
              |
            </span>

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

          </div>

          {/* Comments */}

          <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-2">

            <Image
              src="/comment.png"
              alt="Comments"
              width={16}
              height={16}
              className="cursor-pointer"
            />

            <span className="text-gray-300">
              |
            </span>

            <span className="text-gray-500">
              {post.comments_count}{" "}

              <span className="hidden md:inline">
                Comments
              </span>
            </span>

          </div>

        </div>

        {/* Share */}

        <div className="flex items-center gap-4 rounded-xl bg-slate-100 p-2">

          <Image
            src="/share.png"
            alt="Share"
            width={16}
            height={16}
            className="cursor-pointer"
          />

          <span className="text-gray-300">
            |
          </span>

          <span className="text-gray-500">
            4{" "}

            <span className="hidden md:inline">
              Shares
            </span>
          </span>

        </div>

      </div>

      {/* Comments */}

      <Comments postId={post.id} />

    </div>
  );
};

export default Post;

