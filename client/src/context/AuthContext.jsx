import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getMe, login as apiLogin, register as apiRegister, logout as apiLogout, updateProfile as apiUpdateProfile } from "../lib/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await getMe();
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (username, email, password) => {
    const data = await apiRegister(username, email, password);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } finally {
      setUser(null);
    }
  }, []);

  const updateUserProfile = useCallback(async (profileData) => {
    const data = await apiUpdateProfile(profileData);
    setUser(data.user);
    return data.user;
  }, []);

  const value = {
    user,
    role: user?.role || "guest",
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    register,
    logout,
    updateUserProfile,
    refreshUser: fetchCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
