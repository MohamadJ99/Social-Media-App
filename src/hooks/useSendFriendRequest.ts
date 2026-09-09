import { useMutation } from "@tanstack/react-query";
import { sendFriendRequest } from "@/api/friends";
import { useAuth } from "@/context/AuthContext";

export const useSendFriendRequest = () => {
  const { token } = useAuth();

  return useMutation({
    mutationFn: (userId: number) => {
      if (!token) {
        throw new Error("Authentication required.");
      }

      return sendFriendRequest(token, userId);
    },
  });
};