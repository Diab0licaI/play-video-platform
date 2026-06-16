import axios from "axios";

const BASE = "http://localhost:8000/api/v1/watch-history";

export const addToWatchHistory = (videoId) =>
  axios.post(`${BASE}/${videoId}`, {}, { withCredentials: true });

export const getWatchHistory = (page = 1, limit = 20) =>
  axios.get(BASE, { params: { page, limit }, withCredentials: true });

export const removeFromWatchHistory = (videoId) =>
  axios.delete(`${BASE}/${videoId}`, { withCredentials: true });

export const clearWatchHistory = () =>
  axios.delete(BASE, { withCredentials: true });