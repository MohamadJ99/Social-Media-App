"use client";

import Image from "next/image";
import { useState } from "react";
import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createPost } from "@/api/posts";

const AddPost = () => {
  const { token } = useAuth();

  const queryClient = useQueryClient();

  const [content, setContent] = useState("");

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const showMessage = (message: string, success: boolean) => {
    setMessage(message);
    setIsSuccess(success);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const createPostMutation = useMutation({
    mutationFn: (content: string) => {
      if (!token) {
        throw new Error("You must be logged in");
      }

      return createPost(token, content);
    },

    onSuccess: (data) => {
      console.log("Created post:", data);

      setContent("");

      showMessage(
        "Post created successfully!",
        true
      );

      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },

    onError: (error) => {
      console.error(
        "Create post error:",
        error
      );

      showMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong",
        false
      );
    },
  });

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setMessage("");

    if (!content.trim()) {
      showMessage(
        "Please write something",
        false
      );

      return;
    }

    createPostMutation.mutate(
      content.trim()
    );
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg flex gap-4 justify-between text-sm">

      {/* AVATAR */}

      <Image
        src="https://images.pexels.com/photos/29883936/pexels-photo-29883936.jpeg"
        alt=""
        width={48}
        height={48}
        className="w-12 h-12 object-cover rounded-full"
      />

      {/* POST */}

      <div className="flex-1">

        <form onSubmit={handleSubmit}>

          {/* TEXT INPUT */}

          <div className="flex gap-4">

            <textarea
              value={content}
              onChange={(e) =>
                setContent(e.target.value)
              }
              placeholder="What's on your mind?"
              className="bg-slate-100 rounded-lg flex-1 p-2 outline-none resize-none focus:ring-2 focus:ring-blue-400"
              rows={3}
              disabled={
                createPostMutation.isPending
              }
            />

            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />

          </div>

          {/* POST OPTIONS */}

          <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">

            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="/addimage.png"
                alt=""
                width={20}
                height={20}
              />
              Photo
            </div>

            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="/addVideo.png"
                alt=""
                width={20}
                height={20}
              />
              Video
            </div>

            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="/poll.png"
                alt=""
                width={20}
                height={20}
              />
              Poll
            </div>

            <div className="flex items-center gap-2 cursor-pointer">
              <Image
                src="/addevent.png"
                alt=""
                width={20}
                height={20}
              />
              Event
            </div>

            {/* POST BUTTON */}

            <button
              type="submit"
              disabled={
                createPostMutation.isPending
              }
              className="ml-auto bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-5 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed transition"
            >
              {createPostMutation.isPending
                ? "Posting..."
                : "Post"}
            </button>

          </div>

        </form>

        {/* MESSAGE */}

        {message && (
          <div
            className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium text-center border ${
              isSuccess
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            {message}
          </div>
        )}

      </div>
    </div>
  );
};

export default AddPost;