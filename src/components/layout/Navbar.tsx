"use client";

import Link from "next/link";
import MobileMenu from "./MobileMenu";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  return (
    <div className="h-24 flex items-center justify-between gap-6">

      {/* LEFT */}
      <div className="shrink-0">
        <Link
          href="/"
          className="font-bold text-xl text-blue-500 whitespace-nowrap"
        >
          MJSOCIAL
        </Link>
      </div>

      {/* CENTER */}
      <div className="hidden md:flex flex-1 items-center justify-between min-w-0">

        {/* LINKS */}
        <div className="flex gap-5 lg:gap-6 text-gray-600 text-sm">

          <Link
            href="/"
            className="flex items-center gap-2 whitespace-nowrap hover:text-blue-500 transition"
          >
            <Image
              src="/home.png"
              alt="Homepage"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Homepage</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 whitespace-nowrap hover:text-blue-500 transition"
          >
            <Image
              src="/friends.png"
              alt="Friends"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Friends</span>
          </Link>

          <Link
            href="/"
            className="flex items-center gap-2 whitespace-nowrap hover:text-blue-500 transition"
          >
            <Image
              src="/stories.png"
              alt="Stories"
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span>Stories</span>
          </Link>

        </div>

        {/* SEARCH */}
        <div className="hidden xl:flex p-2 bg-slate-100 items-center rounded-xl">

          <input
            type="text"
            placeholder="search..."
            className="bg-transparent outline-none text-sm w-40"
          />

          <Image
            src="/search.png"
            alt="Search"
            width={14}
            height={14}
          />

        </div>

      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 lg:gap-5 shrink-0">

        {/* PEOPLE */}
        <div className="hidden sm:block cursor-pointer">
          <Image
            src="/people.png"
            alt="People"
            width={24}
            height={24}
          />
        </div>

        {/* MESSAGES */}
        <div className="hidden sm:block cursor-pointer">
          <Image
            src="/messages.png"
            alt="Messages"
            width={20}
            height={20}
          />
        </div>

        {/* NOTIFICATIONS */}
        <div className="hidden sm:block cursor-pointer">
          <Image
            src="/notifications.png"
            alt="Notifications"
            width={20}
            height={20}
          />
        </div>

        {/* AUTH */}
        {!loading && (
          user ? (
            <div className="flex items-center gap-3">

              {/* PROFILE */}
              <Link
                href={`/profile/${user.id}`}
                className="flex items-center gap-2 text-sm font-medium hover:text-blue-500 transition"
              >
                <Image
                  src="/login.png"
                  alt="Profile"
                  width={24}
                  height={24}
                />

                <span className="whitespace-nowrap">
                  {user.name}
                </span>
              </Link>

              {/* LOGOUT */}
              <button
                onClick={async () => {
                  await logout();
                  router.push("/login");
                }}
                className="text-sm text-red-500 hover:text-red-600 cursor-pointer whitespace-nowrap"
              >
                Logout
              </button>

            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm">

              <Image
                src="/login.png"
                alt="Login"
                width={20}
                height={20}
              />

              <Link
                href="/login"
                className="whitespace-nowrap hover:text-blue-500 transition"
              >
                Login/Register
              </Link>

            </div>
          )
        )}

        {/* MOBILE MENU */}
        <MobileMenu />

      </div>

    </div>
  );
};

export default Navbar;