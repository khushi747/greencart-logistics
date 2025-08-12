import React, { createContext, useState, useContext, useEffect } from "react";
import { loginUser, registerUser } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => !!localStorage.getItem("token")
  );

  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await loginUser({ email, password });
      setUser({ email: data.email, role: data.role });
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ email: data.email, role: data.role })
      );
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
      setLoading(false);
      return false;
    }
  };

  const register = async (email, password, role) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await registerUser({ email, password, role });
      setUser({ email: data.email, role: data.role });
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ email: data.email, role: data.role })
      );
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, error, isAuthenticated, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};
