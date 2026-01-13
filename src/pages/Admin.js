import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const { user, updateAvatar } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState("");

  async function handleAvatarUpdate() {
    await updateAvatar(avatarUrl);
    setAvatarUrl("");
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Profile</h1>

      {user?.avatar?.url && (
        <img
          src={user.avatar.url}
          alt="Avatar"
          className="w-24 h-24 rounded-full mb-3"
        />
      )}

      <input
        className="border p-2 w-full mb-2"
        placeholder="New avatar image URL"
        value={avatarUrl}
        onChange={(e) => setAvatarUrl(e.target.value)}
      />

      <button
        onClick={handleAvatarUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Update Avatar
      </button>
    </div>
  );
}
