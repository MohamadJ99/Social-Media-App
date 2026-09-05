"use client";

import Link from "next/link";
import { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
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
    setIsSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      console.log("Response:", data);

      if (!response.ok) {
        if (data.errors) {
          const errors = Object.values(data.errors).flat();

          setMessage(errors.join(" "));
        } else {
          setMessage(data.message || "Registration failed");
        }

        return;
      }

      // Success
      setIsSuccess(true);
      setMessage("Registration successful!");

      // Clear form
      setForm({
        name: "",
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
      setMessage("Something went wrong. Please try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8 sm:px-6">

      <div className="w-full max-w-md sm:max-w-lg bg-white rounded-xl shadow-md p-5 sm:p-8">

        {/* LOGO */}
        <div className="flex justify-center mb-5 sm:mb-6">
          <Link
            href="/"
            className="font-bold text-xl sm:text-2xl text-blue-500"
          >
            MJ SOCIAL
          </Link>
        </div>

        {/* TITLE */}
        <div className="text-center mb-5 sm:mb-6">

          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800">
            Create an account
          </h1>

          <p className="text-xs sm:text-sm text-gray-400 mt-2">
            Join MJ SOCIAL and connect with your friends
          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:gap-4"
        >

          {/* NAME */}
          <div className="flex flex-col gap-2">

            <label className="text-xs sm:text-sm font-medium text-gray-600">
              Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-2">

            <label className="text-xs sm:text-sm font-medium text-gray-600">
              Email
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-2">

            <label className="text-xs sm:text-sm font-medium text-gray-600">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

          {/* CONFIRM PASSWORD */}
          <div className="flex flex-col gap-2">

            <label className="text-xs sm:text-sm font-medium text-gray-600">
              Confirm Password
            </label>

            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirm your password"
              value={form.password_confirmation}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-100 px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 sm:mt-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed text-white font-medium py-2.5 sm:py-3 rounded-lg transition cursor-pointer"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

        </form>

        {/* MESSAGE */}
        {message && (
          <div
            className={`mt-4 rounded-lg px-3 sm:px-4 py-3 text-xs sm:text-sm text-center ${isSuccess
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
              }`}
          >
            {message}
          </div>
        )}

        {/* LOGIN */}
        <div className="text-center text-xs sm:text-sm text-gray-500 mt-5 sm:mt-6">

          Already have an account?{" "}

          <Link
            href="/login"
            className="text-blue-500 font-medium hover:underline"
          >
            Login
          </Link>

        </div>

      </div>

    </div>
  );
};

export default Register;