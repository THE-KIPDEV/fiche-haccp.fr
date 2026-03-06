"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function track(name: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as any).kipstats?.event) {
    (window as any).kipstats.event(name, data || {});
  }
}

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const data = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      restaurant_name: form.get("restaurant_name") as string,
    };

    if (!data.name || !data.email || !data.password) {
      setError("Veuillez remplir tous les champs obligatoires.");
      setLoading(false);
      return;
    }

    if (data.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Erreur lors de l'inscription.");
        setLoading(false);
        return;
      }

      track("signup", {});
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
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom complet <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="Jean Dupont"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Adresse email <span className="text-danger">*</span>
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
        <label htmlFor="restaurant_name" className="block text-sm font-medium text-gray-700 mb-1">
          Nom du restaurant
        </label>
        <input
          type="text"
          id="restaurant_name"
          name="restaurant_name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="Le Bistrot de Jean"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Mot de passe <span className="text-danger">*</span>
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={8}
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          placeholder="8 caractères minimum"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-primary-light text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
      >
        {loading ? "Inscription en cours..." : "S'inscrire gratuitement"}
      </button>

      <p className="text-xs text-gray-500 text-center">
        En vous inscrivant, vous acceptez nos{" "}
        <a href="/mentions-legales" className="text-primary hover:underline">mentions légales</a>{" "}
        et notre{" "}
        <a href="/politique-confidentialite" className="text-primary hover:underline">politique de confidentialité</a>.
      </p>
    </form>
  );
}
