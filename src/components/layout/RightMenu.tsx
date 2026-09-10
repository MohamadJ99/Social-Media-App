"use client";

import Ad from "../common/Ad";
import Birthdays from "../common/Birthdays";
import FriendRequests from "../common/FriendRequests";
import UserInfoCard from "../profile/UserInfoCard";
import UserMediaCard from "../profile/UserMediaCard";
import { useUserProfile } from "@/hooks/useUserProfile";

type RightMenuProps = {
  userId?: string;
  isOwnProfile?: boolean;
};

const RightMenu = ({
  userId,
  isOwnProfile,
}: RightMenuProps) => {
  const { data: user } = useUserProfile(Number(userId));

  return (
    <div className="flex flex-col gap-6">
      {userId && user ? (
        <>
          <UserInfoCard
            user={user}
            isOwnProfile={isOwnProfile}
          />

          <UserMediaCard userId={userId} />
        </>
      ) : null}

      {(!userId || isOwnProfile) && <FriendRequests />}

      <Birthdays />
      <Ad size="md" />
    </div>
  );
};

export default RightMenu;