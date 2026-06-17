import { useEffect, useState } from "react";
import { Bell, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";
import { notificationApi } from "../api/notificationAPI";

const typeMessage = (n) => {
  const name = n.sender?.fullName || n.sender?.username || "Someone";
  switch (n.type) {
    case "SUBSCRIBE":     return <><span className="font-medium text-white">{name}</span> subscribed to your channel</>;
    case "VIDEO_LIKE":    return <><span className="font-medium text-white">{name}</span> liked your video</>;
    case "VIDEO_COMMENT": return <><span className="font-medium text-white">{name}</span> commented on your video</>;
    default:              return <><span className="font-medium text-white">{name}</span> interacted with you</>;
  }
};

const typeIcon = (type) => {
  switch (type) {
    case "SUBSCRIBE":     return "👤";
    case "VIDEO_LIKE":    return "👍";
    case "VIDEO_COMMENT": return "💬";
    default:              return "🔔";
  }
};

const NotificationSkeleton = () => (
  <div className="flex items-start gap-3 rounded-xl p-3">
    <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[#1a1a1a]" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 w-3/4 animate-pulse rounded bg-[#1a1a1a]" />
      <div className="h-3 w-1/4 animate-pulse rounded bg-[#1a1a1a]" />
    </div>
  </div>
);

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    notificationApi.getAll()
      .then((res) => setNotifications(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleMarkRead = async (id) => {
    await notificationApi.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    const unread = notifications.filter((n) => !n.isRead);
    await Promise.all(unread.map((n) => notificationApi.markAsRead(n._id)));
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="text-red-500" size={22} />
            <h1 className="text-xl font-medium text-white">Notifications</h1>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white"
              >
                {unreadCount}
              </motion.span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1 text-sm text-gray-400 transition-colors hover:text-white"
            >
              <Check size={15} />
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-gray-600">
            <Bell size={48} className="text-[#333]" />
            <p className="text-base text-[#555]">No notifications yet</p>
            <span className="text-sm text-[#444]">Activity will appear here</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <AnimatePresence initial={false}>
              {notifications.map((n, index) => (
                <motion.div
                  key={n._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.15) }}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl p-3 transition-colors ${
                    n.isRead ? "bg-transparent hover:bg-[#1a1a1a]" : "bg-[#1a1a1a] hover:bg-[#222]"
                  }`}
                >
                  {/* Sender avatar */}
                  <div className="relative shrink-0">
                    {n.sender?.avatar ? (
                      <img
                        src={n.sender.avatar}
                        alt={n.sender.fullName}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#272727] font-medium text-white">
                        {n.sender?.fullName?.[0]?.toUpperCase() ?? "?"}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 text-sm">{typeIcon(n.type)}</span>
                  </div>

                  {/* Message */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug text-gray-300">{typeMessage(n)}</p>
                    <p className="mt-1 text-xs text-gray-600">
                      {new Date(n.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  {/* Unread dot */}
                  {!n.isRead && (
                    <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </MainLayout>
  );
}