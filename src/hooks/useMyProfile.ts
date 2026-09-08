import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/api/profile";
import { useAuth } from "@/context/AuthContext";

export const useMyProfile = () => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["my-profile"],
    queryFn: () => getMyProfile(token!),
    enabled: !!token,
  });
};