import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { getAds } from "@/api/ads";

export const useAds = (
  page: number = 1,
  enabled: boolean = true,
) => {
  const { token } = useAuth();

  return useQuery({
    queryKey: ["ads", page],

    queryFn: () => getAds(token!, page),

    enabled: enabled && !!token && page > 0,

    staleTime: 1000 * 60 * 5,

    retry: 1,
  });
};