import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { playlistApi } from "../api/playlistApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

const Playlists = () => {
  const { user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);

useEffect(() => {
  const fetchPlaylists = async () => {
    console.log("FETCHING PLAYLISTS");
    try {
      const res = await playlistApi.getUserPlaylists(user._id);
      setPlaylists(res.data.data);
    } catch (error) {
      console.error("PLAYLIST ERROR:", error);
    } finally {
       console.log("FINALLY RUNNING");
      setLoading(false);
    }
  };

  if (user?._id) {
    fetchPlaylists();
  } else {
    setLoading(false);  // ← stop loading if no user
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
    console.log("Loading state:", loading);
    console.log("User:", user);
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            <p className="text-gray-400">Loading playlists...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl p-6">

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Playlists</h1>
          <button
            onClick={() => setShowCreate((prev) => !prev)}
            className="rounded-full bg-red-600 px-5 py-2 text-sm text-white hover:bg-red-700"
          >
            + New Playlist
          </button>
        </div>

        {/* Create Playlist Form */}
        {showCreate && (
          <div className="mb-6 rounded-xl bg-[#272727] p-5">
            <h2 className="mb-4 text-lg font-semibold text-white">
              Create Playlist
            </h2>
            <input
              type="text"
              placeholder="Playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-3 w-full rounded-lg bg-[#1f1f1f] p-3 text-white outline-none focus:ring-2 focus:ring-red-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="2"
              className="mb-3 w-full rounded-lg bg-[#1f1f1f] p-3 text-white outline-none focus:ring-2 focus:ring-red-500"
            />
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                disabled={creating}
                className="rounded-lg bg-red-600 px-5 py-2 text-white hover:bg-red-700 disabled:opacity-50"
              >
                {creating ? "Creating..." : "Create"}
              </button>
              <button
                onClick={() => setShowCreate(false)}
                className="rounded-lg bg-gray-600 px-5 py-2 text-white hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Playlist Grid */}
        {playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-6xl">🎵</p>
            <h2 className="mt-4 text-xl font-semibold text-white">
              No playlists yet
            </h2>
            <p className="mt-2 text-gray-400">
              Create your first playlist to organize your videos.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <div
                key={playlist._id}
                className="overflow-hidden rounded-xl bg-[#272727]"
              >
                {/* Thumbnail stack */}
                <Link to={`/playlist/${playlist._id}`}>
                  <div className="aspect-video w-full overflow-hidden bg-[#1f1f1f]">
                    {playlist.videos?.[0]?.thumbnail ? (
                      <img
                        src={playlist.videos[0].thumbnail}
                        alt={playlist.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-4xl">
                        🎵
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-3">
                  <Link to={`/playlist/${playlist._id}`}>
                    <h3 className="font-medium text-white hover:text-red-400">
                      {playlist.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-xs text-gray-400">
                    {playlist.videos?.length ?? 0} videos
                  </p>
                  {playlist.description && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                      {playlist.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/playlist/${playlist._id}`}
                      className="rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(playlist._id)}
                      className="rounded bg-red-600 px-3 py-1 text-xs text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </MainLayout>
  );
};

export default Playlists;