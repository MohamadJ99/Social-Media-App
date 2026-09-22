"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  const pathname = usePathname();

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register";

  return (
    <>
      {!isAuthPage && (
        <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
          <Navbar />
        </div>
      )}

      <div className="bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
        {children}
      </div>
    </>
  );
};

export default AppLayout;