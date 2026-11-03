import { apiFetch } from "@/lib/api";

import type { AdsResponse } from "@/types/ad";

export const getAds = async (
  token: string,
  page: number = 1,
): Promise<AdsResponse> => {
  const params = new URLSearchParams({
    page: String(page),
  });

  return apiFetch<AdsResponse>(
    `/ads?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
};