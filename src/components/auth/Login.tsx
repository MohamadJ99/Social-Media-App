"use client";

import { useState } from "react";
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
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
                setMessage(data.message || "Login failed");
                return;
            }

            login(data.token, data.user);
            console.log(data);

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
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

                {/* LOGO */}
                <div className="flex justify-center mb-6">
                    <Link
                        href="/"
                        className="font-bold text-2xl text-blue-500"
                    >
                        MJ SOCIAL
                    </Link>
                </div>

                {/* TITLE */}
                <div className="text-center mb-6">

                    <h1 className="text-2xl font-semibold text-gray-800">
                        Welcome back
                    </h1>

                    <p className="text-sm text-gray-400 mt-2">
                        Login to your MJ SOCIAL account
                    </p>

                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4"
                >

                    {/* EMAIL */}
                    <div className="flex flex-col gap-2">

                        <label className="text-sm font-medium text-gray-600">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                        />

                    </div>

                    {/* PASSWORD */}
                    <div className="flex flex-col gap-2">

                        <label className="text-sm font-medium text-gray-600">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-lg bg-slate-100 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                        />

                    </div>

                    {/* BUTTON */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg transition cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* MESSAGE */}
                {message && (
                    <div
                        className={`mt-4 rounded-lg px-4 py-3 text-sm text-center ${isSuccess
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                    >
                        {message}
                    </div>
                )}

                {/* REGISTER */}
                <div className="text-center text-sm text-gray-500 mt-6">

                    Dont have an account?{" "}

                    <Link
                        href="/register"
                        className="text-blue-500 font-medium hover:underline"
                    >
                        Register
                    </Link>

                </div>

            </div>

        </div>
    );
};

export default Login;