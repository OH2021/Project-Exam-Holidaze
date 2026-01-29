import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  let storedUser = null;

  try {
    const rawUser = localStorage.getItem("user");
    storedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    localStorage.removeItem("user");
  }

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [apiKey] = useState("82ecacb4-ce97-47c0-aadb-6a7321aa158b"); // hardcoded API key

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
    if (!user || !token) return;

    const res = await fetch(
      `https://v2.api.noroff.dev/holidaze/profiles/${user.name}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({ avatar: { url } }),
      },
    );

    const data = await res.json();
    setUser(data.data);
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  return (
    <AuthContext.Provider
      value={{ user, token, apiKey, login, logout, updateAvatar, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
