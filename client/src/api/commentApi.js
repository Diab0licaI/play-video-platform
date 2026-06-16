import api from "./axiosInstance";

export const commentApi = {
  getVideoComments: (videoId) =>
    api.get(`/comments/${videoId}`),

  addComment: (videoId, data) =>
    api.post(`/comments/${videoId}`, data),

  updateComment: (commentId, data) =>
    api.patch(`/comments/c/${commentId}`, data),

  deleteComment: (commentId) =>
    api.delete(`/comments/c/${commentId}`),
};