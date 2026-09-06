import { apiFetch } from "@/lib/api";



export const getPosts = async (token: string, page: number = 1) => {
  const data = await apiFetch(`/posts?page=${page}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data.posts;
};

export const createPost = async (
  token: string,
  content: string,
  image: File | null,
) => {
  const formData = new FormData();

  if (content.trim()) {
    formData.append("content", content);
  }

  if (image) {
    formData.append("image", image);
  }

  return apiFetch("/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};

export const updatePost = async (
  token: string,
  postId: number,
  content: string,
) => {
  return apiFetch(`/posts/${postId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });
};

export const deletePost = async (token: string, postId: number) => {
  return apiFetch(`/posts/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
