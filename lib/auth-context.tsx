"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  nombre: string;
  mail: string;
  isAdmin: boolean;
} | null;

type AuthCtx = {
  user: User;
  loading: boolean;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, logout: async () => {}, refresh: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  useEffect(() => { refresh(); }, []);

  return <AuthContext.Provider value={{ user, loading, logout, refresh }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
