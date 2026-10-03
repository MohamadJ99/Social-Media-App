import { apiFetch } from "@/lib/api";
import type {
  StoriesResponse,
  StoryGroup,
} from "@/types/story";

export const getStories = async (
  token: string
): Promise<StoryGroup[]> => {
  const response = await apiFetch<StoriesResponse>(
    "/stories",
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};


type ViewStoryResponse = {
  message: string;
};

export const viewStory = async (
  token: string,
  storyId: number
): Promise<ViewStoryResponse> => {
  return apiFetch<ViewStoryResponse>(
    `/stories/${storyId}/view`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};