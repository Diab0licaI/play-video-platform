import { useEffect, useState, useRef } from "react";
import { Camera, Lock, Save, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import {
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  changePassword,
} from "../api/profileAPI";

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-[#0f0f0f] pb-12">
    <div className="h-48 animate-pulse bg-[#1a1a1a]" />
    <div className="mx-auto max-w-3xl px-6">
      <div className="-mt-14 mb-4 h-24 w-24 animate-pulse rounded-full border-4 border-[#0f0f0f] bg-[#272727]" />
      <div className="mb-6 space-y-2">
        <div className="h-6 w-48 animate-pulse rounded bg-[#1a1a1a]" />
        <div className="h-4 w-32 animate-pulse rounded bg-[#1a1a1a]" />
      </div>
      <div className="mb-4 h-48 animate-pulse rounded-xl bg-[#1a1a1a]" />
      <div className="h-32 animate-pulse rounded-xl bg-[#1a1a1a]" />
    </div>
  </div>
);

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({ fullName: "", email: "" });
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });

  const avatarRef = useRef();
  const coverRef = useRef();

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        const u = res.data.data;
        setUser(u);
        setForm({ fullName: u.fullName, email: u.email });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const showMsg = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleSaveDetails = async () => {
    setSaving(true);
    try {
      const res = await updateAccountDetails(form);
      setUser(res.data.data);
      setEditMode(false);
      showMsg("Profile updated successfully!");
    } catch (err) {
      showMsg(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await updateAvatar(file);
      setUser(res.data.data);
      showMsg("Avatar updated!");
    } catch {
      showMsg("Avatar upload failed");
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const res = await updateCoverImage(file);
      setUser(res.data.data);
      showMsg("Cover image updated!");
    } catch {
      showMsg("Cover upload failed");
    }
  };

  const handleChangePassword = async () => {
    if (passwords.newPassword !== passwords.confirmPassword) {
      showMsg("Passwords don't match");
      return;
    }
    setSaving(true);
    try {
      await changePassword({ oldPassword: passwords.oldPassword, newPassword: passwords.newPassword });
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
      setShowPasswordForm(false);
      showMsg("Password changed successfully!");
    } catch (err) {
      showMsg(err.response?.data?.message || "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <ProfileSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0f0f0f] pb-12">

        {/* Toast */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="fixed top-4 right-4 z-50 rounded-lg bg-[#272727] px-4 py-3 text-sm text-white shadow-lg"
            >
              {message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Cover Image */}
        <div
          className="group relative h-48 cursor-pointer bg-[#1a1a1a]"
          onClick={() => coverRef.current.click()}
        >
          {user?.coverImage ? (
            <img src={user.coverImage} alt="cover" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-[#1a1a1a] to-[#272727]" />
          )}
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Camera size={18} /> Change cover
          </div>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
        </div>

        <div className="mx-auto max-w-3xl px-4 sm:px-6">

          {/* Avatar */}
          <div className="relative -mt-14 mb-4 w-fit">
            <div
              className="group relative cursor-pointer"
              onClick={() => avatarRef.current.click()}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-24 w-24 rounded-full border-4 border-[#0f0f0f] object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#0f0f0f] bg-red-600 text-2xl font-bold text-white">
                  {user?.fullName?.[0]?.toUpperCase()}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Name & username */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">{user?.fullName}</h1>
            <p className="text-sm text-gray-400">@{user?.username}</p>
          </div>

          {/* Profile Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-4 rounded-xl bg-[#1a1a1a] p-6"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-medium text-white">Account Details</h2>
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="text-sm text-red-400 transition-colors hover:text-red-300"
                >
                  Edit
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-300"
                  >
                    <X size={14} /> Cancel
                  </button>
                  <button
                    onClick={handleSaveDetails}
                    disabled={saving}
                    className="flex items-center gap-1 text-sm text-green-400 hover:text-green-300 disabled:opacity-50"
                  >
                    <Save size={14} /> {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-gray-500">Full Name</label>
                {editMode ? (
                  <input
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    className="w-full rounded-lg bg-[#272727] px-3 py-2 text-sm text-white outline-none transition-colors focus:ring-1 focus:ring-red-500"
                  />
                ) : (
                  <p className="text-sm text-white">{user?.fullName}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Email</label>
                {editMode ? (
                  <input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg bg-[#272727] px-3 py-2 text-sm text-white outline-none transition-colors focus:ring-1 focus:ring-red-500"
                  />
                ) : (
                  <p className="text-sm text-white">{user?.email}</p>
                )}
              </div>
              <div>
                <label className="mb-1 block text-xs text-gray-500">Username</label>
                <p className="text-sm text-gray-400">@{user?.username}</p>
              </div>
            </div>
          </motion.div>

          {/* Change Password Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="rounded-xl bg-[#1a1a1a] p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-gray-400" />
                <h2 className="font-medium text-white">Password</h2>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-sm text-red-400 transition-colors hover:text-red-300"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>

            <AnimatePresence>
              {showPasswordForm && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-3">
                    <input
                      type="password"
                      placeholder="Current password"
                      value={passwords.oldPassword}
                      onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                      className="w-full rounded-lg bg-[#272727] px-3 py-2 text-sm text-white outline-none transition-colors focus:ring-1 focus:ring-red-500"
                    />
                    <input
                      type="password"
                      placeholder="New password"
                      value={passwords.newPassword}
                      onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                      className="w-full rounded-lg bg-[#272727] px-3 py-2 text-sm text-white outline-none transition-colors focus:ring-1 focus:ring-red-500"
                    />
                    <input
                      type="password"
                      placeholder="Confirm new password"
                      value={passwords.confirmPassword}
                      onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                      className="w-full rounded-lg bg-[#272727] px-3 py-2 text-sm text-white outline-none transition-colors focus:ring-1 focus:ring-red-500"
                    />
                    <button
                      onClick={handleChangePassword}
                      disabled={saving}
                      className="w-full rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                    >
                      {saving ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </MainLayout>
  );
}