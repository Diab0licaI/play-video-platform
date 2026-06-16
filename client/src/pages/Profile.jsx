import { useEffect, useState, useRef } from "react";
import { Camera, Lock, Save, X } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import {
  getCurrentUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
  changePassword,
} from "../api/profileAPI";

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

  if (loading) return (
    <MainLayout>
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 rounded-full border-2 border-gray-600 border-t-red-500 animate-spin" />
      </div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-[#0f0f0f] pb-12">

        {/* Toast */}
        {message && (
          <div className="fixed top-4 right-4 z-50 bg-[#272727] text-white px-4 py-3 rounded-lg text-sm shadow-lg">
            {message}
          </div>
        )}

        {/* Cover Image */}
        <div className="relative h-48 bg-[#1a1a1a] group cursor-pointer" onClick={() => coverRef.current.click()}>
          {user?.coverImage
            ? <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />
            : <div className="w-full h-full bg-gradient-to-r from-[#1a1a1a] to-[#272727]" />
          }
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm">
            <Camera size={18} /> Change cover
          </div>
          <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
        </div>

        <div className="max-w-3xl mx-auto px-6">

          {/* Avatar */}
          <div className="relative -mt-14 mb-4 w-fit">
            <div className="relative group cursor-pointer" onClick={() => avatarRef.current.click()}>
              {user?.avatar
                ? <img src={user.avatar} alt={user.fullName} className="w-24 h-24 rounded-full object-cover border-4 border-[#0f0f0f]" />
                : <div className="w-24 h-24 rounded-full bg-red-600 border-4 border-[#0f0f0f] flex items-center justify-center text-2xl font-bold text-white">{user?.fullName?.[0]?.toUpperCase()}</div>
              }
              <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          {/* Name & username */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-white">{user?.fullName}</h1>
            <p className="text-gray-400 text-sm">@{user?.username}</p>
          </div>

          {/* Profile Details Card */}
          <div className="bg-[#1a1a1a] rounded-xl p-6 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white font-medium">Account Details</h2>
              {!editMode
                ? <button onClick={() => setEditMode(true)} className="text-sm text-red-400 hover:text-red-300 transition-colors">Edit</button>
                : <div className="flex gap-3">
                    <button onClick={() => setEditMode(false)} className="text-sm text-gray-400 hover:text-gray-300 flex items-center gap-1"><X size={14} /> Cancel</button>
                    <button onClick={handleSaveDetails} disabled={saving} className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 disabled:opacity-50"><Save size={14} /> {saving ? "Saving..." : "Save"}</button>
                  </div>
              }
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Full Name</label>
                {editMode
                  ? <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full bg-[#272727] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500" />
                  : <p className="text-white text-sm">{user?.fullName}</p>
                }
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Email</label>
                {editMode
                  ? <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full bg-[#272727] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500" />
                  : <p className="text-white text-sm">{user?.email}</p>
                }
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Username</label>
                <p className="text-gray-400 text-sm">@{user?.username}</p>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-[#1a1a1a] rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-gray-400" />
                <h2 className="text-white font-medium">Password</h2>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                {showPasswordForm ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPasswordForm && (
              <div className="mt-4 space-y-3">
                <input
                  type="password"
                  placeholder="Current password"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
                  className="w-full bg-[#272727] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
                />
                <input
                  type="password"
                  placeholder="New password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full bg-[#272727] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full bg-[#272727] text-white rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-red-500"
                />
                <button
                  onClick={handleChangePassword}
                  disabled={saving}
                  className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg py-2 text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}