import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { subscriptionApi } from "../api/subscriptionApi";
import { userApi } from "../api/userApi";
import MainLayout from "../components/layout/MainLayout";

const Subscribers = () => {
  const { username } = useParams();

  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        // Get channel by username
        const channelRes =
          await userApi.getChannel(username);

        const channelId =
          channelRes.data.data.user._id;

        console.log(
          "CHANNEL ID:",
          channelId
        );

        // Get subscribers
        const subRes =
          await subscriptionApi.getUserChannelSubscribers(
            channelId
          );

        console.log(
          "SUBSCRIBERS RESPONSE:",
          subRes.data
        );

        setSubscribers(
          subRes.data.data.subscribers
        );
      } catch (error) {
        console.log(
          "SUBSCRIBERS ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscribers();
  }, [username]);

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6 text-white">
          Loading subscribers...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-white">
          Subscribers ({subscribers.length})
        </h1>

        {subscribers.length === 0 ? (
          <p className="text-gray-400">
            No subscribers yet.
          </p>
        ) : (
          subscribers.map((sub) => (
            <div
              key={sub._id}
              className="mb-4 flex items-center gap-4 rounded-lg bg-[#272727] p-4"
            >
              <img
                src={sub.subscriber?.avatar}
                alt={sub.subscriber?.fullName}
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
                <p className="font-medium text-white">
                  {sub.subscriber?.fullName}
                </p>

                <p className="text-sm text-gray-400">
                  @{sub.subscriber?.username}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
};

export default Subscribers;