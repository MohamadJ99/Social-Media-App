"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  BellRing,
  CirclePlay,
  House,
  MessagesSquare,
  Search,
  UserRoundPlus,
  UsersRound,
} from "lucide-react";

import MobileMenu from "./MobileMenu";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Notifications from "../common/Notifications";
import { useUnreadNotificationsCount } from "@/hooks/useNotifications";
import { useUnreadMessagesCount } from "@/hooks/useUnreadMessagesCount";

const Navbar = () => {
  const router = useRouter();
  const { user, logout, loading } = useAuth();

  const { data: unreadData } = useUnreadNotificationsCount();
  const { count: unreadMessagesCount } = useUnreadMessagesCount();

  const unreadCount = unreadData?.count ?? 0;

  const [showNotifications, setShowNotifications] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-24 items-center justify-between gap-6">
      {/* LEFT */}
      <div className="shrink-0">
        <Link
          href="/"
          className="whitespace-nowrap text-xl font-bold text-purple-600 transition hover:text-purple-700"
        >
          MJSOCIAL
        </Link>
      </div>

      {/* CENTER */}
      <div className="hidden min-w-0 flex-1 items-center justify-between md:flex">
        {/* LINKS */}
        <div className="flex gap-5 text-sm text-gray-600 lg:gap-6">
          {/* HOME */}
          <Link
            href="/"
            className="group flex items-center gap-2 whitespace-nowrap transition hover:text-purple-600"
          >
            <House className="h-4 w-4 text-gray-500 transition group-hover:text-purple-600" />

            <span>Homepage</span>
          </Link>

          {/* FRIENDS */}
          <Link
            href="/"
            className="group flex items-center gap-2 whitespace-nowrap transition hover:text-purple-600"
          >
            <UsersRound className="h-4 w-4 text-gray-500 transition group-hover:text-purple-600" />

            <span>Friends</span>
          </Link>

          {/* STORIES */}
          <Link
            href="/"
            className="group flex items-center gap-2 whitespace-nowrap transition hover:text-purple-600"
          >
            <CirclePlay className="h-4 w-4 text-gray-500 transition group-hover:text-purple-600" />

            <span>Stories</span>
          </Link>
        </div>

        {/* SEARCH */}
        <div className="hidden items-center rounded-xl bg-slate-100 p-2 xl:flex">
          <input
            type="text"
            placeholder="Search..."
            className="w-40 bg-transparent text-sm outline-none"
          />

          <Search className="h-4 w-4 text-gray-500" />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex shrink-0 items-center gap-3 lg:gap-5">
        {/* FRIEND REQUESTS */}
        <Link
          href="/friend-requests"
          className="group flex cursor-pointer rounded-full p-2 transition hover:bg-purple-50"
        >
          <UserRoundPlus className="h-5 w-5 text-gray-600 transition group-hover:text-purple-600" />
        </Link>

        {/* MESSAGES */}
        <Link
          href="/chat"
          className="group relative flex h-9 w-9 items-center justify-center rounded-full transition hover:bg-purple-50"
        >
          <MessagesSquare className="h-5 w-5 text-gray-600 transition group-hover:text-purple-600" />

          {unreadMessagesCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
              {unreadMessagesCount > 99
                ? "99+"
                : unreadMessagesCount}
            </span>
          )}
        </Link>

        {/* NOTIFICATIONS */}
        <div
          ref={notificationRef}
          className="relative"
        >
          <button
            type="button"
            onClick={() =>
              setShowNotifications((prev) => !prev)
            }
            className="group relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition hover:bg-purple-50"
          >
            <BellRing className="h-5 w-5 text-gray-600 transition group-hover:text-purple-600" />

            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-10 z-50">
              <Notifications
                onClose={() => setShowNotifications(false)}
              />
            </div>
          )}
        </div>

        {/* AUTH */}
        {!loading &&
          user && (
            <div className="flex items-center gap-3">
              {/* PROFILE */}
              <Link
                href={`/profile/${user.id}`}
                className="group flex items-center gap-2 rounded-full px-2 py-1 transition hover:bg-purple-50"
              >
                <div className="relative h-8 w-8 overflow-hidden rounded-full">
                  <Image
                    src={
                      user.avatar
                        ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${user.avatar}`
                        : "/default-avatar.png"
                    }
                    alt={user.name}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                </div>

                <span className="hidden text-sm font-medium transition group-hover:text-purple-600 sm:block">
                  {user.name}
                </span>
              </Link>

              {/* LOGOUT */}
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="hidden cursor-pointer whitespace-nowrap text-sm text-red-500 transition hover:text-red-600 lg:block"
              >
                Logout
              </button>
            </div>
          )}

        {/* MOBILE MENU */}
        <MobileMenu />
      </div>
    </div>
  );
};

export default Navbar;