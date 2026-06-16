import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { videoApi } from "../api/videoApi";
import MainLayout from "../components/layout/MainLayout";
import { commentApi } from "../api/commentApi";
import { likeApi } from "../api/likeApi";
import { subscriptionApi } from "../api/subscriptionApi";
import { playlistApi } from "../api/playlistApi";
import { useAuth } from "../context/AuthContext";
import { addToWatchHistory } from "../api/watchHistoryAPI";

const VideoDetail = () => {
  const { videoId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [video, setVideo] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);
  const [subLoading, setSubLoading] = useState(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const [playlistsLoading, setPlaylistsLoading] = useState(false);

  const handleComment = async () => {
    try {
      if (!commentText.trim()) return;
      await commentApi.addComment(videoId, { content: commentText });
      const commentsRes = await commentApi.getVideoComments(videoId);
      setComments(commentsRes.data.data);
      setCommentText("");
    } catch (error) { console.log("COMMENT ERROR:", error); }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (error) { console.log("DELETE COMMENT ERROR:", error); }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await commentApi.updateComment(commentId, { content: editText });
      const commentsRes = await commentApi.getVideoComments(videoId);
      setComments(commentsRes.data.data);
      setEditingCommentId(null);
      setEditText("");
    } catch (error) { console.log("UPDATE COMMENT ERROR:", error); }
  };

  const handleLike = async () => {
    try {
      const res = await likeApi.toggleVideoLike(videoId);
      if (res.data.data.liked) { setLikeCount((p) => p + 1); setLiked(true); }
      else { setLikeCount((p) => p - 1); setLiked(false); }
    } catch (error) { console.log("LIKE ERROR:", error); }
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    setSubLoading(true);
    try {
      const res = await subscriptionApi.toggleSubscription(video.owner._id);
      const isNowSubscribed = res.data.data.subscribed;
      setSubscribed(isNowSubscribed);
      setSubscriberCount((p) => isNowSubscribed ? p + 1 : p - 1);
    } catch (error) { console.log("SUBSCRIBE ERROR:", error); }
    finally { setSubLoading(false); }
  };

  const handleOpenPlaylistModal = async () => {
    setShowPlaylistModal(true);
    setPlaylistsLoading(true);
    try {
      const res = await playlistApi.getUserPlaylists(user._id);
      setPlaylists(res.data.data);
    } catch (error) { console.log("PLAYLIST FETCH ERROR:", error); }
    finally { setPlaylistsLoading(false); }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistApi.addVideoToPlaylist(playlistId, videoId);
      setShowPlaylistModal(false);
      alert("Added to playlist!");
    } catch (error) { console.log("ADD TO PLAYLIST ERROR:", error); }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await videoApi.getVideoById(videoId);
        setVideo(res.data.data);
        if (user) addToWatchHistory(videoId).catch(() => {});

        // Fetch recommendations — all videos except current
        const allRes = await videoApi.getAllVideos();
        const all = allRes.data.data?.videos || allRes.data.data || [];
        setRecommendations(all.filter((v) => v._id !== videoId).slice(0, 15));

        const commentsRes = await commentApi.getVideoComments(videoId);
        setComments(commentsRes.data.data);

        if (user) {
          try {
            const likesRes = await likeApi.getLikeStatus(videoId);
            setLikeCount(likesRes.data.data.count);
            setLiked(likesRes.data.data.liked);
          } catch {}

          try {
            const channelId = res.data.data.owner?._id;
            if (channelId) {
              const subRes = await subscriptionApi.getStatus(channelId);
              setSubscribed(subRes.data.data.subscribed);
              setSubscriberCount(subRes.data.data.subscriberCount);
            }
          } catch {}
        }
      } catch (error) {
        console.error("VIDEO ERROR:", error);
        setError("Video not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchVideo();
  }, [videoId, user]);

  if (loading) return (
    <MainLayout>
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
      </div>
    </MainLayout>
  );

  if (error) return (
    <MainLayout>
      <div className="flex min-h-screen items-center justify-center text-center">
        <div>
          <p className="text-6xl">😕</p>
          <h2 className="mt-4 text-xl font-semibold text-white">Something went wrong</h2>
          <p className="mt-2 text-gray-400">{error}</p>
          <button onClick={() => window.history.back()} className="mt-6 rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700">Go Back</button>
        </div>
      </div>
    </MainLayout>
  );

  const isOwnChannel = user?._id === video?.owner?._id;

  return (
    <MainLayout>
      <div className="flex gap-6 p-4 lg:p-6">

        {/* LEFT — main content */}
        <div className="flex-1 min-w-0">

          {/* Player */}
          <div className="overflow-hidden rounded-xl bg-black">
            <video controls autoPlay className="aspect-video w-full" src={video.videoFile} />
          </div>

          {/* Title */}
          <h1 className="mt-3 text-lg font-semibold text-white leading-snug">{video.title}</h1>

          {/* Meta + Actions */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>{video.views ?? 0} views</span>
              <span>•</span>
              <span>{new Date(video.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>

            {user && (
              <div className="flex flex-wrap items-center gap-2">
                {!isOwnChannel && (
                  <button onClick={handleSubscribe} disabled={subLoading} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${subscribed ? "bg-[#272727] text-gray-300 hover:bg-red-600 hover:text-white" : "bg-white text-black hover:bg-gray-200"} disabled:opacity-50`}>
                    {subscribed ? "Subscribed" : "Subscribe"}
                    {subscriberCount > 0 && <span className="text-xs opacity-70">· {subscriberCount}</span>}
                  </button>
                )}
                <button onClick={handleLike} className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition ${liked ? "bg-white text-black" : "bg-[#272727] text-gray-300 hover:bg-[#3a3a3a]"}`}>
                  👍 {liked ? "Liked" : "Like"} ({likeCount})
                </button>
                <button onClick={handleOpenPlaylistModal} className="flex items-center gap-2 rounded-full bg-[#272727] px-4 py-1.5 text-sm font-medium text-gray-300 hover:bg-[#3a3a3a] transition">
                  ➕ Save
                </button>
              </div>
            )}
          </div>

          {/* Owner */}
          <div className="mt-3 flex items-center gap-3 border-b border-gray-800 pb-3">
            <Link to={`/channel/${video.owner?.username}`}>
              {video.owner?.avatar ? (
                <img src={video.owner.avatar} alt={video.owner.fullName} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600 text-white text-sm">{video.owner?.fullName?.[0]?.toUpperCase() ?? "U"}</div>
              )}
            </Link>
            <div>
              <Link to={`/channel/${video.owner?.username}`}>
                <p className="text-sm font-medium text-white hover:text-gray-300">{video.owner?.fullName}</p>
              </Link>
              <p className="text-xs text-gray-500">@{video.owner?.username}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 rounded-lg bg-[#1a1a1a] p-3 text-sm leading-relaxed text-gray-300">
            {video.description || "No description provided."}
          </div>

          {/* Comments */}
          <div className="mt-6">
            <h2 className="mb-4 text-base font-semibold text-white">Comments ({comments.length})</h2>
            {user ? (
              <div className="mb-4">
                <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment..." className="w-full rounded-lg bg-[#1a1a1a] p-3 text-sm text-white outline-none border border-transparent focus:border-gray-600" rows="2" />
                <button onClick={handleComment} className="mt-2 rounded-full bg-[#272727] px-4 py-1.5 text-sm text-white hover:bg-[#3a3a3a] transition">Comment</button>
              </div>
            ) : (
              <p className="mb-4 text-gray-500 text-sm">Please log in to comment.</p>
            )}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-sm">No comments yet. Be the first!</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment._id} className="rounded-lg bg-[#1a1a1a] p-3">
                    <p className="text-sm font-medium text-white">{comment.owner?.fullName ?? "Anonymous"}</p>
                    {editingCommentId === comment._id ? (
                      <div className="mt-2">
                        <textarea value={editText} onChange={(e) => setEditText(e.target.value)} className="w-full rounded bg-[#272727] p-2 text-sm text-white outline-none" />
                        <button onClick={() => handleUpdateComment(comment._id)} className="mt-2 rounded bg-green-600 px-3 py-1 text-sm text-white">Save</button>
                      </div>
                    ) : (
                      <p className="mt-1 text-sm text-gray-300">{comment.content}</p>
                    )}
                    {comment.owner?._id === user?._id && (
                      <div className="mt-2 flex gap-3">
                        <button onClick={() => { setEditingCommentId(comment._id); setEditText(comment.content); }} className="text-xs text-blue-400 hover:text-blue-300">Edit</button>
                        <button onClick={() => handleDeleteComment(comment._id)} className="text-xs text-red-400 hover:text-red-300">Delete</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — recommendations */}
        <div className="hidden lg:flex flex-col gap-3 w-80 shrink-0">
          <h3 className="text-sm font-medium text-gray-400">Up next</h3>
          {recommendations.length === 0 ? (
            <p className="text-xs text-gray-600">No recommendations</p>
          ) : (
            recommendations.map((rec) => (
              <Link key={rec._id} to={`/videos/${rec._id}`} className="flex gap-2 group">
                <div className="relative w-40 h-[90px] shrink-0 rounded-lg overflow-hidden bg-[#272727]">
                  <img src={rec.thumbnail} alt={rec.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white line-clamp-2 leading-snug group-hover:text-red-400 transition-colors">{rec.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{rec.owner?.fullName || rec.owner?.username}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{rec.views ?? 0} views</p>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>

      {/* Playlist Modal */}
      {showPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="w-full max-w-md rounded-xl bg-[#1f1f1f] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Save to Playlist</h2>
              <button onClick={() => setShowPlaylistModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>
            {playlistsLoading ? (
              <p className="text-center text-gray-400">Loading...</p>
            ) : playlists.length === 0 ? (
              <div className="text-center">
                <p className="text-gray-400">No playlists yet.</p>
                <Link to="/playlists" className="mt-3 inline-block text-sm text-red-400 hover:text-red-300">Create a playlist →</Link>
              </div>
            ) : (
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {playlists.map((playlist) => (
                  <button key={playlist._id} onClick={() => handleAddToPlaylist(playlist._id)} className="flex w-full items-center gap-3 rounded-lg p-3 text-left hover:bg-white/10 transition">
                    <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-[#272727]">
                      {playlist.videos?.[0]?.thumbnail ? (
                        <img src={playlist.videos[0].thumbnail} alt={playlist.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xl">🎵</div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{playlist.name}</p>
                      <p className="text-xs text-gray-400">{playlist.videos?.length ?? 0} videos</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default VideoDetail;