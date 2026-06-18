import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Camera, ImagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
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

  const handlePreview = (e, setPreview) => {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const avatarReg = register("avatar", { required: true });
  const coverReg = register("coverImage");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-md"
      >

        {/* Logo */}
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-600 shadow-lg shadow-red-600/30">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
           </svg>
           </div>
         <span className="text-2xl font-bold tracking-tight text-white">Play</span>
         </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-[#1a1a1a] p-8">
          <h1 className="mb-1 text-2xl font-semibold text-white">Create account</h1>
          <p className="mb-6 text-sm text-gray-400">Join and start watching</p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs text-gray-400">Full Name</label>
                <input
                  placeholder="John Doe"
                  className="w-full rounded-lg border border-transparent bg-[#272727] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-red-500"
                  {...register("fullName", { required: true })}
                />
                {errors.fullName && <p className="mt-1 text-xs text-red-400">Required</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-gray-400">Username</label>
                <input
                  placeholder="johndoe"
                  className="w-full rounded-lg border border-transparent bg-[#272727] px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-red-500"
                  {...register("username", { required: true })}
                />
                {errors.username && <p className="mt-1 text-xs text-red-400">Required</p>}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-gray-400">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-transparent bg-[#272727] px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-red-500"
                {...register("email", { required: true })}
              />
              {errors.email && <p className="mt-1 text-xs text-red-400">Required</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-xs text-gray-400">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-transparent bg-[#272727] px-4 py-2.5 pr-10 text-sm text-white placeholder-gray-600 outline-none transition-colors focus:border-red-500"
                  {...register("password", { required: true })}
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
              {errors.password && <p className="mt-1 text-xs text-red-400">Required</p>}
            </div>

            {/* File uploads with preview */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs text-gray-400">
                  Avatar <span className="text-red-400">*</span>
                </label>
                <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-transparent bg-[#272727] text-xs text-gray-400 transition-colors hover:border-red-500 hover:bg-[#323232] hover:text-white">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar preview" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <Camera size={18} />
                      Choose file
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...avatarReg}
                    onChange={(e) => {
                      avatarReg.onChange(e);
                      handlePreview(e, setAvatarPreview);
                    }}
                  />
                </label>
                {errors.avatar && <p className="mt-1 text-xs text-red-400">Required</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-xs text-gray-400">Cover Image</label>
                <label className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-1 overflow-hidden rounded-lg border border-transparent bg-[#272727] text-xs text-gray-400 transition-colors hover:border-red-500 hover:bg-[#323232] hover:text-white">
                  {coverPreview ? (
                    <img src={coverPreview} alt="cover preview" className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus size={18} />
                      Choose file
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    {...coverReg}
                    onChange={(e) => {
                      coverReg.onChange(e);
                      handlePreview(e, setCoverPreview);
                    }}
                  />
                </label>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="mt-2 w-full rounded-lg bg-red-600 py-2.5 font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "Create account"}
            </motion.button>

          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link to="/login" className="text-red-400 transition-colors hover:text-red-300">
            Sign in
          </Link>
        </p>

      </motion.div>
    </div>
  );
};

export default Signup;