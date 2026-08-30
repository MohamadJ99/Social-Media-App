"use client";

import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import { useAuth } from "@/context/AuthContext";
import { getPosts } from "@/api/posts";

type PostType = {
  id: number;
  user_id: number;
  content: string | null;
  image: string | null;
  created_at: string;
  likes_count: number;
  is_liked: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
};

const Feed = () => {
  const { token } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["posts"],

    queryFn: () => getPosts(token!),

    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Loading posts...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-6 text-red-500">
        {error instanceof Error
          ? error.message
          : "Failed to load posts"}
      </div>
    );
  }

  const posts: PostType[] = data?.posts ?? [];

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex flex-col gap-12">

      {posts.length === 0 ? (
        <p className="text-center text-gray-500">
          No posts yet.
        </p>
      ) : (
        posts.map((post) => (
          <Post
            key={post.id}
            post={post}
          />
        ))
      )}

    </div>
  );
};

export default Feed;