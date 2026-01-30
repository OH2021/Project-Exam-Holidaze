import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  let storedUser = null;
  let storedToken = null;

  try {
    const rawUser = localStorage.getItem("user");
    storedUser = rawUser ? JSON.parse(rawUser) : null;
  } catch {
    localStorage.removeItem("user");
    storedUser = null;
  }

  try {
    storedToken = localStorage.getItem("token");
  } catch {
    storedToken = null;
  }

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [apiKey] = useState("82ecacb4-ce97-47c0-aadb-6a7321aa158b");

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

  async function register({ name, email, password, venueManager = false }) {
    const res = await fetch("https://v2.api.noroff.dev/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, venueManager }),
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.errors?.[0]?.message || "Registration failed");

    setUser(data.data);
    localStorage.setItem("user", JSON.stringify(data.data));

    if (data.data?.accessToken) {
      setToken(data.data.accessToken);
      localStorage.setItem("token", data.data.accessToken);
    }

    return data;
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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
    if (!res.ok) throw new Error(data.errors?.[0]?.message || "Update failed");

    setUser(data.data);
    localStorage.setItem("user", JSON.stringify(data.data));
  }

  // NEW: helper to check if venue manager is pending
  function isVenueManagerPending() {
    return user && user.venueManagerRequested && !user.venueManager;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        apiKey,
        setUser,
        setToken,
        login,
        register,
        logout,
        updateAvatar,
        isVenueManagerPending,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
