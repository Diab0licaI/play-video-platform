import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getWatchHistory,
  removeFromWatchHistory,
  clearWatchHistory,
} from "../api/watchHistoryAPI";
import { formatDistanceToNow } from "date-fns";
import { Clock, Trash2, X } from "lucide-react";
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

export default function WatchHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWatchHistory()
      .then((res) => {
      console.log("HISTORY RESPONSE:", res.data); // 👈 add this
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
      <div className="min-h-screen bg-[#0f0f0f] px-6 py-6 max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="text-red-500" size={22} />
            <h1 className="text-xl font-medium text-white">Watch history</h1>
          </div>
          {history.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 hover:bg-[#272727] px-3 py-2 rounded-lg transition-colors"
            >
              <Trash2 size={15} />
              Clear all history
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="h-8 w-8 rounded-full border-2 border-gray-600 border-t-red-500 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <Clock size={52} className="text-[#333]" />
            <p className="text-[#555] text-base">No watch history yet</p>
            <span className="text-[#444] text-sm">Videos you watch will appear here</span>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {Object.entries(groups).map(([label, items]) =>
              items.length === 0 ? null : (
                <div key={label}>
                  <p className="text-sm font-medium text-gray-500 px-1 mt-4 mb-2">{label}</p>
                  {items.map(({ video, updatedAt }) => (
                    <div key={video._id} className="group flex gap-3 p-2.5 rounded-xl hover:bg-[#1a1a1a] transition-colors relative">
                      <Link to={`/videos/${video._id}`} className="flex-shrink-0">
                        <div className="relative w-40 h-[90px] rounded-lg overflow-hidden bg-[#272727]">
                          <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <Link to={`/videos/${video._id}`}>
                          <h3 className="text-sm font-medium text-white line-clamp-2 leading-snug hover:text-red-400 transition-colors mb-1.5">{video.title}</h3>
                        </Link>
                        <Link to={`/channel/${video.owner?.username}`}>
                          <p className="text-xs text-gray-400 hover:text-gray-300 mb-1">{video.owner?.fullName || video.owner?.username}</p>
                        </Link>
                        <p className="text-xs text-[#717171]">
                          {video.views} views · {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(video._id)}
                        className="opacity-0 group-hover:opacity-100 absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-[#272727] hover:bg-[#3a3a3a] text-gray-400 hover:text-white transition-all"
                        title="Remove from history"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}