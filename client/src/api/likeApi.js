import api from "./axiosInstance";

export const likeApi = {
  toggleVideoLike: (videoId) =>
    api.post(`/likes/toggle/v/${videoId}`),

  toggleCommentLike: (commentId) =>
    api.post(`/likes/toggle/c/${commentId}`),

  getLikedVideos: () =>
    api.get("/likes/videos"),

  getLikeStatus: (videoId) =>
    api.get(`/likes/v/${videoId}`),
};