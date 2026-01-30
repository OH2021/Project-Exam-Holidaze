import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null,
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  const apiKey = "82ecacb4-ce97-47c0-aadb-6a7321aa158b";

  async function login(email, password) {
    const res = await fetch("https://v2.api.noroff.dev/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message);

    setToken(data.data.accessToken);
    localStorage.setItem("token", data.data.accessToken);

    await fetchProfile(data.data.name, data.data.accessToken);
  }

  async function fetchProfile(name, accessToken = token) {
    const res = await fetch(
      `https://v2.api.noroff.dev/holidaze/profiles/${name}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Noroff-API-Key": apiKey,
        },
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error("Failed to load profile");

    setUser(data.data);
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  async function logout() {
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
          "X-Noroff-API-Key": apiKey,
        },
        body: JSON.stringify({ avatar: { url } }),
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.errors?.[0]?.message);

    setUser(data.data);
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        apiKey,
        login,
        logout,
        updateAvatar,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
