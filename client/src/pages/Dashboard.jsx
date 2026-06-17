import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Video, Eye, Users, ThumbsUp } from "lucide-react";
import { dashboardApi } from "../api/dashboardApi";
import { videoApi } from "../api/videoApi";
import MainLayout from "../components/layout/MainLayout";

const formatNumber = (num = 0) => {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toLocaleString();
};

const StatCard = ({ icon: Icon, label, value, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay: index * 0.05 }}
    className="rounded-xl bg-[#1a1a1a] p-5 transition-colors hover:bg-[#202020]"
  >
    <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/10 text-red-500">
      <Icon size={18} />
    </div>
    <p className="text-2xl font-bold text-white sm:text-3xl">{formatNumber(value)}</p>
    <p className="mt-1 text-sm text-gray-400">{label}</p>
  </motion.div>
);

const DashboardSkeleton = () => (
  <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
    <div className="mb-8 h-8 w-40 animate-pulse rounded bg-[#1a1a1a]" />
    <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-[#1a1a1a]" />
      ))}
    </div>
    <div className="space-y-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-xl bg-[#1a1a1a]" />
      ))}
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [statsRes, videosRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getVideos(),
        ]);
        setStats(statsRes.data.data);
        setVideos(videosRes.data.data);
      } catch (error) {
        console.error("DASHBOARD ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleDelete = async (videoId) => {
    const confirmDelete = window.confirm("Delete this video?");
    if (!confirmDelete) return;

    try {
      await videoApi.deleteVideo(videoId);
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (error) {
      console.log("DELETE ERROR:", error);
    }
  };

  const handleTogglePublish = async (videoId, currentStatus) => {
    try {
      await videoApi.togglePublishStatus(videoId);
      setVideos((prev) =>
        prev.map((v) =>
          v._id === videoId ? { ...v, isPublished: !currentStatus } : v
        )
      );
    } catch (error) {
      console.log("TOGGLE ERROR:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <DashboardSkeleton />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

        <h1 className="mb-6 text-2xl font-bold text-white">Dashboard</h1>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <StatCard icon={Video} label="Videos" value={stats.totalVideos} index={0} />
            <StatCard icon={Eye} label="Total Views" value={stats.totalViews} index={1} />
            <StatCard icon={Users} label="Subscribers" value={stats.totalSubscribers} index={2} />
            <StatCard icon={ThumbsUp} label="Total Likes" value={stats.totalLikes} index={3} />
          </div>
        )}

        {/* Videos */}
        <h2 className="mb-4 text-xl font-semibold text-white">Your Videos</h2>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#1a1a1a] py-16 text-center">
            <p className="text-5xl">🎬</p>
            <p className="mt-4 text-gray-400">No videos uploaded yet.</p>
            <Link
              to="/upload"
              className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              Upload your first video
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((video, index) => (
              <motion.div
                key={video._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.04, 0.4) }}
                className="flex flex-wrap items-center gap-4 rounded-xl bg-[#1a1a1a] p-4 transition-colors hover:bg-[#202020]"
              >
                {/* Thumbnail */}
                <div className="h-20 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-[#272727]">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-white">{video.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {formatNumber(video.views)} views •{" "}
                    {video.createdAt && !isNaN(new Date(video.createdAt))
                      ? new Date(video.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "Date unknown"}
                  </p>
                  <span
                    className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs ${
                      video.isPublished
                        ? "bg-green-900 text-green-400"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {video.isPublished ? "Published ✅" : "Private ❌"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Link
                    to={`/videos/${video._id}`}
                    className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => navigate(`/videos/edit/${video._id}`)}
                    className="rounded-md bg-yellow-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-yellow-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleTogglePublish(video._id, video.isPublished)}
                    className={`rounded-md px-3 py-1.5 text-sm text-white transition-colors ${
                      video.isPublished
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {video.isPublished ? "Make Private" : "Publish"}
                  </button>

                  <button
                    onClick={() => handleDelete(video._id)}
                    className="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>

              </motion.div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Dashboard;