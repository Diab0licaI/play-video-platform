import api from "./axiosInstance";

export const userApi = {
  getChannel: (username) =>
    api.get(`/users/channel/${username}`),
};