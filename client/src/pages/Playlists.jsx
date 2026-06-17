import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Trash2, ListMusic } from "lucide-react";
import { playlistApi } from "../api/playlistApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

const PlaylistSkeleton = () => (
  <div className="overflow-hidden rounded-xl bg-[#1a1a1a]">
    <div className="aspect-video w-full animate-pulse bg-[#272727]" />
    <div className="space-y-2 p-3">
      <div className="h-4 w-3/4 animate-pulse rounded bg-[#272727]" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-[#272727]" />
    </div>
  </div>
);

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        const res = await playlistApi.getUserPlaylists(user._id);
        setPlaylists(res.data.data);
      } catch (error) {
        console.error("PLAYLIST ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchPlaylists();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCreate = async () => {
    if (!name.trim()) return;
    try {
      setCreating(true);
      const res = await playlistApi.createPlaylist({ name, description });
      setPlaylists((prev) => [res.data.data, ...prev]);
      setName("");
      setDescription("");
      setShowCreate(false);
    } catch (error) {
      console.error("CREATE ERROR:", error);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (playlistId) => {
    if (!window.confirm("Delete this playlist?")) return;
    try {
      await playlistApi.deletePlaylist(playlistId);
      setPlaylists((prev) => prev.filter((p) => p._id !== playlistId));
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-8 w-32 animate-pulse rounded bg-[#1a1a1a]" />
            <div className="h-9 w-36 animate-pulse rounded-full bg-[#1a1a1a]" />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <PlaylistSkeleton key={i} />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Playlists</h1>
          <button
            onClick={() => setShowCreate((prev) => !prev)}
            className="rounded-full bg-red-600 px-5 py-2 text-sm text-white transition-colors hover:bg-red-700"
          >
            + New Playlist
          </button>
        </div>

        {/* Create Playlist Form */}
        <AnimatePresence>
          {showCreate && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mb-6 rounded-xl bg-[#1a1a1a] p-5">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Create Playlist
                </h2>
                <input
                  type="text"
                  placeholder="Playlist name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mb-3 w-full rounded-lg bg-[#272727] p-3 text-white outline-none transition-shadow focus:ring-2 focus:ring-red-500"
                />
                <textarea
                  placeholder="Description (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="2"
                  className="mb-3 w-full rounded-lg bg-[#272727] p-3 text-white outline-none transition-shadow focus:ring-2 focus:ring-red-500"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleCreate}
                    disabled={creating}
                    className="rounded-lg bg-red-600 px-5 py-2 text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="rounded-lg bg-gray-600 px-5 py-2 text-white transition-colors hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Playlist Grid */}
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ListMusic size={56} className="text-gray-600" />
            <h2 className="mt-4 text-xl font-semibold text-white">
              No playlists yet
            </h2>
            <p className="mt-2 text-gray-400">
              Create your first playlist to organize your videos.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist, index) => (
              <motion.div
                key={playlist._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                whileHover={{ y: -4 }}
                className="group overflow-hidden rounded-xl bg-[#1a1a1a] transition-colors hover:bg-[#1f1f1f]"
              >
                {/* Thumbnail */}
                <Link to={`/playlist/${playlist._id}`} className="block">
                  <div className="relative aspect-video w-full overflow-hidden bg-[#272727]">
                    {playlist.videos?.[0]?.thumbnail ? (
                      <img
                        src={playlist.videos[0].thumbnail}
                        alt={playlist.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">
                        🎵
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/30">
                      <Play
                        size={32}
                        className="scale-90 text-white opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100"
                        fill="white"
                      />
                    </div>
                    <span className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white">
                      {playlist.videos?.length ?? 0} videos
                    </span>
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3">
                  <Link to={`/playlist/${playlist._id}`}>
                    <h3 className="truncate font-medium text-white transition-colors hover:text-red-400">
                      {playlist.name}
                    </h3>
                  </Link>
                  {playlist.description && (
                    <p className="mt-1 line-clamp-1 text-xs text-gray-500">
                      {playlist.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/playlist/${playlist._id}`}
                      className="flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-blue-700"
                    >
                      <Play size={12} /> View
                    </Link>
                    <button
                      onClick={() => handleDelete(playlist._id)}
                      className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1.5 text-xs text-white transition-colors hover:bg-red-700"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Playlists;