import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dashboardApi } from "../api/dashboardApi";
import { videoApi } from "../api/videoApi";
import MainLayout from "../components/layout/MainLayout";

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
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            <p className="text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl p-6">

        <h1 className="mb-6 text-2xl font-bold text-white">
          Dashboard
        </h1>

        {/* Stats Cards */}
        {stats && (
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-xl bg-[#272727] p-4 text-center">
              <p className="text-3xl font-bold text-white">{stats.totalVideos}</p>
              <p className="mt-1 text-sm text-gray-400">Videos</p>
            </div>
            <div className="rounded-xl bg-[#272727] p-4 text-center">
              <p className="text-3xl font-bold text-white">{stats.totalViews}</p>
              <p className="mt-1 text-sm text-gray-400">Total Views</p>
            </div>
            <div className="rounded-xl bg-[#272727] p-4 text-center">
              <p className="text-3xl font-bold text-white">{stats.totalSubscribers}</p>
              <p className="mt-1 text-sm text-gray-400">Subscribers</p>
            </div>
            <div className="rounded-xl bg-[#272727] p-4 text-center">
              <p className="text-3xl font-bold text-white">{stats.totalLikes}</p>
              <p className="mt-1 text-sm text-gray-400">Total Likes</p>
            </div>
          </div>
        )}

        {/* Videos */}
        <h2 className="mb-4 text-xl font-semibold text-white">
          Your Videos
        </h2>

        {videos.length === 0 ? (
          <p className="text-gray-500">No videos uploaded yet.</p>
        ) : (
          <div className="space-y-4">
            {videos.map((video) => (
              <div
                key={video._id}
                className="flex flex-wrap items-center gap-4 rounded-xl bg-[#272727] p-4"
              >
                {/* Thumbnail */}
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="h-20 w-32 rounded-lg object-cover"
                />

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-white">{video.title}</h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {video.views ?? 0} views •{" "}
                    {new Date(video.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
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
                    className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => navigate(`/videos/edit/${video._id}`)}
                    className="rounded bg-yellow-600 px-3 py-1 text-sm text-white hover:bg-yellow-700"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleTogglePublish(video._id, video.isPublished)}
                    className={`rounded px-3 py-1 text-sm text-white transition ${
                      video.isPublished
                        ? "bg-gray-600 hover:bg-gray-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {video.isPublished ? "Make Private" : "Publish"}
                  </button>

                  <button
                    onClick={() => handleDelete(video._id)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Dashboard;