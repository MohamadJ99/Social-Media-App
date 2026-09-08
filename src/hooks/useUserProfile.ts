import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/api/profile";
import { useAuth } from "@/context/AuthContext";

export const useUserProfile = (userId: number) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => getUserProfile(token!, userId),
    enabled: !!token && !!userId,
  });
};