"use client";

import {
  useMutation,
  useQueryClient,
  type InfiniteData,
} from "@tanstack/react-query";

import {
  likePost,
  unlikePost,
} from "@/api/likes";
import { useAuth } from "@/context/AuthContext";
import type {
  PostType,
  PostsResponse,
} from "@/types/post";

export const useTogglePostLike = (
  post: PostType
) => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error(
          "Authentication required"
        );
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
        queryClient.getQueryData<
          InfiniteData<PostsResponse>
        >(["posts"]);

      queryClient.setQueryData<
        InfiniteData<PostsResponse>
      >(["posts"], (oldData) => {
        if (!oldData) {
          return oldData;
        }

        return {
          ...oldData,

          pages: oldData.pages.map(
            (page) => ({
              ...page,

              data: page.data.map(
                (currentPost) => {
                  if (
                    currentPost.id !== post.id
                  ) {
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
            })
          ),
        };
      });

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
};