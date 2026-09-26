import { apiFetch } from "@/lib/api";
import type { Conversation } from "@/types/conversation";

export const getConversations = async (
    token: string
): Promise<Conversation[]> => {
    const response = await apiFetch("/conversations", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
};

export const markConversationAsRead = async (
    token: string,
    conversationId: number
): Promise<{ message: string }> => {
    return apiFetch(
        `/conversations/${conversationId}/read`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );
};