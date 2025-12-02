import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [venueManager, setVenueManager] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    if (!email.endsWith("@stud.noroff.no")) {
      return setMessage("Only @stud.noroff.no emails may register.");
    }

    try {
      const response = await fetch("https://v2.api.noroff.dev/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          venueManager,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return setMessage(data.errors?.[0]?.message || "Registration failed");
      }

      setMessage("Account created successfully! You can now log in.");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong.");
    }
  }

  return (
    <div className="p-4 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Register</h1>

      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Full name"
          className="border p-2 w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email (@stud.noroff.no)"
          className="border p-2 w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="border p-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={venueManager}
            onChange={(e) => setVenueManager(e.target.checked)}
          />
          Register as Venue Manager
        </label>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>

      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
