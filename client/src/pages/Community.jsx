import { useEffect, useState } from "react";
import { tweetApi } from "../api/tweetApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

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
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            <p className="text-gray-400">Loading posts...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl p-6">

        <h1 className="mb-6 text-2xl font-bold text-white">
          Community
        </h1>

        {/* Create Post */}
        {user && (
          <div className="mb-6 rounded-xl bg-[#272727] p-4">
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
                  className="w-full rounded-lg bg-[#1f1f1f] p-3 text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-red-500"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    onClick={handlePost}
                    disabled={posting || !content.trim()}
                    className="rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
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
              <p className="text-6xl">💬</p>
              <h2 className="mt-4 text-xl font-semibold text-white">
                No posts yet
              </h2>
              <p className="mt-2 text-gray-400">
                Be the first to post something!
              </p>
            </div>
          ) : (
            tweets.map((tweet) => (
              <div
                key={tweet._id}
                className="rounded-xl bg-[#272727] p-4"
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
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(tweet._id);
                          setEditText(tweet.content);
                        }}
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(tweet._id)}
                        className="text-xs text-red-400 hover:text-red-300"
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
                      className="w-full rounded-lg bg-[#1f1f1f] p-3 text-white outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => handleEditSave(tweet._id)}
                        className="rounded-full bg-blue-600 px-4 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="rounded-full bg-gray-600 px-4 py-1 text-sm text-white hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-relaxed text-gray-200">
                    {tweet.content}
                  </p>
                )}

              </div>
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
};

export default Community;