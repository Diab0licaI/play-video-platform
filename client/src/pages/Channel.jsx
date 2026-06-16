import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { userApi } from "../api/userApi";
import { subscriptionApi } from "../api/subscriptionApi";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";

const Channel = () => {
  const { username } = useParams();
  const { user } = useAuth();

  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState(0);

  useEffect(() => {
    const fetchChannel = async () => {
      try {
        const res = await userApi.getChannel(username);
        const channelData = res.data.data.user;
        setChannel(channelData);
        setVideos(res.data.data.videos);

        // Fetch subscription status
        if (user) {
          try {
            const subRes = await subscriptionApi.getStatus(channelData._id);
            setSubscribed(subRes.data.data.subscribed);
            setSubscriberCount(subRes.data.data.subscriberCount);
          } catch {
            // not critical
          }
        }
      } catch (error) {
        console.error("CHANNEL ERROR:", error);
        setError("Channel not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchChannel();
  }, [username, user]);

  const handleSubscribe = async () => {
    if (!user) {
      alert("Please login to subscribe");
      return;
    }
    try {
      const res = await subscriptionApi.toggleSubscription(channel._id);
      if (res.data.data.subscribed) {
        setSubscribed(true);
        setSubscriberCount((prev) => prev + 1);
      } else {
        setSubscribed(false);
        setSubscriberCount((prev) => prev - 1);
      }
    } catch (error) {
      console.log("SUBSCRIBE ERROR:", error);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-600 border-t-red-500" />
            <p className="text-gray-400">Loading channel...</p>
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
            <h2 className="mt-4 text-xl font-semibold text-white">
              Channel not found
            </h2>
            <p className="mt-2 text-gray-400">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-6 rounded bg-red-600 px-6 py-2 text-white hover:bg-red-700"
            >
              Go Back
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const joinedDate = new Date(channel.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });

  const isOwnChannel = user?.username === channel.username;

  return (
    <MainLayout>
      <div className="mx-auto max-w-5xl">

        {/* Cover Image */}
        <div className="h-56 w-full overflow-hidden rounded-xl bg-[#272727]">
          {channel.coverImage ? (
            <img
              src={channel.coverImage}
              alt="cover"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-gray-800 to-gray-700" />
          )}
        </div>

        {/* Channel Info */}
        <div className="px-6 pb-6">
          <div className="flex items-end justify-between -mt-8">

            {/* Avatar + Name */}
            <div className="flex items-end gap-4">
              {channel.avatar ? (
                <img
                  src={channel.avatar}
                  alt={channel.fullName}
                  className="h-20 w-20 rounded-full border-4 border-[#0f0f0f] object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#0f0f0f] bg-gray-600 text-2xl text-white">
                  {channel.fullName?.[0]?.toUpperCase() ?? "U"}
                </div>
              )}
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-white">
                  {channel.fullName}
                </h1>
                <p className="text-gray-400">@{channel.username}</p>
              </div>
            </div>

            {/* Subscribe Button */}
            {!isOwnChannel && (
              <button
                onClick={handleSubscribe}
                className={`mb-2 rounded-full px-6 py-2 text-sm font-medium transition
                  ${subscribed
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                  }`}
              >
                {subscribed ? "Subscribed ✓" : "Subscribe"}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-3 flex gap-2 text-sm text-gray-400 border-b border-gray-700 pb-4">

            <Link
              to={`/channel/${channel._id}/subscribers`}
              className="hover:text-red-500 transition"
             >
            {subscriberCount}{" "}
            {subscriberCount === 1 ? "Subscriber" : "Subscribers"}
            </Link>

            <span>•</span>

            <span>
              {videos.length}{" "}
              {videos.length === 1 ? "Video" : "Videos"}
            </span>
            <span>•</span>
            <span>Joined {joinedDate}</span>
          </div>

          {/* Videos Grid */}
          <div className="mt-6">
            <h2 className="mb-4 text-xl font-semibold text-white">
              Videos
            </h2>

            {videos.length === 0 ? (
              <p className="text-gray-500">No videos uploaded yet.</p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {videos.map((video) => (
                  <Link
                    key={video._id}
                    to={`/videos/${video._id}`}
                    className="group overflow-hidden rounded-xl bg-[#272727] transition hover:bg-[#3a3a3a]"
                  >
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="line-clamp-2 font-medium text-white">
                        {video.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-400">
                        {video.views ?? 0} views •{" "}
                        {new Date(video.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default Channel;