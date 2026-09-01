const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (token: string) => ({
  Accept: "application/json",
  Authorization: `Bearer ${token}`,
});

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
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: getAuthHeaders(token),
    body: formData,
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Failed to create post");
  }
  return data;
};

export const getPosts = async (token: string) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "GET",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
};

export const updatePost = async (
  token: string,
  postId: number,
  content: string,
) => {
  const response = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: {
      ...getAuthHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(data?.message ?? "Failed to update post");
  }

  return response.json();
};

export const deletePost = async (token: string, postId: number) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    },
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to delete post");
  }

  return data;
};
