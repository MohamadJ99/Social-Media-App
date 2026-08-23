"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Feed from "@/components/Feed";
import LeftMenu from "@/components/LeftMenu";
import RightMenu from "@/components/RightMenu";
import Image from "next/image";
import ProtectedRoute from "@/components/ProtectedRoute";

type User = {
  id: number;
  name: string;
  email: string;
};

const ProfilePage = () => {
  const params = useParams();
  const id = params.id;

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user");
        }

        const data = await response.json();

        setUser(data.user);
      } catch (error) {
        console.error("Profile error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getUser();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        User not found
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex gap-6 pt-6">

        {/* LEFT */}
        <div className="hidden xl:block w-[20%]">
          <LeftMenu type="profile" />
        </div>

        {/* CENTER */}
        <div className="w-full lg:w-[70%] xl:w-[50%]">
          <div className="flex flex-col gap-6">

            <div className="flex flex-col items-center justify-center">

              {/* COVER */}
              <div className="w-full h-64 relative">

                <Image
                  src="https://images.pexels.com/photos/34787094/pexels-photo-34787094.jpeg"
                  alt=""
                  fill
                  className="rounded-md object-cover"
                />

                {/* PROFILE IMAGE */}
                <Image
                  src="https://images.pexels.com/photos/30835516/pexels-photo-30835516.jpeg"
                  alt=""
                  width={128}
                  height={128}
                  className="w-32 h-32 rounded-full absolute left-0 right-0 m-auto -bottom-16 ring-4 ring-white object-cover"
                />

              </div>

              {/* NAME */}
              <h1 className="mt-20 mb-4 text-2xl font-medium">
                {user.name}
              </h1>

              {/* STATS */}
              <div className="flex items-center justify-center gap-12 mb-4">

                <div className="flex flex-col items-center">
                  <span className="font-medium">102</span>
                  <span className="text-sm">Posts</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-medium">6.2k</span>
                  <span className="text-sm">Followers</span>
                </div>

                <div className="flex flex-col items-center">
                  <span className="font-medium">30</span>
                  <span className="text-sm">Following</span>
                </div>

              </div>

            </div>

            <Feed />

          </div>
        </div>

        {/* RIGHT */}
        <div className="hidden lg:block w-[30%]">
          <RightMenu userId={String(user.id)} />
        </div>

      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;