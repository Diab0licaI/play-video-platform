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
  const total = Math.floor(seconds); // ← drop the decimal
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
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
    className="group flex flex-col gap-0 rounded-xl overflow-hidden bg-[#1a1a1a] hover:bg-[#222] transition-colors duration-200"
    style={{ textDecoration: "none" }}
  >
    {/* Thumbnail */}
    <div className="relative w-full aspect-video bg-[#2a2a2a] overflow-hidden">
      {video.thumbnail ? (
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-12 h-12 text-[#444]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      )}
      {/* Duration badge */}
      {video.duration != null && (
        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-mono px-1.5 py-0.5 rounded">
          {formatDuration(video.duration)}
        </span>
      )}
    </div>

    {/* Info row */}
    <div className="flex gap-3 p-3">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold mt-0.5">
        {video.owner?.fullName?.[0]?.toUpperCase() ?? "?"}
      </div>

      <div className="min-w-0 flex-1">
        <h2 className="text-white text-sm font-semibold leading-snug line-clamp-2 group-hover:text-purple-300 transition-colors">
          {video.title}
        </h2>
        <p className="text-gray-400 text-xs mt-1">{video.owner?.fullName}</p>
        <p className="text-gray-500 text-xs">
          {formatViews(video.views)}
          {video.createdAt ? ` · ${timeAgo(video.createdAt)}` : ""}
        </p>
      </div>
    </div>
  </Link>
);

const SkeletonCard = () => (
  <div className="flex flex-col gap-0 rounded-xl overflow-hidden bg-[#1a1a1a] animate-pulse">
    <div className="w-full aspect-video bg-[#2a2a2a]" />
    <div className="flex gap-3 p-3">
      <div className="w-9 h-9 rounded-full bg-[#333] flex-shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <div className="h-3 bg-[#333] rounded w-3/4" />
        <div className="h-3 bg-[#333] rounded w-1/2" />
        <div className="h-2 bg-[#2a2a2a] rounded w-1/3" />
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
      <div className="px-6 py-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 border-b border-[#2a2a2a] pb-4">
          <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Search results</p>
          <h1 className="text-white text-2xl font-bold">
            {query}
          </h1>
          {!loading && videos.length > 0 && (
            <p className="text-gray-500 text-sm mt-1">{videos.length} video{videos.length !== 1 ? "s" : ""} found</p>
          )}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <svg className="w-16 h-16 text-[#333] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <p className="text-white text-lg font-semibold">No results for "{query}"</p>
            <p className="text-gray-500 text-sm mt-2">Try different keywords or check your spelling</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Search;