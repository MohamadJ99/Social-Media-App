const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export const likeComment = async (
  token: string,
  commentId: number
) => {
  const response = await fetch(
    `${API_URL}/comments/${commentId}/like`,
    {
      method: "POST",
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to like comment");
  }

  return response.json();
};

export const unlikeComment = async (
  token: string,
  commentId: number
) => {
  const response = await fetch(
    `${API_URL}/comments/${commentId}/like`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to unlike comment");
  }

  return response.json();
};

