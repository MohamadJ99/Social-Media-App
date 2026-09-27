"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

const MobileMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();
    const { logout } = useAuth();

    const handleLogout = async () => {
        await logout();

        setIsOpen(false);
        router.push("/login");
    };

    const closeMenu = () => {
        setIsOpen(false);
    };

    return (
        <div className="lg:hidden">
            {/* MENU BUTTON */}
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label="Toggle menu"
                className="flex flex-col gap-[4.5px]"
            >
                <div
                    className={`h-1 w-6 origin-left rounded-sm bg-blue-500 transition duration-500 ease-in-out ${
                        isOpen ? "rotate-45" : ""
                    }`}
                />

                <div
                    className={`h-1 w-6 rounded-sm bg-blue-500 transition duration-500 ease-in-out ${
                        isOpen ? "opacity-0" : ""
                    }`}
                />

                <div
                    className={`h-1 w-6 origin-left rounded-sm bg-blue-500 transition duration-500 ease-in-out ${
                        isOpen ? "-rotate-45" : ""
                    }`}
                />
            </button>

            {/* MOBILE MENU */}
            {isOpen && (
                <div className="absolute left-0 top-24 z-10 flex h-[calc(100vh-96px)] w-full flex-col items-center justify-center gap-8 bg-white text-xl font-medium">
                    <Link href="/" onClick={closeMenu}>
                        Home
                    </Link>

                    <Link href="/" onClick={closeMenu}>
                        Friends
                    </Link>

                    <Link href="/" onClick={closeMenu}>
                        Groups
                    </Link>

                    <Link href="/" onClick={closeMenu}>
                        Stories
                    </Link>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-red-500 transition hover:text-red-600"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default MobileMenu;