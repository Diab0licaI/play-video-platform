import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ThumbsUp, UserPlus, Plus, X, Music } from "lucide-react";
import { videoApi } from "../api/videoApi";
import MainLayout from "../components/layout/MainLayout";
import { commentApi } from "../api/commentApi";
import { likeApi } from "../api/likeApi";
import { subscriptionApi } from "../api/subscriptionApi";
import { playlistApi } from "../api/playlistApi";
import { useAuth } from "../context/AuthContext";
import { addToWatchHistory } from "../api/watchHistoryAPI";
import toast from "react-hot-toast";

const formatViews = (views = 0) => {
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return `${views}`;
};

const PlayerSkeleton = () => (
  <div className="flex-1 min-w-0">
    <div className="aspect-video w-full animate-pulse rounded-xl bg-[#1a1a1a]" />
    <div className="mt-3 h-5 w-3/4 animate-pulse rounded bg-[#1a1a1a]" />
    <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-[#1a1a1a]" />
    <div className="mt-4 h-16 w-full animate-pulse rounded-lg bg-[#1a1a1a]" />
  </div>
);

const RecommendationSkeleton = () => (
  <div className="flex gap-2">
    <div className="h-[90px] w-40 shrink-0 animate-pulse rounded-lg bg-[#1a1a1a]" />
    <div className="flex-1 space-y-2 pt-1">
      <div className="h-3 w-5/6 animate-pulse rounded bg-[#1a1a1a]" />
      <div className="h-3 w-1/2 animate-pulse rounded bg-[#1a1a1a]" />
    </div>
  </div>
);

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
  const [postingComment, setPostingComment] = useState(false);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    setPostingComment(true);
    try {
      await commentApi.addComment(videoId, { content: commentText });
      const commentsRes = await commentApi.getVideoComments(videoId);
      setComments(commentsRes.data.data);
      setCommentText("");
    } catch (error) {
      console.log("COMMENT ERROR:", error);
      toast.error("Failed to post comment");
    } finally {
      setPostingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await commentApi.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (error) {
      console.log("DELETE COMMENT ERROR:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleUpdateComment = async (commentId) => {
    try {
      await commentApi.updateComment(commentId, { content: editText });
      const commentsRes = await commentApi.getVideoComments(videoId);
      setComments(commentsRes.data.data);
      setEditingCommentId(null);
      setEditText("");
    } catch (error) {
      console.log("UPDATE COMMENT ERROR:", error);
      toast.error("Failed to update comment");
    }
  };

  const handleLike = async () => {
    try {
      const res = await likeApi.toggleVideoLike(videoId);
      if (res.data.data.liked) {
        setLikeCount((p) => p + 1);
        setLiked(true);
      } else {
        setLikeCount((p) => p - 1);
        setLiked(false);
      }
    } catch (error) {
      console.log("LIKE ERROR:", error);
    }
  };

  const handleSubscribe = async () => {
    if (!video?.owner?._id) return;
    setSubLoading(true);
    try {
      const res = await subscriptionApi.toggleSubscription(video.owner._id);
      const isNowSubscribed = res.data.data.subscribed;
      setSubscribed(isNowSubscribed);
      setSubscriberCount((p) => (isNowSubscribed ? p + 1 : p - 1));
    } catch (error) {
      console.log("SUBSCRIBE ERROR:", error);
    } finally {
      setSubLoading(false);
    }
  };

  const handleOpenPlaylistModal = async () => {
    setShowPlaylistModal(true);
    setPlaylistsLoading(true);
    try {
      const res = await playlistApi.getUserPlaylists(user._id);
      setPlaylists(res.data.data);
    } catch (error) {
      console.log("PLAYLIST FETCH ERROR:", error);
    } finally {
      setPlaylistsLoading(false);
    }
  };

  const handleAddToPlaylist = async (playlistId) => {
    try {
      await playlistApi.addVideoToPlaylist(playlistId, videoId);
      setShowPlaylistModal(false);
      toast.success("Added to playlist!");
    } catch (error) {
      console.log("ADD TO PLAYLIST ERROR:", error);
      toast.error("Failed to add to playlist");
    }
  };

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await videoApi.getVideoById(videoId);
        setVideo(res.data.data);
        if (user) addToWatchHistory(videoId).catch(() => {});

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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex gap-6 p-4 lg:p-6">
          <PlayerSkeleton />
          <div className="hidden w-80 shrink-0 flex-col gap-3 lg:flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <RecommendationSkeleton key={i} />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex min-h-[70vh] items-center justify-center text-center">
          <div>
            <p className="text-6xl">😕</p>
            <h2 className="mt-4 text-xl font-semibold text-white">Something went wrong</h2>
            <p className="mt-2 text-gray-400">{error}</p>
            <button
              onClick={() => navigate(-1)}
              className="mt-6 rounded-full bg-red-600 px-6 py-2 text-white transition-colors hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isOwnChannel = user?._id === video?.owner?._id;

  return (
    <MainLayout>
      <div className="flex flex-col gap-6 p-4 lg:flex-row lg:p-6">

        {/* LEFT — main content */}
        <div className="min-w-0 flex-1">

          {/* Player */}
          <div className="overflow-hidden rounded-xl bg-black">
            <video controls autoPlay className="aspect-video w-full" src={video.videoFile} />
          </div>

          {/* Title */}
          <h1 className="mt-3 text-lg font-semibold leading-snug text-white">{video.title}</h1>

          {/* Meta + Actions */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{formatViews(video.views)} views</span>
              <span>•</span>
              <span>
                {new Date(video.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>

            {user && (
              <div className="flex flex-wrap items-center gap-2">
                {!isOwnChannel && (
                  <button
                    onClick={handleSubscribe}
                    disabled={subLoading}
                    className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors disabled:opacity-50 ${
                      subscribed
                        ? "bg-[#272727] text-gray-300 hover:bg-red-600 hover:text-white"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    <UserPlus size={14} />
                    {subscribed ? "Subscribed" : "Subscribe"}
                    {subscriberCount > 0 && <span className="text-xs opacity-70">· {subscriberCount}</span>}
                  </button>
                )}
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  onClick={handleLike}
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    liked ? "bg-white text-black" : "bg-[#272727] text-gray-300 hover:bg-[#3a3a3a]"
                  }`}
                >
                  <ThumbsUp size={14} fill={liked ? "black" : "none"} />
                  {liked ? "Liked" : "Like"} ({likeCount})
                </motion.button>
                <button
                  onClick={handleOpenPlaylistModal}
                  className="flex items-center gap-2 rounded-full bg-[#272727] px-4 py-1.5 text-sm font-medium text-gray-300 transition-colors hover:bg-[#3a3a3a]"
                >
                  <Plus size={14} />
                  Save
                </button>
              </div>
            )}
          </div>

          {/* Owner */}
          <div className="mt-3 flex items-center gap-3 border-b border-gray-800 pb-3">
            <Link to={`/channel/${video.owner?.username}`} className="transition-opacity hover:opacity-80">
              {video.owner?.avatar ? (
                <img src={video.owner.avatar} alt={video.owner.fullName} className="h-9 w-9 rounded-full object-cover" />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600 text-sm text-white">
                  {video.owner?.fullName?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
            </Link>
            <div>
              <Link to={`/channel/${video.owner?.username}`}>
                <p className="text-sm font-medium text-white transition-colors hover:text-gray-300">
                  {video.owner?.fullName}
                </p>
              </Link>
              <p className="text-xs text-gray-500">@{video.owner?.username}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mt-3 whitespace-pre-wrap rounded-lg bg-[#1a1a1a] p-3 text-sm leading-relaxed text-gray-300">
            {video.description || "No description provided."}
          </div>

          {/* Comments */}
          <div className="mt-6">
            <h2 className="mb-4 text-base font-semibold text-white">Comments ({comments.length})</h2>
            {user ? (
              <div className="mb-4">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full rounded-lg border border-transparent bg-[#1a1a1a] p-3 text-sm text-white outline-none transition-colors focus:border-gray-600"
                  rows="2"
                />
                <button
                  onClick={handleComment}
                  disabled={postingComment || !commentText.trim()}
                  className="mt-2 rounded-full bg-[#272727] px-4 py-1.5 text-sm text-white transition-colors hover:bg-[#3a3a3a] disabled:opacity-50"
                >
                  {postingComment ? "Posting..." : "Comment"}
                </button>
              </div>
            ) : (
              <p className="mb-4 text-sm text-gray-500">Please log in to comment.</p>
            )}
            <div className="space-y-3">
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500">No comments yet. Be the first!</p>
              ) : (
                <AnimatePresence initial={false}>
                  {comments.map((comment) => (
                    <motion.div
                      key={comment._id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-lg bg-[#1a1a1a] p-3 transition-colors hover:bg-[#1f1f1f]"
                    >
                      <p className="text-sm font-medium text-white">{comment.owner?.fullName ?? "Anonymous"}</p>
                      {editingCommentId === comment._id ? (
                        <div className="mt-2">
                          <textarea
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="w-full rounded bg-[#272727] p-2 text-sm text-white outline-none"
                            rows="2"
                          />
                          <div className="mt-2 flex gap-2">
                            <button
                              onClick={() => handleUpdateComment(comment._id)}
                              className="rounded bg-green-600 px-3 py-1 text-sm text-white transition-colors hover:bg-green-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => { setEditingCommentId(null); setEditText(""); }}
                              className="rounded bg-gray-600 px-3 py-1 text-sm text-white transition-colors hover:bg-gray-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-300">{comment.content}</p>
                      )}
                      {comment.owner?._id === user?._id && editingCommentId !== comment._id && (
                        <div className="mt-2 flex gap-3">
                          <button
                            onClick={() => { setEditingCommentId(comment._id); setEditText(comment.content); }}
                            className="text-xs text-blue-400 transition-colors hover:text-blue-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs text-red-400 transition-colors hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT — recommendations */}
        <div className="flex w-full flex-col gap-3 lg:w-80 lg:shrink-0">
          <h3 className="text-sm font-medium text-gray-400">Up next</h3>
          {recommendations.length === 0 ? (
            <p className="text-xs text-gray-600">No recommendations</p>
          ) : (
            recommendations.map((rec) => (
              <Link key={rec._id} to={`/videos/${rec._id}`} className="group flex gap-2">
                <div className="relative h-[90px] w-40 shrink-0 overflow-hidden rounded-lg bg-[#272727]">
                  <img
                    src={rec.thumbnail}
                    alt={rec.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-white transition-colors group-hover:text-red-400">
                    {rec.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-gray-500">{rec.owner?.fullName || rec.owner?.username}</p>
                  <p className="mt-0.5 text-xs text-gray-600">{formatViews(rec.views)} views</p>
                </div>
              </Link>
            ))
          )}
        </div>

      </div>

      {/* Playlist Modal */}
      <AnimatePresence>
        {showPlaylistModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPlaylistModal(false)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-xl bg-[#1f1f1f] p-6"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Save to Playlist</h2>
                <button
                  onClick={() => setShowPlaylistModal(false)}
                  className="rounded-full p-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
              {playlistsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 rounded-lg p-3">
                      <div className="h-12 w-20 shrink-0 animate-pulse rounded-lg bg-[#272727]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 w-2/3 animate-pulse rounded bg-[#272727]" />
                        <div className="h-2.5 w-1/3 animate-pulse rounded bg-[#272727]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : playlists.length === 0 ? (
                <div className="text-center">
                  <Music size={36} className="mx-auto text-gray-600" />
                  <p className="mt-3 text-gray-400">No playlists yet.</p>
                  <Link to="/playlists" className="mt-3 inline-block text-sm text-red-400 hover:text-red-300">
                    Create a playlist →
                  </Link>
                </div>
              ) : (
                <div className="max-h-64 space-y-1 overflow-y-auto">
                  {playlists.map((playlist) => (
                    <button
                      key={playlist._id}
                      onClick={() => handleAddToPlaylist(playlist._id)}
                      className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-white/10"
                    >
                      <div className="h-12 w-20 shrink-0 overflow-hidden rounded-lg bg-[#272727]">
                        {playlist.videos?.[0]?.thumbnail ? (
                          <img src={playlist.videos[0].thumbnail} alt={playlist.name} className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xl">🎵</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-white">{playlist.name}</p>
                        <p className="text-xs text-gray-400">{playlist.videos?.length ?? 0} videos</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
};

export default VideoDetail;