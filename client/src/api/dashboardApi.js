// src/api/dashboardApi.js
import api from "./axiosInstance";

export const dashboardApi = {
  getStats: () =>
    api.get("/dashboard/stats"),

  getVideos: () =>
    api.get("/dashboard/videos"),
};