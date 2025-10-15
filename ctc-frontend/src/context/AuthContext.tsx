import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { toast } from "sonner";
import api from "../lib/api";

export const AuthContext = React.createContext({
  user: null,
  role: null,
  login: async (email, password) => {},
  register: async (data) => {},
  logout: () => {},
  isLoading: false,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setRole(decoded.role || "student");
      } catch {
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/login/", { email, password });
      const { access, refresh } = res.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      const decoded = jwtDecode(access);
      setUser(decoded);
      setRole(decoded.role || "student");
      toast.success("Login successful!");
      return decoded;
    } catch (err) {
      toast.error("Invalid credentials");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data) => {
    setIsLoading(true);
    try {
      await api.post("/api/auth/register/", data);
      toast.success("Registration successful! Please log in.");
      return true;
    } catch (err) {
      toast.error("Registration failed");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
    setRole(null);
    toast.success("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{ user, role, login, register, logout, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
