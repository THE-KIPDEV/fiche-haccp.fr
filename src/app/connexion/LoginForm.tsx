"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      email: form.get("email") as string,
      password: form.get("password") as string,
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      router.push("/tableau-de-bord");
    } catch {
      setError("Erreur de connexion. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
      {error && (
        <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg">{error}</div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Adresse email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="jean@restaurant.fr"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="Votre mot de passe"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Connexion..." : "Se connecter"}
      </button>
    </form>
  );
}
