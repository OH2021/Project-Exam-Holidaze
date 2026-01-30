import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateAvatar } = useAuth();
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  if (!user) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    try {
      await updateAvatar(url);
      setMessage("Avatar updated successfully");
      setUrl("");
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 border rounded mt-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      <img
        src={user.avatar?.url}
        alt="Avatar"
        className="w-32 h-32 rounded-full mb-2"
      />

      <p className="font-semibold">{user.name}</p>
      <p className="text-gray-600">{user.email}</p>

      {/* Pending venue manager */}
      {!user.venueManager && (
        <p className="text-red-600 mt-4">
          Your venue manager account is pending approval.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="New avatar URL"
          className="border w-full p-2 mb-2"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Update Avatar
        </button>
      </form>

      {message && <p className="mt-2">{message}</p>}
    </div>
  );
}
