import { Link } from "react-router-dom";
import { subscriptionApi } from "../api/subscriptionApi";
import MainLayout from "../components/layout/MainLayout";
import VideoCard from "../components/video/VideoCard";
import { useEffect, useState } from "react";

const Subscriptions = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await subscriptionApi.getFeed();
        setVideos(res.data.data);
      } catch (error) {
        console.error("FEED ERROR:", error);
        setError("Failed to load subscription feed.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            <p className="text-gray-400">Loading feed...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-400">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl p-6">

        <h1 className="mb-6 text-2xl font-bold text-white">
          Subscriptions
        </h1>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-6xl">📺</p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              No videos yet
            </h2>
            <p className="mt-2 text-gray-400">
              Subscribe to channels to see their videos here.
            </p>
            <Link
              to="/"
              className="mt-6 rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
              Explore Videos
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Subscriptions;