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
      console.log("Attempting login with:", { email });
      const response = await loginUser({ email, password });
      console.log("Login response:", response.data);

      const { data } = response;
      setUser({ email: data.email, role: data.role, id: data._id });
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ email: data.email, role: data.role, id: data._id })
      );

      return true;
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage = err.response?.data?.error || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, role) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Attempting registration with:", { email, role });
      const response = await registerUser({ email, password, role });
      console.log("Registration response:", response.data);

      const { data } = response;
      setUser({ email: data.email, role: data.role, id: data._id });
      setIsAuthenticated(true);
      localStorage.setItem("token", data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({ email: data.email, role: data.role, id: data._id })
      );

      return true;
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage = err.response?.data?.error || "Registration failed";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        isAuthenticated,
        login,
        logout,
        register,
        setError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
