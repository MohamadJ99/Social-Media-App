import { apiFetch } from "@/lib/api";
import type { Conversation } from "@/types/conversation";

interface ConversationsResponse {
  data: Conversation[];
}

interface MarkConversationAsReadResponse {
  message: string;
}

export const getConversations = async (
  token: string,
): Promise<Conversation[]> => {
  const response = await apiFetch<ConversationsResponse>("/conversations", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createConversation = async (
  token: string,
  userId: number,
): Promise<Conversation> => {
  const response = await apiFetch<{
    data: Conversation;
  }>("/conversations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      user_id: userId,
    }),
  });

  return response.data;
};

export const markConversationAsRead = async (
  token: string,
  conversationId: number,
): Promise<MarkConversationAsReadResponse> => {
  return apiFetch<MarkConversationAsReadResponse>(
    `/conversations/${conversationId}/read`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};
