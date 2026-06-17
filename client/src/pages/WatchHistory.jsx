import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWatchHistory,
  removeFromWatchHistory,
  clearWatchHistory,
} from "../api/watchHistoryAPI";
import { formatDistanceToNow } from "date-fns";
import { Clock, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../components/layout/MainLayout";

const groupByDate = (items) => {
  const today = [], yesterday = [], older = [];
  const now = new Date();
  items.forEach((h) => {
    const diff = (now - new Date(h.updatedAt)) / (1000 * 60 * 60);
    if (diff < 24) today.push(h);
    else if (diff < 48) yesterday.push(h);
    else older.push(h);
  });
  return { Today: today, Yesterday: yesterday, "This week": older };
};

const HistoryRowSkeleton = () => (
  <div className="flex gap-3 p-2.5">
    <div className="h-[90px] w-40 shrink-0 animate-pulse rounded-lg bg-[#1a1a1a]" />
    <div className="flex-1 space-y-2 pt-1">
      <div className="h-3.5 w-5/6 animate-pulse rounded bg-[#1a1a1a]" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-[#1a1a1a]" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-[#1a1a1a]" />
    </div>
  </div>
);

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchHistory()
      .then((res) => {
        const data = res.data.data;
        setHistory(Array.isArray(data) ? data : data.history || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (videoId) => {
    await removeFromWatchHistory(videoId);
    setHistory((prev) => prev.filter((h) => h.video._id !== videoId));
  };

  const handleClearAll = async () => {
    if (!confirm("Clear your entire watch history?")) return;
    await clearWatchHistory();
    setHistory([]);
  };

  const groups = groupByDate(history);

  return (
    <MainLayout>
      <div className="mx-auto min-h-screen max-w-4xl bg-[#0f0f0f] px-4 py-6 sm:px-6">

        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Clock className="text-red-500" size={22} />
            <h1 className="text-xl font-medium text-white">Watch history</h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-400 transition-colors hover:bg-[#272727] hover:text-red-500"
            >
              <Trash2 size={15} />
              Clear all history
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-1">
            {Array.from({ length: 4 }).map((_, i) => (
              <HistoryRowSkeleton key={i} />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-32">
            <Clock size={52} className="text-[#333]" />
            <p className="text-base text-[#555]">No watch history yet</p>
            <span className="text-sm text-[#444]">Videos you watch will appear here</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {Object.entries(groups).map(([label, items]) =>
              items.length === 0 ? null : (
                <div key={label}>
                  <p className="mb-2 mt-4 px-1 text-sm font-medium text-gray-500">{label}</p>
                  <AnimatePresence initial={false}>
                    {items.map(({ video, updatedAt }, index) => (
                      <motion.div
                        key={video._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, delay: Math.min(index * 0.03, 0.2) }}
                        className="group relative flex gap-3 rounded-xl p-2.5 transition-colors hover:bg-[#1a1a1a]"
                      >
                        <Link to={`/videos/${video._id}`} className="flex-shrink-0">
                          <div className="relative h-[90px] w-40 overflow-hidden rounded-lg bg-[#272727]">
                            <img
                              src={video.thumbnail}
                              alt={video.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>
                        </Link>
                        <div className="min-w-0 flex-1 pt-0.5">
                          <Link to={`/videos/${video._id}`}>
                            <h3 className="mb-1.5 line-clamp-2 text-sm font-medium leading-snug text-white transition-colors hover:text-red-400">
                              {video.title}
                            </h3>
                          </Link>
                          <Link to={`/channel/${video.owner?.username}`}>
                            <p className="mb-1 text-xs text-gray-400 hover:text-gray-300">
                              {video.owner?.fullName || video.owner?.username}
                            </p>
                          </Link>
                          <p className="text-xs text-[#717171]">
                            {video.views} views · {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemove(video._id)}
                          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#272727] text-gray-400 opacity-0 transition-all hover:bg-[#3a3a3a] hover:text-white group-hover:opacity-100"
                          title="Remove from history"
                        >
                          <X size={15} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}