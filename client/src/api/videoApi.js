import api from "./axiosInstance";

export const videoApi = {
  searchVideos: (query) =>
  api.get(`/videos/search/${query}`),
  
  getAllVideos: (search = "") =>
    api.get(`/videos${search ? `?search=${encodeURIComponent(search)}` : ""}`),

  getVideoById: (id) =>
    api.get(`/videos/${id}`),

  uploadVideo: (formData) =>
    api.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  updateVideo: (videoId, formData) =>
    api.patch(`/videos/${videoId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  deleteVideo: (videoId) =>
    api.delete(`/videos/${videoId}`),

  togglePublishStatus: (videoId) =>
    api.patch(`/videos/toggle/publish/${videoId}`),
};