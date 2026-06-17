import { MagnifyingGlassIcon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { notificationApi } from "../../api/notificationAPI";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

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
    setMobileSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-white/10 bg-[#0f0f0f] px-4 md:px-6">

      {/* Logo — hidden while mobile search is open to give input room */}
      <Link
        to="/"
        className={`flex shrink-0 items-center gap-2 transition-opacity ${mobileSearchOpen ? "opacity-0 md:opacity-100 pointer-events-none md:pointer-events-auto absolute md:relative" : ""}`}
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-red-600 transition-transform hover:scale-105">
          <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <span className="text-base font-bold tracking-tight text-white">Play</span>
      </Link>

      {/* Desktop Search */}
      <form onSubmit={handleSearch} className="mx-6 hidden w-full max-w-xl md:flex">
        <div className="flex w-full overflow-hidden rounded-full border border-white/15 bg-[#121212] transition-colors focus-within:border-white/30">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent px-5 py-2 text-sm text-white placeholder-gray-500 outline-none"
          />
          <button
            type="submit"
            className="flex items-center justify-center border-l border-white/15 bg-[#1e1e1e] px-4 transition-colors hover:bg-[#2a2a2a]"
          >
            <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </form>

      {/* Mobile Search (expands in place of logo) */}
      <AnimatePresence>
        {mobileSearchOpen && (
          <motion.form
            initial={{ opacity: 0, width: "60%" }}
            animate={{ opacity: 1, width: "100%" }}
            exit={{ opacity: 0, width: "60%" }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSearch}
            className="flex flex-1 items-center gap-2 md:hidden"
          >
            <div className="flex w-full overflow-hidden rounded-full border border-white/15 bg-[#121212]">
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="w-full bg-transparent px-4 py-2 text-sm text-white placeholder-gray-500 outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => setMobileSearchOpen(false)}
              className="shrink-0 rounded-full p-2 text-gray-400 hover:bg-white/10 hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      {/* Right */}
      <div className={`flex shrink-0 items-center gap-2 ${mobileSearchOpen ? "hidden md:flex" : ""}`}>

        {/* Mobile search trigger */}
        <button
          onClick={() => setMobileSearchOpen(true)}
          className="rounded-full p-2 text-gray-300 transition-colors hover:bg-white/10 md:hidden"
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </button>

        {user ? (
          <>
            <Link
              to="/upload"
              className="hidden rounded-full bg-[#272727] px-4 py-1.5 text-sm text-white transition-colors hover:bg-[#3a3a3a] md:block"
            >
              + Upload
            </Link>

            {/* Bell */}
            <Link to="/notifications" className="relative rounded-full p-2 transition-colors hover:bg-white/10">
              <BellIcon className="h-5 w-5 text-gray-300" />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </motion.span>
              )}
            </Link>

            <button
              onClick={logout}
              className="hidden rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/10 md:block"
            >
              Logout
            </button>
            <Link to={`/channel/${user.username}`} className="transition-opacity hover:opacity-80">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-white/10"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
                  {user.fullName?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </Link>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white transition-colors hover:bg-white/10"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="rounded-full bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Sign up
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;