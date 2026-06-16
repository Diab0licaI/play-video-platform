import { MagnifyingGlassIcon, BellIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { notificationApi } from "../../api/notificationAPI";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    notificationApi.getAll()
      .then((res) => {
        const unread = res.data.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      })
      .catch(() => {});
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#0f0f0f] px-4 md:px-6">

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-600">
          <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-base font-bold text-white tracking-tight">Play</span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="mx-6 hidden w-full max-w-xl md:flex">
        <div className="flex w-full overflow-hidden rounded-full border border-white/15 bg-[#121212]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent px-5 py-2 text-sm text-white placeholder-gray-500 outline-none"
          />
          <button type="submit" className="flex items-center justify-center border-l border-white/15 bg-[#1e1e1e] px-4 hover:bg-[#2a2a2a] transition-colors">
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </form>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        {user ? (
          <>
            <Link to="/upload" className="hidden rounded-full bg-[#272727] px-4 py-1.5 text-sm text-white hover:bg-[#3a3a3a] transition-colors md:block">
              + Upload
            </Link>

            {/* 🔔 Bell */}
            <Link to="/notifications" className="relative p-2 rounded-full hover:bg-white/10 transition-colors">
              <BellIcon className="h-5 w-5 text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 flex items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>

            <button onClick={logout} className="hidden rounded-full border border-white/20 px-4 py-1.5 text-sm text-white hover:bg-white/10 transition-colors md:block">
              Logout
            </button>
            <Link to={`/channel/${user.username}`}>
              {user.avatar ? (
                <img src={user.avatar} alt={user.fullName} className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                  {user.fullName?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white hover:bg-white/10 transition-colors">
              Log in
            </Link>
            <Link to="/signup" className="rounded-full bg-red-600 px-4 py-1.5 text-sm text-white hover:bg-red-700 transition-colors font-medium">
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;