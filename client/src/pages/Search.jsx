import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { videoApi } from "../api/videoApi";
import MainLayout from "../components/layout/MainLayout";

const formatViews = (n = 0) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K views`;
  return `${n} views`;
};

const formatDuration = (seconds = 0) => {
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days < 1) return "Today";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

const VideoCard = ({ video }) => (
  <Link
    to={`/videos/${video._id}`}
    className="group flex flex-col overflow-hidden rounded-xl bg-[#1a1a1a] transition-colors duration-200 hover:bg-[#222]"
  >
    {/* Thumbnail */}
    <div className="relative aspect-video w-full overflow-hidden bg-[#272727]">
      {video.thumbnail ? (
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <svg className="h-10 w-10 text-[#444]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      {video.duration != null && (
        <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 font-mono text-xs text-white">
          {formatDuration(video.duration)}
        </span>
      )}
    </div>

    {/* Info */}
    <div className="flex gap-3 p-3">
      <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-500 text-xs font-bold text-white">
        {video.owner?.fullName?.[0]?.toUpperCase() ?? "?"}
      </div>
      <div className="min-w-0 flex-1">
        <h2 className="line-clamp-2 text-sm font-medium leading-snug text-white transition-colors group-hover:text-red-400">
          {video.title}
        </h2>
        <p className="mt-1 text-xs text-gray-400">{video.owner?.fullName}</p>
        <p className="text-xs text-gray-500">
          {formatViews(video.views)}
          {video.createdAt ? ` · ${timeAgo(video.createdAt)}` : ""}
        </p>
      </div>
    </div>
  </Link>
);

const SkeletonCard = () => (
  <div className="flex animate-pulse flex-col overflow-hidden rounded-xl bg-[#1a1a1a]">
    <div className="aspect-video w-full bg-[#272727]" />
    <div className="flex gap-3 p-3">
      <div className="h-8 w-8 flex-shrink-0 rounded-full bg-[#333]" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 w-3/4 rounded bg-[#333]" />
        <div className="h-3 w-1/2 rounded bg-[#333]" />
        <div className="h-2 w-1/3 rounded bg-[#2a2a2a]" />
      </div>
    </div>
  </div>
);

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query) return;
    const fetchResults = async () => {
      setLoading(true);
      try {
        const res = await videoApi.searchVideos(query);
        setVideos(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">

        {/* Header */}
        <div className="mb-6 border-b border-[#2a2a2a] pb-5">
          <p className="mb-1 text-xs uppercase tracking-widest text-gray-500">Search results for</p>
          <h1 className="text-2xl font-semibold text-white">"{query}"</h1>
          {!loading && videos.length > 0 && (
            <p className="mt-1.5 text-sm text-gray-500">
              {videos.length} video{videos.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#1a1a1a]">
              <svg className="h-9 w-9 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-white">No results for "{query}"</p>
            <p className="mt-2 text-sm text-gray-500">Try different keywords or check your spelling</p>
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Search;
