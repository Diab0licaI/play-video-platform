import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { likeApi } from "../api/likeApi";
import MainLayout from "../components/layout/MainLayout";

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await likeApi.getLikedVideos();
        console.log("LIKED VIDEOS RESPONSE:", res.data.data);
        setVideos(res.data.data);
      } catch (error) {
        console.error("LIKED VIDEOS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikedVideos();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            <p className="text-gray-400">Loading liked videos...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl p-6">

        <h1 className="mb-6 text-2xl font-bold text-white">
          👍 Liked Videos
        </h1>

        {videos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-6xl">👍</p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              No liked videos yet
            </h2>
            <p className="mt-2 text-gray-400">
              Videos you like will appear here.
            </p>
            <Link
              to="/"
              className="mt-6 rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
              Browse Videos
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((item, index) => (
              <Link
                key={item._id}
                to={`/videos/${item.video?._id}`}
                className="flex items-center gap-4 rounded-xl bg-[#272727] p-3 hover:bg-[#3a3a3a] transition"
              >
                {/* Index */}
                <span className="w-6 shrink-0 text-center text-sm text-gray-500">
                  {index + 1}
                </span>

                {/* Thumbnail */}
                <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
                  <img
                    src={item.video?.thumbnail}
                    alt={item.video?.title}
                    className="h-full w-full object-cover"
                  />
                  {item.video?.duration && (
                    <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs text-white">
                      {Math.floor(item.video.duration / 60)}:
                      {String(Math.floor(item.video.duration % 60)).padStart(2, "0")}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 overflow-hidden">
                  <h3 className="line-clamp-1 text-sm font-medium text-white">
                    {item.video?.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {item.video?.owner?.fullName}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {item.video?.views ?? 0} views
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

export default LikedVideos;