import api from "./axiosInstance";

export const subscriptionApi = {
  getStatus: (channelId) =>
    api.get(`/subscriptions/${channelId}`),

  toggleSubscription: (channelId) =>
    api.post(`/subscriptions/${channelId}`),

  getUserChannelSubscribers: (channelId) =>
    api.get(`/subscriptions/c/${channelId}`),

  getSubscribedChannels: (subscriberId) =>
    api.get(`/subscriptions/u/${subscriberId}`),

  getFeed: () =>
    api.get("/subscriptions/feed"),
};