export type CommentUser = {
  id: number;
  name: string;
  email: string;
};

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  parent_id: number | null;
  content: string;
  created_at: string;
  updated_at: string;

  likes_count: number;
  is_liked: boolean;

  user: CommentUser;
  replies?: Comment[];
};

type CommentsResponse = {
  comments: Comment[];
};

type CommentResponse = {
  message: string;
  comment: Comment;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
  Accept: "application/json",
});

export const getComments = async (
  token: string,
  postId: number
): Promise<CommentsResponse> => {
  const response = await fetch(
    `${API_URL}/posts/${postId}/comments`,
    {
      method: "GET",
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch comments");
  }

  return response.json();
};

export const createComment = async (
  token: string,
  postId: number,
  content: string,
  parentId?: number
): Promise<CommentResponse> => {
  const response = await fetch(
    `${API_URL}/posts/${postId}/comments`,
    {
      method: "POST",
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        parent_id: parentId ?? null,
      }),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message ?? "Failed to create comment"
    );
  }

  return response.json();
};

export const updateComment = async (
  token: string,
  commentId: number,
  content: string
): Promise<CommentResponse> => {
  const response = await fetch(
    `${API_URL}/comments/${commentId}`,
    {
      method: "PATCH",
      headers: {
        ...getAuthHeaders(token),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message ?? "Failed to update comment"
    );
  }

  return response.json();
};

export const deleteComment = async (
  token: string,
  commentId: number
): Promise<{ message: string }> => {
  const response = await fetch(
    `${API_URL}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: getAuthHeaders(token),
    }
  );

  if (!response.ok) {
    const data = await response.json().catch(() => null);

    throw new Error(
      data?.message ?? "Failed to delete comment"
    );
  }

  return response.json();
};