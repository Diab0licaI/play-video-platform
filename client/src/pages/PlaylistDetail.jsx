import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { playlistApi } from "../api/playlistApi";
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

// ── Loading skeleton ──────────────────────────────────────────────────────────
const PlaylistSkeleton = () => (
  <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
    <div className="mb-6 flex items-start justify-between">
      <div className="space-y-2">
        <div className="h-6 w-48 animate-pulse rounded bg-[#272727]" />
        <div className="h-4 w-64 animate-pulse rounded bg-[#272727]" />
        <div className="h-3 w-20 animate-pulse rounded bg-[#272727]" />
      </div>
      <div className="h-9 w-20 animate-pulse rounded-lg bg-[#272727]" />
    </div>
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl bg-[#1a1a1a] p-3">
          <div className="h-4 w-4 rounded bg-[#272727]" />
          <div className="h-16 w-28 flex-shrink-0 rounded-lg bg-[#272727]" />
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 rounded bg-[#272727]" />
            <div className="h-3 w-1/3 rounded bg-[#272727]" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await playlistApi.getPlaylistById(playlistId);
        setPlaylist(res.data.data);
      } catch (err) {
        console.error("PLAYLIST ERROR:", err);
        setError("Playlist not found.");
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylist();
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    setRemovingId(videoId);
    try {
      await playlistApi.removeVideoFromPlaylist(playlistId, videoId);
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (err) {
      console.error("REMOVE ERROR:", err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <PlaylistSkeleton />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[#1a1a1a] text-4xl">
            😕
          </div>
          <p className="text-lg font-semibold text-white">Playlist not found</p>
          <p className="mt-1 text-sm text-gray-400">{error}</p>
          <button
            onClick={() => navigate("/playlists")}
            className="mt-6 rounded-lg bg-red-600 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
          >
            Back to Playlists
          </button>
        </div>
      </MainLayout>
    );
  }

  const videoCount = playlist.videos?.length ?? 0;

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-semibold text-white">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="mt-1 text-sm text-gray-400">{playlist.description}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span className="rounded-full bg-[#272727] px-2.5 py-0.5 text-xs text-gray-400">
                {videoCount} video{videoCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <button
            onClick={() => navigate("/playlists")}
            className="flex-shrink-0 rounded-lg bg-[#272727] px-4 py-2 text-sm text-white transition hover:bg-[#333]"
          >
            ← Back
          </button>
        </div>

        {/* Empty state */}
        {videoCount === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#1a1a1a] py-20 text-center">
            <div className="mb-4 text-5xl">🎵</div>
            <h2 className="text-lg font-semibold text-white">No videos yet</h2>
            <p className="mt-1 text-sm text-gray-400">Add videos from the watch page.</p>
            <Link
              to="/"
              className="mt-5 rounded-full bg-red-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            >
              Browse Videos
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {playlist.videos.map((video, index) => (
              <div
                key={video._id}
                className={`flex items-center gap-4 rounded-xl bg-[#1a1a1a] p-3 transition hover:bg-[#222] ${
                  removingId === video._id ? "opacity-50" : ""
                }`}
              >
                {/* Index */}
                <span className="w-5 flex-shrink-0 text-center text-xs text-gray-600">
                  {index + 1}
                </span>

                {/* Thumbnail */}
                <Link to={`/videos/${video._id}`} className="flex-shrink-0">
                  <div className="relative h-16 w-28 overflow-hidden rounded-lg bg-[#272727]">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                    />
                    {video.duration != null && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs text-white">
                        {formatDuration(video.duration)}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <Link to={`/videos/${video._id}`}>
                    <h3 className="line-clamp-2 text-sm font-medium text-white transition-colors hover:text-red-400">
                      {video.title}
                    </h3>
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-400">{video.owner?.fullName}</p>
                  <p className="mt-0.5 text-xs text-gray-500">{formatViews(video.views)} views</p>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  disabled={removingId === video._id}
                  className="flex-shrink-0 rounded-lg border border-[#3a3a3a] px-3 py-1.5 text-xs text-gray-400 transition hover:border-red-500/50 hover:bg-red-600/10 hover:text-red-400 disabled:opacity-50"
                >
                  {removingId === video._id ? "Removing…" : "Remove"}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default PlaylistDetail;
