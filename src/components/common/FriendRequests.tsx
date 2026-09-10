"use client";

import Image from "next/image";
import Link from "next/link";
import { useIncomingFriendRequests } from "@/hooks/useIncomingFriendRequests";
import { useAcceptFriendRequest } from "@/hooks/useAcceptFriendRequest";
import { useRejectFriendRequest } from "@/hooks/useRejectFriendRequest";

const FriendRequests = () => {
  const { data: requests = [], isLoading, isError, } = useIncomingFriendRequests();
  const { mutate: acceptRequest, variables: acceptingRequestId, isPending: isAccepting, } = useAcceptFriendRequest();
  const { mutate: rejectRequest, variables: rejectingRequestId, isPending: isRejecting, } = useRejectFriendRequest();

  return (
    <div className="p-4 bg-white rounded-lg shadow-md text-sm flex flex-col gap-4">

      {/* TOP */}
      <div className="flex items-center justify-between font-medium">
        <span className="text-gray-500">Friend Requests</span>

        <Link
          href="/"
          className="text-blue-500 text-xs"
        >
          See all
        </Link>
      </div>

      {isLoading && (
        <p className="text-sm text-gray-500">
          Loading requests...
        </p>
      )}

      {isError && (
        <p className="text-sm text-red-500">
          Failed to load friend requests.
        </p>
      )}

      {!isLoading && !isError && requests.length === 0 && (
        <p className="text-sm text-gray-500">
          No friend requests.
        </p>
      )}

      {!isLoading &&
        !isError &&
        requests.map((request) => {
          const storageUrl =
            process.env.NEXT_PUBLIC_STORAGE_URL;

          const avatarUrl = request.user.avatar
            ? `${storageUrl}/${request.user.avatar}`
            : "/default-avatar.png";

          return (
            <div
              key={request.id}
              className="flex items-center justify-between"
            >
              {/* USER */}
              <div className="flex items-center gap-4">
                <Image
                  src={avatarUrl}
                  alt={request.user.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />

                <span className="font-semibold">
                  {request.user.name}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => acceptRequest(request.id)}
                  disabled={
                    isAccepting &&
                    acceptingRequestId === request.id
                  }
                  className="disabled:opacity-50"
                >
                  <Image
                    src="/accept.png"
                    alt="Accept"
                    width={20}
                    height={20}
                  />
                </button>

                <button
                  onClick={() => rejectRequest(request.id)}
                  disabled={
                    isRejecting &&
                    rejectingRequestId === request.id
                  }
                  className="disabled:opacity-50"
                >
                  <Image
                    src="/reject.png"
                    alt="Reject"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default FriendRequests;