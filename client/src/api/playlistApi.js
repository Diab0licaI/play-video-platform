import api from "./axiosInstance";

export const playlistApi = {
  createPlaylist: (data) =>
    api.post("/playlists", data),

  getUserPlaylists: (userId) =>
    api.get(`/playlists/user/${userId}`),

  getPlaylistById: (playlistId) =>
    api.get(`/playlists/${playlistId}`),

  addVideoToPlaylist: (playlistId, videoId) =>
    api.patch(`/playlists/add/${videoId}/${playlistId}`),

  removeVideoFromPlaylist: (playlistId, videoId) =>
    api.patch(`/playlists/remove/${videoId}/${playlistId}`),

  deletePlaylist: (playlistId) =>
    api.delete(`/playlists/${playlistId}`),

  updatePlaylist: (playlistId, data) =>
    api.patch(`/playlists/${playlistId}`, data),
};