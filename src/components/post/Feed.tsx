"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

import Post from "./Post";
import FeedAdvertisement from "@/components/ads/FeedAdvertisement";

import { useAuth } from "@/context/AuthContext";

import { getPosts } from "@/api/posts";

import { useAds } from "@/hooks/ads/useAds";

import type { PostType, PostsResponse } from "@/types/post";

type FeedProps = {
  userId?: number;
};

const AD_AFTER_POST = 4;

const Feed = ({ userId }: FeedProps) => {
  const { token } = useAuth();

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const isHomeFeed = userId === undefined;

  // POSTS QUERY
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts", userId],

    queryFn: ({ pageParam }) =>
      getPosts(token!, pageParam, userId),

    initialPageParam: 1,

    getNextPageParam: (lastPage: PostsResponse) => {
      if (lastPage.current_page >= lastPage.last_page) {
        return undefined;
      }

      return lastPage.current_page + 1;
    },

    enabled: !!token,
  });

  // ADVERTISEMENTS QUERY
  const { data: adsResponse } = useAds(1, isHomeFeed);

  const advertisements = adsResponse?.data ?? [];

  // INFINITE SCROLL
  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "200px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="py-6 text-center text-gray-500">
        Loading posts...
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    return (
      <div className="py-6 text-center text-red-500">
        {error instanceof Error
          ? error.message
          : "Failed to load posts"}
      </div>
    );
  }

  // FLATTEN PAGINATED POSTS
  const posts: PostType[] =
    data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col gap-6">

      {posts.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-center text-gray-500 shadow-md">
          No posts yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6">

          {posts.map((post, index) => {
            const shouldShowAd =
              isHomeFeed &&
              advertisements.length > 0 &&
              index === AD_AFTER_POST - 1;

            const advertisement = shouldShowAd
              ? advertisements[0]
              : null;

            return (
              <div key={post.id}>

                {/* POST */}
                <div className="rounded-lg bg-white p-4 shadow-md">
                  <Post post={post} />
                </div>

                {/* MOBILE ADVERTISEMENT */}
                {advertisement && (
                  <div className="mt-6">
                    <FeedAdvertisement
                      advertisement={advertisement}
                    />
                  </div>
                )}

              </div>
            );
          })}

        </div>
      )}

      {/* LOADING MORE */}
      {isFetchingNextPage && (
        <div className="py-4 text-center text-gray-500">
          Loading more posts...
        </div>
      )}

      {/* INFINITE SCROLL TRIGGER */}
      <div
        ref={loadMoreRef}
        className="h-10"
        aria-hidden="true"
      />

    </div>
  );
};

export default Feed;