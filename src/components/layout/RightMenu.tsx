"use client";

import Ad from "../common/Ad";

import UserInfoCard from "../profile/UserInfoCard";
import UserMediaCard from "../profile/UserMediaCard";

import AIPostAssistant from "@/components/ai/AIPostAssistant";

import { useUserProfile } from "@/hooks/profile/useProfile";
import { useAds } from "@/hooks/ads/useAds";

type RightMenuProps = {
  userId?: string;
  isOwnProfile?: boolean;
};

const RightMenu = ({
  userId,
  isOwnProfile = false,
}: RightMenuProps) => {

  const { data: user } = useUserProfile(
    Number(userId)
  );

  const {
    data: adsResponse,
    isPending: adsLoading,
    isError: adsError,
  } = useAds();

  const advertisement = adsResponse?.data[0];

  return (
    <div className="flex flex-col gap-6">

      {/* PROFILE CONTENT */}
      {userId && user ? (
        <>
          <UserInfoCard
            user={user}
            isOwnProfile={isOwnProfile}
          />

          <UserMediaCard
            userId={userId}
          />
        </>
      ) : null}

      {/* HOME CONTENT */}
      {!userId && <AIPostAssistant />}

      {/* ADS LOADING */}
      {adsLoading && (
        <div
          role="status"
          aria-label="Loading advertisement"
          className="animate-pulse rounded-lg bg-white p-4 shadow-md"
        >
          <div className="mb-4 h-4 w-24 rounded bg-gray-200" />
          <div className="h-36 rounded-lg bg-gray-200" />
          <div className="mt-4 h-4 w-32 rounded bg-gray-200" />
          <div className="mt-3 h-3 w-full rounded bg-gray-200" />
        </div>
      )}

      {/* ADS ERROR */}
      {adsError && (
        <div
          role="alert"
          className="rounded-lg bg-white p-4 text-sm text-gray-500 shadow-md"
        >
          Advertisement is currently unavailable.
        </div>
      )}

      {/* ACTIVE ADVERTISEMENT */}
      {advertisement && (
        <Ad
          ad={advertisement}
          size="md"
        />
      )}

    </div>
  );
};

export default RightMenu;