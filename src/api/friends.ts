import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";

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