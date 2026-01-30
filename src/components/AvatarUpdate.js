import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AvatarUpdate() {
  const { updateAvatar } = useAuth();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Validate image URL before sending
  function isValidImageUrl(url) {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!url || !isValidImageUrl(url)) {
      setError(
        "Please enter a valid direct image URL ending with .jpg, .png, .gif, or .webp",
      );
      return;
    }

    try {
      await updateAvatar(url);
      setSuccess("Avatar updated successfully!");
      setUrl(""); // clear input
    } catch (err) {
      console.error("Avatar update failed:", err.message);
      setError(
        "Failed to update avatar. Make sure the image URL is publicly accessible.",
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 border rounded mt-6"
    >
      <h2 className="text-2xl font-bold mb-4">Update Avatar</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {success && <p className="text-green-600 mb-2">{success}</p>}

      <label className="block mb-4">
        Avatar Image URL
        <input
          type="url"
          className="border w-full p-2"
          placeholder="https://example.com/avatar.png"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
      </label>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Update Avatar
      </button>
    </form>
  );
}
