const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createPost = async (
  token: string,
  content: string
) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      content,
    }),
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
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch posts");
  }

  return data;
};