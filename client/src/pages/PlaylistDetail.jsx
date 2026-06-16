import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { playlistApi } from "../api/playlistApi";
import MainLayout from "../components/layout/MainLayout";


const PlaylistDetail = () => {
  const { playlistId } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await playlistApi.getPlaylistById(playlistId);
        setPlaylist(res.data.data);
      } catch (error) {
        console.error("PLAYLIST ERROR:", error);
        setError("Playlist not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await playlistApi.removeVideoFromPlaylist(playlistId, videoId);
      setPlaylist((prev) => ({
        ...prev,
        videos: prev.videos.filter((v) => v._id !== videoId),
      }));
    } catch (error) {
      console.error("REMOVE ERROR:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            <p className="text-gray-400">Loading playlist...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-6xl">😕</p>
            <p className="mt-4 text-gray-400">{error}</p>
            <button
              onClick={() => navigate("/playlists")}
              className="mt-6 rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
              Back to Playlists
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-4xl p-6">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {playlist.name}
            </h1>
            {playlist.description && (
              <p className="mt-1 text-sm text-gray-400">
                {playlist.description}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {playlist.videos?.length ?? 0} videos
            </p>
          </div>
          <button
            onClick={() => navigate("/playlists")}
            className="rounded-lg bg-[#272727] px-4 py-2 text-sm text-white hover:bg-[#3a3a3a]"
          >
            ← Back
          </button>
        </div>

        {/* Videos */}
        {playlist.videos?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-6xl">🎵</p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              No videos in this playlist
            </h2>
            <p className="mt-2 text-gray-400">
              Add videos from the watch page.
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
            {playlist.videos.map((video, index) => (
              <div
                key={video._id}
                className="flex items-center gap-4 rounded-xl bg-[#272727] p-3 hover:bg-[#3a3a3a] transition"
              >
                {/* Index */}
                <span className="w-6 shrink-0 text-center text-sm text-gray-500">
                  {index + 1}
                </span>

                {/* Thumbnail */}
                <Link to={`/videos/${video._id}`}>
                  <div className="relative h-16 w-28 shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                    {video.duration && (
                      <span className="absolute bottom-1 right-1 rounded bg-black/80 px-1 text-xs text-white">
                        {Math.floor(video.duration / 60)}:
                        {String(Math.floor(video.duration % 60)).padStart(2, "0")}
                      </span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 overflow-hidden">
                  <Link to={`/videos/${video._id}`}>
                    <h3 className="line-clamp-1 text-sm font-medium text-white hover:text-red-400">
                      {video.title}
                    </h3>
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {video.owner?.fullName}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {video.views ?? 0} views
                  </p>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemoveVideo(video._id)}
                  className="shrink-0 rounded bg-red-600/20 px-3 py-1 text-xs text-red-400 hover:bg-red-600 hover:text-white transition"
                >
                  Remove
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