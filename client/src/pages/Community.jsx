import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { tweetApi } from "../api/tweetApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

const PostSkeleton = () => (
  <div className="rounded-xl bg-[#1a1a1a] p-4">
    <div className="flex items-center gap-3">
      <div className="h-9 w-9 animate-pulse rounded-full bg-[#272727]" />
      <div className="space-y-2">
        <div className="h-3 w-32 animate-pulse rounded bg-[#272727]" />
        <div className="h-2.5 w-20 animate-pulse rounded bg-[#272727]" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 w-full animate-pulse rounded bg-[#272727]" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-[#272727]" />
    </div>
  </div>
);

const Community = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const res = await tweetApi.getAllTweets();
        setTweets(res.data.data);
      } catch (error) {
        console.error("TWEETS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  const handlePost = async () => {
    if (!content.trim()) return;
    try {
      setPosting(true);
      const res = await tweetApi.createTweet({ content });
      setTweets((prev) => [res.data.data, ...prev]);
      setContent("");
    } catch (error) {
      console.error("POST ERROR:", error);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (tweetId) => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await tweetApi.deleteTweet(tweetId);
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
    } catch (error) {
      console.error("DELETE ERROR:", error);
    }
  };

  const handleEditSave = async (tweetId) => {
    if (!editText.trim()) return;
    try {
      await tweetApi.updateTweet(tweetId, { content: editText });
      setTweets((prev) =>
        prev.map((t) =>
          t._id === tweetId ? { ...t, content: editText } : t
        )
      );
      setEditingId(null);
      setEditText("");
    } catch (error) {
      console.error("EDIT ERROR:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <div className="mb-6 h-8 w-40 animate-pulse rounded bg-[#1a1a1a]" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <PostSkeleton key={i} />
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">

        <h1 className="mb-6 text-2xl font-bold text-white">Community</h1>

        {/* Create Post */}
        {user && (
          <div className="mb-6 rounded-xl bg-[#1a1a1a] p-4 transition-colors focus-within:bg-[#1f1f1f]">
            <div className="flex gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.fullName}
                  className="h-10 w-10 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-600 text-white">
                  {user.fullName?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div className="flex-1">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share something with your community..."
                  rows="3"
                  className="w-full rounded-lg bg-[#272727] p-3 text-white placeholder-gray-500 outline-none transition-shadow focus:ring-2 focus:ring-red-500"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handlePost}
                    disabled={posting || !content.trim()}
                    className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                  >
                    {posting ? "Posting..." : "Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tweet List */}
        <div className="space-y-4">
          {tweets.length === 0 ? (
            <div className="py-20 text-center">
              <MessageCircle size={56} className="mx-auto text-gray-600" />
              <h2 className="mt-4 text-xl font-semibold text-white">
                No posts yet
              </h2>
              <p className="mt-2 text-gray-400">
                Be the first to post something!
              </p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {tweets.map((tweet, index) => (
                <motion.div
                  key={tweet._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
                  className="rounded-xl bg-[#1a1a1a] p-4 transition-colors hover:bg-[#1f1f1f]"
                >
                  {/* Owner */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {tweet.owner?.avatar ? (
                        <img
                          src={tweet.owner.avatar}
                          alt={tweet.owner.fullName}
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-600 text-white">
                          {tweet.owner?.fullName?.[0]?.toUpperCase() ?? "U"}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-white">
                          {tweet.owner?.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{tweet.owner?.username} •{" "}
                          {tweet.createdAt
                            ? new Date(tweet.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    {tweet.owner?._id === user?._id && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setEditingId(tweet._id);
                            setEditText(tweet.content);
                          }}
                          className="text-xs text-blue-400 transition-colors hover:text-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(tweet._id)}
                          className="text-xs text-red-400 transition-colors hover:text-red-300"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  {editingId === tweet._id ? (
                    <div className="mt-3">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        rows="3"
                        className="w-full rounded-lg bg-[#272727] p-3 text-white outline-none transition-shadow focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEditSave(tweet._id)}
                          className="rounded-full bg-blue-600 px-4 py-1 text-sm text-white transition-colors hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditText("");
                          }}
                          className="rounded-full bg-gray-600 px-4 py-1 text-sm text-white transition-colors hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-200">
                      {tweet.content}
                    </p>
                  )}

                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default Community;