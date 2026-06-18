import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { likeApi } from "../api/likeApi";
import MainLayout from "../components/layout/MainLayout";

const formatDuration = (seconds = 0) => {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const formatViews = (n = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
};

const LikedVideosSkeleton = () => (
  <div className="space-y-2">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex animate-pulse items-center gap-3 rounded-xl bg-[#1a1a1a] p-3">
        <div className="h-4 w-4 rounded bg-[#272727]" />
        <div className="h-16 w-28 flex-shrink-0 rounded-lg bg-[#272727]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 rounded bg-[#272727]" />
          <div className="h-3 w-1/3 rounded bg-[#272727]" />
        </div>
      </div>
    ))}
  </div>
);

const LikedVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unlikingId, setUnlikingId] = useState(null);

  useEffect(() => {
    const fetchLikedVideos = async () => {
      try {
        const res = await likeApi.getLikedVideos();
        setVideos(res.data.data);
      } catch (error) {
        console.error("LIKED VIDEOS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedVideos();
  }, []);

  const handleUnlike = async (likeId, videoId) => {
    setUnlikingId(likeId);
    try {
      await likeApi.toggleVideoLike(videoId);
      setVideos((prev) => prev.filter((item) => item._id !== likeId));
    } catch (error) {
      console.error("UNLIKE ERROR:", error);
    } finally {
      setUnlikingId(null);
    }
  };

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white">Liked videos</h1>
            {!loading && (
              <p className="mt-1 text-sm text-gray-400">
                {videos.length} video{videos.length !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {!loading && videos.length > 0 && (
            <span className="rounded-full bg-[#1a1a1a] px-3 py-1 text-xs text-gray-400">
              {videos.length} liked
            </span>
          )}
        </div>

        {/* Loading */}
        {loading && <LikedVideosSkeleton />}

        {/* Empty state */}
        {!loading && videos.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#1a1a1a] py-20 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#272727]">
              <svg className="h-7 w-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-white">No liked videos yet</p>
            <p className="mt-1 text-sm text-gray-400">Videos you like will appear here.</p>
            <Link
              to="/"
              className="mt-5 rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Browse Videos
            </Link>
          </div>
        )}

        {/* List */}
        {!loading && videos.length > 0 && (
          <div className="space-y-2">
            {videos.map((item, index) => (
              <div
                key={item._id}
                className={`flex items-center gap-3 rounded-xl bg-[#1a1a1a] p-3 transition hover:bg-[#222] ${
                  unlikingId === item._id ? "opacity-50" : ""
                }`}
              >
                {/* Index */}
                <span className="w-5 flex-shrink-0 text-center text-xs text-gray-600">
                  {index + 1}
                </span>

                {/* Thumbnail */}
                <Link to={`/videos/${item.video?._id}`} className="flex-shrink-0">
                  <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-[#272727]">
                    {item.video?.thumbnail ? (
                      <img
                        src={item.video.thumbnail}
                        alt={item.video.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-600">
                        <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    {item.video?.duration != null && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs text-white">
                        {formatDuration(item.video.duration)}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <Link to={`/videos/${item.video?._id}`}>
                    <h3 className="line-clamp-2 text-sm font-medium text-white transition-colors hover:text-red-400">
                      {item.video?.title}
                    </h3>
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-400">{item.video?.owner?.fullName}</p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {formatViews(item.video?.views ?? 0)} views
                  </p>
                </div>

                {/* Unlike button */}
                <button
                  onClick={() => handleUnlike(item._id, item.video?._id)}
                  disabled={unlikingId === item._id}
                  className="flex-shrink-0 rounded-lg border border-[#3a3a3a] px-3 py-1.5 text-xs text-gray-400 transition hover:border-red-500/50 hover:bg-red-600/10 hover:text-red-400 disabled:opacity-50"
                >
                  {unlikingId === item._id ? "Removing…" : "Unlike"}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default LikedVideos;
