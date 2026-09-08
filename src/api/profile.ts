import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";

export const getMyProfile = async (
  token: string
): Promise<User> => {
  const response = await apiFetch("/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const getUserProfile = async (
  token: string,
  userId: number
): Promise<User> => {
  const response = await apiFetch(`/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};