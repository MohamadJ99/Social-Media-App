import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";
import type { FriendRequest } from "@/types/friend";

export const getFriends = async (
  token: string
): Promise<User[]> => {
  const response = await apiFetch("/friends", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const sendFriendRequest = async (
  token: string,
  userId: number,
) => {
  return apiFetch(`/users/${userId}/friend`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const cancelFriendRequest = async (
  token: string,
  friendshipId: number,
) => {
  return apiFetch(`/friendships/${friendshipId}/cancel`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeFriend = async (
  token: string,
  friendshipId: number,
) => {
  return apiFetch(`/friendships/${friendshipId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};



export const getIncomingFriendRequests = async (
  token: string,
): Promise<FriendRequest[]> => {
  const response = await apiFetch("/friend-requests/incoming", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const acceptFriendRequest = async (
  token: string,
  friendshipId: number,
) => {
  return apiFetch(`/friendships/${friendshipId}/accept`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const rejectFriendRequest = async (
  token: string,
  friendshipId: number,
) => {
  return apiFetch(`/friendships/${friendshipId}/reject`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};