import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthCtx = createContext({ user: null, loading: true, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("brevitus_admin_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => { localStorage.removeItem("brevitus_admin_token"); setUser(null); })
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const { data } = await api.post("/auth/login", { username, password });
    localStorage.setItem("brevitus_admin_token", data.access_token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    localStorage.removeItem("brevitus_admin_token");
    setUser(null);
    window.location.href = "/admin/login";
  }

  return <AuthCtx.Provider value={{ user, loading, login, logout }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
