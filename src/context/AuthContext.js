import React, { createContext, useContext, useEffect, useState } from "react";

const API = "https://v2.api.noroff.dev";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() =>
    localStorage.getItem("holidaze_token")
  );
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("holidaze_user");
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem("holidaze_token", token);
    } else {
      localStorage.removeItem("holidaze_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("holidaze_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("holidaze_user");
    }
  }, [user]);

  const register = async ({ name, email, password, venueManager }) => {
    const res = await fetch(`${API}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, venueManager }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Registration failed");
    // API may return token or just success. We return json to caller.
    return json;
  };

  const login = async ({ email, password }) => {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.message || "Login failed");
    // API typically returns { accessToken: "...", profile: {...} } or similar
    // We'll try to extract token and username/profile if available
    const accessToken = json?.accessToken || json?.token || json?.jwt || null;
    // Some APIs return user info; otherwise store email as fallback
    const profile = json?.profile ||
      json?.user || { name: json?.name || email };
    setToken(accessToken);
    setUser(profile);
    return { accessToken, profile, raw: json };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const getAuthHeader = () =>
    token ? { Authorization: `Bearer ${token}` } : {};

  return (
    <AuthContext.Provider
      value={{ token, user, register, login, logout, getAuthHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
