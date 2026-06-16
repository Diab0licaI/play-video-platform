import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await login(data);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-red-600 rounded-lg px-2 py-1">
            <span className="text-white font-bold text-lg">▶</span>
          </div>
          <span className="text-white text-xl font-semibold">Play</span>
        </div>

        {/* Card */}
        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-white/10">
          <h1 className="text-white text-2xl font-semibold mb-1">Welcome back</h1>
          <p className="text-gray-400 text-sm mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#272727] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-transparent focus:border-red-500 transition-colors placeholder-gray-600"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#272727] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-transparent focus:border-red-500 transition-colors placeholder-gray-600"
                {...register("password", { required: "Password is required" })}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-400 hover:text-red-300 transition-colors">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;