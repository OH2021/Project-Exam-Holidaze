import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, updateAvatar } = useAuth();
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  if (!user)
    return <p className="p-4">You must be logged in to see your profile.</p>;

  const handleAvatarUpdate = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!url) {
      setMessage("Please enter a valid URL.");
      return;
    }

    try {
      await updateAvatar(url);
      setMessage("Avatar updated successfully!");
      setUrl("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to update avatar.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded mt-6">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      {/* Current avatar */}
      <div className="mb-4">
        {user.avatar?.url ? (
          <img
            src={user.avatar.url}
            alt={user.avatar.alt || "Avatar"}
            className="w-32 h-32 rounded-full mb-2"
          />
        ) : (
          <div className="w-32 h-32 bg-gray-300 rounded-full mb-2 flex items-center justify-center">
            No Avatar
          </div>
        )}
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>

      {/* Pending venue manager approval */}
      {user.venueManagerRequested && !user.venueManager && (
        <p className="text-red-600 mb-4">
          Your venue manager account is pending approval.
        </p>
      )}

      {/* Update avatar form */}
      <form onSubmit={handleAvatarUpdate} className="mb-4">
        <label className="block mb-2 font-semibold">Update Avatar URL:</label>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="border w-full p-2 mb-2"
          placeholder="Enter new avatar URL"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Update Avatar
        </button>
      </form>

      {message && <p className="text-green-600">{message}</p>}
    </div>
  );
}
