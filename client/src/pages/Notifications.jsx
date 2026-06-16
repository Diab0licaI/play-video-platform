import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Check } from "lucide-react";
import MainLayout from "../components/layout/MainLayout";
import { notificationApi } from "../api/notificationAPI";

const typeMessage = (n) => {
  const name = n.sender?.fullName || n.sender?.username || "Someone";
  switch (n.type) {
    case "SUBSCRIBE":     return <><span className="text-white font-medium">{name}</span> subscribed to your channel</>;
    case "VIDEO_LIKE":    return <><span className="text-white font-medium">{name}</span> liked your video</>;
    case "VIDEO_COMMENT": return <><span className="text-white font-medium">{name}</span> commented on your video</>;
    default:              return <><span className="text-white font-medium">{name}</span> interacted with you</>;
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
      prev.map((n) => n._id === id ? { ...n, isRead: true } : n)
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
      <div className="max-w-2xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Bell className="text-red-500" size={22} />
            <h1 className="text-xl font-medium text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors">
              <Check size={15} />
              Mark all read
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-gray-600 border-t-red-500 animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-24 gap-3 text-gray-600">
            <Bell size={48} className="text-[#333]" />
            <p className="text-base text-[#555]">No notifications yet</p>
            <span className="text-sm text-[#444]">Activity will appear here</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && handleMarkRead(n._id)}
                className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors ${n.isRead ? "bg-transparent hover:bg-[#1a1a1a]" : "bg-[#1a1a1a] hover:bg-[#222]"}`}
              >
                {/* Sender avatar */}
                <div className="relative shrink-0">
                  {n.sender?.avatar ? (
                    <img src={n.sender.avatar} alt={n.sender.fullName} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-[#272727] flex items-center justify-center text-white font-medium">
                      {n.sender?.fullName?.[0]?.toUpperCase() ?? "?"}
                    </div>
                  )}
                  <span className="absolute -bottom-1 -right-1 text-sm">{typeIcon(n.type)}</span>
                </div>

                {/* Message */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 leading-snug">{typeMessage(n)}</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(n.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>

                {/* Unread dot */}
                {!n.isRead && (
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-red-500 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}