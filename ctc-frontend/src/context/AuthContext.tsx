import React, { useState, useEffect } from "react";
import { jwtDecode, type JwtPayload } from "jwt-decode";
import { toast } from "sonner";
import api from "../lib/api";

interface User extends JwtPayload {
  id: string;
  email: string;
  role: string;
  username?: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  login: (email: string, password: string) => Promise<User>;
  register: (data: any) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  role: null,
  login: async (_email: string, _password: string) => ({} as User),
  register: async (_data: any) => false,
  logout: () => {},
  isLoading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode<User>(token);
        setUser(decoded);
        setRole(decoded.role || "student");
      } catch {
        localStorage.removeItem("access_token");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setIsLoading(true);
    try {
      const res = await api.post("/api/auth/login/", { email, password });
      const { access, refresh } = res.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      const decoded = jwtDecode<User>(access);
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

  const register = async (data: any): Promise<boolean> => {
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
