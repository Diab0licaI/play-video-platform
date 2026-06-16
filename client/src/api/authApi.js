import axiosInstance from "./axiosInstance";

export const authApi = {
  register: async (formData) => {
    const response = await axiosInstance.post(
      "/users/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  login: async (credentials) => {
    const response = await axiosInstance.post(
      "/users/login",
      credentials
    );
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/users/logout");
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const response = await axiosInstance.post(
      "/users/refresh-token",
      { refreshToken }
    );
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get("/users/current-user");
    return response.data;
  },
};