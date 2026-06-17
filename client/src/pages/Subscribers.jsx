import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Users } from "lucide-react";
import { motion } from "framer-motion";
import { subscriptionApi } from "../api/subscriptionApi";
import { userApi } from "../api/userApi";
import MainLayout from "../components/layout/MainLayout";

const SubscriberSkeleton = () => (
  <div className="mb-4 flex items-center gap-4 rounded-xl bg-[#1a1a1a] p-4">
    <div className="h-12 w-12 animate-pulse rounded-full bg-[#272727]" />
    <div className="space-y-2">
      <div className="h-3.5 w-32 animate-pulse rounded bg-[#272727]" />
      <div className="h-3 w-24 animate-pulse rounded bg-[#272727]" />
    </div>
  </div>
);

const Subscribers = () => {
  const { username } = useParams();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const channelRes = await userApi.getChannel(username);
        const channelId = channelRes.data.data.user._id;

        const subRes = await subscriptionApi.getUserChannelSubscribers(channelId);
        setSubscribers(subRes.data.data.subscribers);
      } catch (error) {
        console.error("SUBSCRIBERS ERROR:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [username]);

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">

        <div className="mb-6 flex items-center gap-3">
          <Users className="text-red-500" size={24} />
          <h1 className="text-2xl font-bold text-white">
            Subscribers
            {!loading && (
              <span className="ml-2 text-base font-normal text-gray-500">
                ({subscribers.length})
              </span>
            )}
          </h1>
        </div>

        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <SubscriberSkeleton key={i} />
            ))}
          </>
        ) : subscribers.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
            <Users size={48} className="text-[#333]" />
            <p className="text-base text-[#555]">No subscribers yet</p>
            <span className="text-sm text-[#444]">
              Subscribers will show up here once people follow this channel.
            </span>
          </div>
        ) : (
          subscribers.map((sub, index) => (
            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: Math.min(index * 0.04, 0.3) }}
              className="mb-4 flex items-center gap-4 rounded-xl bg-[#1a1a1a] p-4 transition-colors hover:bg-[#1f1f1f]"
            >
              <Link to={`/channel/${sub.subscriber?.username}`} className="shrink-0">
                {sub.subscriber?.avatar ? (
                  <img
                    src={sub.subscriber.avatar}
                    alt={sub.subscriber?.fullName}
                    className="h-12 w-12 rounded-full object-cover ring-1 ring-white/10"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-medium text-white">
                    {sub.subscriber?.fullName?.[0]?.toUpperCase() ?? "U"}
                  </div>
                )}
              </Link>

              <div className="min-w-0 flex-1">
                <Link to={`/channel/${sub.subscriber?.username}`}>
                  <p className="truncate font-medium text-white transition-colors hover:text-red-400">
                    {sub.subscriber?.fullName}
                  </p>
                </Link>
                <p className="truncate text-sm text-gray-400">
                  @{sub.subscriber?.username}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default Subscribers;