import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("avatar", data.avatar[0]);
      if (data.coverImage?.[0]) formData.append("coverImage", data.coverImage[0]);
      await registerUser(formData);
      toast.success("Account created!");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center px-4 py-8">
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
          <h1 className="text-white text-2xl font-semibold mb-1">Create account</h1>
          <p className="text-gray-400 text-sm mb-6">Join and start watching</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Full Name</label>
                <input
                  placeholder="John Doe"
                  className="w-full bg-[#272727] text-white rounded-lg px-3 py-2.5 text-sm outline-none border border-transparent focus:border-red-500 transition-colors placeholder-gray-600"
                  {...register("fullName", { required: true })}
                />
                {errors.fullName && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Username</label>
                <input
                  placeholder="johndoe"
                  className="w-full bg-[#272727] text-white rounded-lg px-3 py-2.5 text-sm outline-none border border-transparent focus:border-red-500 transition-colors placeholder-gray-600"
                  {...register("username", { required: true })}
                />
                {errors.username && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-[#272727] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-transparent focus:border-red-500 transition-colors placeholder-gray-600"
                {...register("email", { required: true })}
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[#272727] text-white rounded-lg px-4 py-2.5 text-sm outline-none border border-transparent focus:border-red-500 transition-colors placeholder-gray-600"
                {...register("password", { required: true })}
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">Required</p>}
            </div>

            {/* File uploads */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Avatar <span className="text-red-400">*</span></label>
                <label className="flex items-center justify-center gap-2 w-full bg-[#272727] hover:bg-[#323232] text-gray-400 hover:text-white rounded-lg px-3 py-2.5 text-xs cursor-pointer transition-colors border border-transparent hover:border-red-500">
                  📷 Choose file
                  <input type="file" accept="image/*" className="hidden" {...register("avatar", { required: true })} />
                </label>
                {errors.avatar && <p className="text-red-400 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Cover Image</label>
                <label className="flex items-center justify-center gap-2 w-full bg-[#272727] hover:bg-[#323232] text-gray-400 hover:text-white rounded-lg px-3 py-2.5 text-xs cursor-pointer transition-colors border border-transparent hover:border-red-500">
                  🖼️ Choose file
                  <input type="file" accept="image/*" className="hidden" {...register("coverImage")} />
                </label>
              </div>
            </div>

            <button
              disabled={isSubmitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg transition-colors mt-2"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </button>

          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-red-400 hover:text-red-300 transition-colors">
            Sign in
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Signup;