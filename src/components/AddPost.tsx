"use client";

import Image from "next/image";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const AddPost = () => {
  const { token } = useAuth();

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setMessage("");

    if (!content.trim()) {
      setIsSuccess(false);
      setMessage("Please write something");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }

    if (!token) {
      setIsSuccess(false);
      setMessage("You must be logged in");
      setTimeout(() => {
        setMessage("");
      }, 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/posts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setIsSuccess(false);
        setMessage(data.message || "Failed to create post");

        setTimeout(() => {
          setMessage("");
        }, 3000);

        return;
      }

      console.log("Created post:", data);

      setContent("");

      setIsSuccess(true);
      setMessage("Post created successfully!");

      setTimeout(() => {
        setMessage("");
      }, 3000);

    } catch (error) {
      console.error("Create post error:", error);

      setIsSuccess(false);
      setMessage("Something went wrong");

      setTimeout(() => {
        setMessage("");
      }, 3000);

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

      {/* POST */}
      <div className="flex-1">

        <form onSubmit={handleSubmit}>

          {/* TEXT INPUT */}
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