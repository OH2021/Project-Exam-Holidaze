import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token"));

  async function login(email, password) {
    const res = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.errors?.[0]?.message || "Login failed");

    setUser(data.data);
    setToken(data.data.accessToken);

    localStorage.setItem("user", JSON.stringify(data.data));
    localStorage.setItem("token", data.data.accessToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.clear();
  }

  async function updateAvatar(url) {
    const res = await fetch(
      `https://v2.api.noroff.dev/holidaze/profiles/${user.name}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          avatar: { url },
        }),
      }
    );

    const data = await res.json();
    setUser(data.data);
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateAvatar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
