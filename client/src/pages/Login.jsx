import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >

        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-2">
          <div className="rounded-lg bg-red-600 px-2 py-1">
            <span className="text-lg font-bold text-white">▶</span>
          </div>
          <span className="text-xl font-semibold text-white">Play</span>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-8">
          <h1 className="mb-1 text-2xl font-semibold text-white">Welcome back</h1>
          <p className="mb-6 text-sm text-gray-400">Sign in to your account</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <div>
              <label className="mb-1.5 block text-xs text-gray-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-transparent bg-[#272727] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-red-500"
                {...register("email", { required: "Email is required" })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-transparent bg-[#272727] px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-red-500"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors hover:text-gray-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-red-600 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </motion.button>

          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link to="/signup" className="text-red-400 transition-colors hover:text-red-300">
            Sign up
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Login;