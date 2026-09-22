"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const Login = () => {
    const router = useRouter();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [message, setMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent
    ) => {
        e.preventDefault();

        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: JSON.stringify(form),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setIsSuccess(false);
                setMessage(
                    data.message || "Login failed"
                );

                return;
            }

            login(data.token, data.user);

            setIsSuccess(true);
            setMessage("Login successful!");

            setTimeout(() => {
                router.push("/");
            }, 1000);

            setForm({
                email: "",
                password: "",
            });

        } catch (error) {
            console.error(error);

            setIsSuccess(false);
            setMessage("Something went wrong");

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-slide-right min-h-screen bg-white p-4 sm:p-6 lg:p-8">

            <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-6xl overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm sm:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]">

                {/* IMAGE SECTION */}
                <div className="relative hidden w-1/2 lg:block">

                    <Image
                        src="/auth-illustration.png"
                        alt="Social media illustration"
                        fill
                        priority
                        sizes="50vw"
                        className="object-contain p-8 xl:p-12"
                    />

                </div>

                {/* FORM SECTION */}
                <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 xl:px-20">

                    <div className="w-full max-w-md">

                        {/* LOGO */}
                        <div className="mb-8">

                            <Link
                                href="/"
                                className="text-2xl font-bold text-purple-600 transition hover:text-purple-700"
                            >
                                MJ SOCIAL
                            </Link>

                        </div>

                        {/* TITLE */}
                        <div className="mb-8">

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Welcome back
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Login to your MJ SOCIAL account
                            </p>

                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-5"
                        >

                            {/* EMAIL */}
                            <div className="flex flex-col gap-2">

                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Email
                                </label>

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                            </div>

                            {/* PASSWORD */}
                            <div className="flex flex-col gap-2">

                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full cursor-pointer rounded-xl bg-purple-600 py-3.5 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                            >
                                {loading
                                    ? "Logging in..."
                                    : "Login"}
                            </button>

                        </form>

                        {/* MESSAGE */}
                        {message && (
                            <div
                                className={`mt-5 rounded-xl px-4 py-3 text-center text-sm ${
                                    isSuccess
                                        ? "bg-green-50 text-green-700"
                                        : "bg-red-50 text-red-700"
                                }`}
                            >
                                {message}
                            </div>
                        )}

                        {/* REGISTER */}
                        <p className="mt-8 text-center text-sm text-gray-500">

                            Don't have an account?{" "}

                            <Link
                                href="/register"
                                className="font-medium text-purple-600 transition hover:text-purple-700 hover:underline"
                            >
                                Register
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
};

export default Login;