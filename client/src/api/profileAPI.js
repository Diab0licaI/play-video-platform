import axios from "axios";

const BASE = "http://localhost:8000/api/v1/users";
const config = { withCredentials: true };

export const getCurrentUser = () =>
  axios.get(`${BASE}/current-user`, config);

export const updateAccountDetails = (data) =>
  axios.patch(`${BASE}/update-account`, data, config);

export const updateAvatar = (file) => {
  const form = new FormData();
  form.append("avatar", file);
  return axios.patch(`${BASE}/update-avatar`, form, config);
};

export const updateCoverImage = (file) => {
  const form = new FormData();
  form.append("coverImage", file);
  return axios.patch(`${BASE}/update-cover`, form, config);
};

export const changePassword = (data) =>
  axios.post(`${BASE}/change-password`, data, config);