"use client";

import Image from "next/image";
import Link from "next/link";
import {
  MessageCircle,
  UserRound,
  UsersRound,
} from "lucide-react";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import { useFriends } from "@/hooks/friends/useFriends";

const FriendsPage = () => {
  const {
    data: friends = [],
    isLoading,
    isError,
  } = useFriends();

  return (
    <ProtectedRoute>
      <div className="mx-auto w-full max-w-5xl py-6">
        {/* HEADER */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <UsersRound className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Friends
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                View and manage your friends.
              </p>
            </div>
          </div>
        </div>

        {/* LOADING */}
        {isLoading && (
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
            Loading friends...
          </div>
        )}

        {/* ERROR */}
        {isError && (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-5 text-sm text-red-600">
            Unable to load friends.
          </div>
        )}

        {/* EMPTY */}
        {!isLoading &&
          !isError &&
          friends.length === 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <UsersRound className="h-6 w-6" />
              </div>

              <h2 className="font-semibold text-gray-900">
                No friends yet
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Search for people and start connecting.
              </p>
            </div>
          )}

        {/* FRIENDS */}
        {!isLoading &&
          !isError &&
          friends.length > 0 && (
            <>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  My Friends
                </h2>

                <span className="text-sm text-gray-500">
                  {friends.length}{" "}
                  {friends.length === 1
                    ? "friend"
                    : "friends"}
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-md"
                  >
                    <Link
                      href={`/profile/${friend.id}`}
                      className="flex min-w-0 items-center gap-3"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-gray-100">
                        <Image
                          src={
                            friend.avatar
                              ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${friend.avatar}`
                              : "/default-avatar.png"
                          }
                          alt={friend.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-semibold text-gray-900 transition hover:text-purple-600">
                          {friend.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          Friend
                        </p>
                      </div>
                    </Link>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link
                        href={`/profile/${friend.id}`}
                        aria-label={`View ${friend.name}'s profile`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-600 transition hover:bg-purple-50 hover:text-purple-600"
                      >
                        <UserRound className="h-4 w-4" />
                      </Link>

                      <Link
                        href={`/chat?user=${friend.id}`}
                        aria-label={`Message ${friend.name}`}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-50 text-purple-600 transition hover:bg-purple-100"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
      </div>
    </ProtectedRoute>
  );
};

export default FriendsPage;