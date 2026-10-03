"use client";

import Image from "next/image";
import { useState } from "react";

import StoryViewer from "./StoryViewer";

import { useStories } from "@/hooks/stories/useStories";
import type { StoryGroup } from "@/types/story";

const storageUrl = process.env.NEXT_PUBLIC_STORAGE_URL;

const Stories = () => {
  const {
    data: storyGroups = [],
    isLoading,
    isError,
  } = useStories();

  const [selectedGroupIndex, setSelectedGroupIndex] =
    useState<number | null>(null);

  if (isLoading) {
    return <StoriesSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full rounded-lg bg-white p-4 shadow-md">
        <p className="text-sm text-gray-500">
          Unable to load stories.
        </p>
      </div>
    );
  }

  if (storyGroups.length === 0) {
    return (
      <div className="w-full rounded-lg bg-white p-4 shadow-md">
        <p className="text-sm text-gray-500">
          No stories available.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-w-0 overflow-x-auto rounded-lg bg-white p-4 shadow-md scrollbar-hide">
        <div className="flex w-max gap-6">
          {storyGroups.map((group, index) => (
            <StoryItem
              key={group.user.id}
              group={group}
              onClick={() => {
                setSelectedGroupIndex(index);
              }
              }
            />
          ))}
        </div>
      </div>

      {selectedGroupIndex !== null && (
        <StoryViewer
          groups={storyGroups}
          initialGroupIndex={selectedGroupIndex}
          onClose={() =>
            setSelectedGroupIndex(null)
          }
        />
      )}
    </>
  );
};

type StoryItemProps = {
  group: StoryGroup;
  onClick: () => void;
};

const StoryItem = ({
  group,
  onClick,
}: StoryItemProps) => {
  const {
    user,
    is_current_user,
    has_unseen_stories,
  } = group;

  const avatarUrl = user.avatar
    ? `${storageUrl}/${user.avatar}`
    : "/default-avatar.png";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-20 shrink-0 flex-col items-center gap-2"
      aria-label={`View ${user.name}'s story`}
    >
      <div
        className={[
          "rounded-full p-[3px] transition",
          has_unseen_stories
            ? "bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500"
            : "bg-gray-300",
        ].join(" ")}
      >
        <div className="rounded-full bg-white p-[2px]">
          <Image
            src={avatarUrl}
            alt={user.name}
            width={80}
            height={80}
            className="h-20 w-20 rounded-full object-cover"
          />
        </div>
      </div>

      <span className="w-full truncate text-center text-xs font-medium text-gray-700">
        {is_current_user
          ? "Your story"
          : user.name}
      </span>
    </button>
  );
};

const StoriesSkeleton = () => {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-lg bg-white p-4 shadow-md">
      <div className="flex gap-6">
        {Array.from({ length: 6 }).map(
          (_, index) => (
            <div
              key={index}
              className="flex w-20 shrink-0 animate-pulse flex-col items-center gap-2"
            >
              <div className="h-[86px] w-[86px] rounded-full bg-gray-200" />

              <div className="h-3 w-14 rounded bg-gray-200" />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Stories;