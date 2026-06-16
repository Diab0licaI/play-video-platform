import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { authApi } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  const login = async (data) => {
    const response = await authApi.login(data);

    const userData = response?.data?.user;
    const accessToken = response?.data?.accessToken;
    const refreshToken = response?.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }
    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }

    setUser(userData);

    return response;
  };

  const register = async (formData) => {
    const response = await authApi.register(formData);
    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  };

  const refreshLogin = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        setLoading(false);
        return;
      }

      const response = await authApi.refreshToken(refreshToken);

      const accessToken = response?.data?.accessToken;
      const newRefreshToken = response?.data?.refreshToken;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (newRefreshToken) {
        localStorage.setItem("refreshToken", newRefreshToken);
      }

      const userResponse = await authApi.getCurrentUser();
      console.log("CURRENT USER RESPONSE:", userResponse);

      // getCurrentUser returns response.data (from authApi)
      // so actual user is at userResponse.data
      setUser(userResponse?.data?.data);

    } catch (error) {
      console.error("Session restore failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshLogin();
  }, []);

  const value = {
    user,
    setUser,
    loading,
    login,
    logout,
    register,
    isAuthenticated,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};