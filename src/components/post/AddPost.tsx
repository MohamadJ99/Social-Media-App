"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { createPost } from "@/api/posts";

const AddPost = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (message: string, success: boolean) => {
    setMessage(message);
    setIsSuccess(success);

    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !image) {
      showMessage("Please write something or select an image", false);
      return;
    }

    if (!token) {
      showMessage("You must be logged in", false);
      return;
    }

    setLoading(true);

    try {
      const data = await createPost(
        token,
        content,
        image
      );

      console.log("Created post:", data);
      
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });

      setContent("");
      setImage(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      showMessage("Post created successfully!", true);

    } catch (error) {
      console.error("Create post error:", error);

      showMessage(
        error instanceof Error
          ? error.message
          : "Something went wrong",
        false
      );

    } finally {
      setLoading(false);
    }
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

      <div className="flex-1">

        <form onSubmit={handleSubmit}>

          {/* TEXT */}
          <div className="flex gap-4">

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="bg-slate-100 rounded-lg flex-1 p-2 outline-none resize-none focus:ring-2 focus:ring-blue-400"
              rows={3}
            />

            <Image
              src="/emoji.png"
              alt=""
              width={20}
              height={20}
              className="w-5 h-5 cursor-pointer self-end"
            />

          </div>

          {/* SELECTED IMAGE */}
          {image && (
            <div className="mt-3 text-sm text-gray-500">
              Selected: {image.name}
            </div>
          )}

          {/* OPTIONS */}
          <div className="flex items-center gap-4 mt-4 text-gray-400 flex-wrap">

            {/* PHOTO */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image
                src="/addimage.png"
                alt=""
                width={20}
                height={20}
              />
              Photo
            </button>

            {/* VIDEO */}
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image
                src="/addVideo.png"
                alt=""
                width={20}
                height={20}
              />
              Video
            </button>

            {/* POLL */}
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image
                src="/poll.png"
                alt=""
                width={20}
                height={20}
              />
              Poll
            </button>

            {/* EVENT */}
            <button
              type="button"
              className="flex items-center gap-2 cursor-pointer"
            >
              <Image
                src="/addevent.png"
                alt=""
                width={20}
                height={20}
              />
              Event
            </button>

            {/* POST */}
            <button
              type="submit"
              disabled={loading}
              className="ml-auto bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-5 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed transition"
            >
              {loading ? "Posting..." : "Post"}
            </button>

          </div>

        </form>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mt-4 px-4 py-3 rounded-lg text-sm font-medium text-center border ${isSuccess
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

