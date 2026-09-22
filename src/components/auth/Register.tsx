"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        password_confirmation: "",
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
        setIsSuccess(false);
        setLoading(true);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/register`,
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
                if (data.errors) {
                    const errors = Object.values(
                        data.errors
                    ).flat();

                    setMessage(errors.join(" "));
                } else {
                    setMessage(
                        data.message ||
                        "Registration failed"
                    );
                }

                return;
            }

            // Success
            setIsSuccess(true);
            setMessage("Registration successful!");

            // Clear form
            setForm({
                name: "",
                username: "",
                email: "",
                password: "",
                password_confirmation: "",
            });

            setTimeout(() => {
                setMessage("");
                setIsSuccess(false);
            }, 3000);

        } catch (error) {
            console.error(error);

            setIsSuccess(false);
            setMessage(
                "Something went wrong. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-slide-left min-h-screen bg-white p-4 sm:p-6 lg:p-8">

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
                        <div className="mb-7">

                            <Link
                                href="/"
                                className="text-2xl font-bold text-purple-600 transition hover:text-purple-700"
                            >
                                MJ SOCIAL
                            </Link>

                        </div>

                        {/* TITLE */}
                        <div className="mb-7">

                            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                                Create an account
                            </h1>

                            <p className="mt-2 text-sm text-gray-500">
                                Join MJ SOCIAL and connect with your friends
                            </p>

                        </div>

                        {/* FORM */}
                        <form
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >

                            {/* NAME */}
                            <div className="flex flex-col gap-2">

                                <label
                                    htmlFor="name"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Name
                                </label>

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                            </div>

                            {/* USERNAME */}
                            <div className="flex flex-col gap-2">

                                <label
                                    htmlFor="username"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Username
                                </label>

                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    placeholder="Enter your username"
                                    value={form.username}
                                    onChange={handleChange}
                                    autoComplete="username"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                            </div>

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
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
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
                                    autoComplete="new-password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div className="flex flex-col gap-2">

                                <label
                                    htmlFor="password_confirmation"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Confirm Password
                                </label>

                                <input
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    placeholder="Confirm your password"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-purple-400 focus:bg-white focus:ring-2 focus:ring-purple-100"
                                />

                            </div>

                            {/* REGISTER BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="mt-2 w-full cursor-pointer rounded-xl bg-purple-600 py-3.5 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                            >
                                {loading
                                    ? "Creating account..."
                                    : "Register"}
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

                        {/* LOGIN */}
                        <p className="mt-7 text-center text-sm text-gray-500">

                            Already have an account?{" "}

                            <Link
                                href="/login"
                                className="font-medium text-purple-600 transition hover:text-purple-700 hover:underline"
                            >
                                Login
                            </Link>

                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
};

export default Register;