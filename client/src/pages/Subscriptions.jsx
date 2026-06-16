import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { subscriptionApi } from "../api/subscriptionApi";
import MainLayout from "../components/layout/MainLayout";

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
              <Link
                key={video._id}
                to={`/videos/${video._id}`}
                className="group overflow-hidden rounded-xl bg-[#272727] transition hover:bg-[#3a3a3a]"
              >
                {/* Thumbnail */}
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="p-3">
                  {/* Channel */}
                  <div className="mb-2 flex items-center gap-2">
                    {video.owner?.avatar ? (
                      <img
                        src={video.owner.avatar}
                        alt={video.owner.fullName}
                        className="h-6 w-6 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-600 text-xs text-white">
                        {video.owner?.fullName?.[0]?.toUpperCase() ?? "U"}
                      </div>
                    )}
                    <span className="text-xs text-gray-400">
                      {video.owner?.fullName}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 font-medium text-white">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    {video.views ?? 0} views •{" "}
                    {new Date(video.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Subscriptions;