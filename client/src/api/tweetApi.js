import api from "./axiosInstance";

export const tweetApi = {
  getAllTweets: () =>
    api.get("/tweets"),

  getUserTweets: (userId) =>
    api.get(`/tweets/user/${userId}`),

  createTweet: (data) =>
    api.post("/tweets", data),

  updateTweet: (tweetId, data) =>
    api.patch(`/tweets/${tweetId}`, data),

  deleteTweet: (tweetId) =>
    api.delete(`/tweets/${tweetId}`),
};