import { apiFetch } from "@/lib/api";
import type {
  StoriesResponse,
  Story,
  StoryGroup,
  StoryVisibility,
} from "@/types/story";

type CreateStoryResponse = {
  message: string;
  story: Story;
};

export type CreateStoryData = {
  media: File;
  caption?: string;
  visibility: StoryVisibility;
};

export const getStories = async (token: string): Promise<StoryGroup[]> => {
  const response = await apiFetch<StoriesResponse>("/stories", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

type ViewStoryResponse = {
  message: string;
};

export const viewStory = async (
  token: string,
  storyId: number,
): Promise<ViewStoryResponse> => {
  return apiFetch<ViewStoryResponse>(`/stories/${storyId}/view`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const createStory = async (
  token: string,
  data: CreateStoryData,
): Promise<CreateStoryResponse> => {
  const formData = new FormData();

  formData.append("media", data.media);
  formData.append("visibility", data.visibility);

  if (data.caption?.trim()) {
    formData.append("caption", data.caption.trim());
  }

  return apiFetch<CreateStoryResponse>("/stories", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
};
