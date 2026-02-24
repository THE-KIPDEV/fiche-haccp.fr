"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Lock } from "lucide-react";

interface UserInfo {
  subscription_status: string;
}

export default function AbonnementPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderSaving, setReminderSaving] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) { router.push("/connexion"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setUser(data.user);
        if (data.user.subscription_status === "active") {
          fetch("/api/auth/preferences").then(r => r.ok ? r.json() : null).then(d => {
            if (d) setReminderEnabled(d.reminder_enabled);
          }).catch(() => {});
        }
      })
      .catch(() => router.push("/connexion"))
      .finally(() => setLoading(false));
  }, [router]);

  async function toggleReminder() {
    setReminderSaving(true);
    const newValue = !reminderEnabled;
    try {
      const res = await fetch("/api/auth/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminder_enabled: newValue }),
      });
      if (res.ok) setReminderEnabled(newValue);
    } catch { /* ignore */ }
    setReminderSaving(false);
  }

  async function handleSubscribe() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la création du paiement.");
      }
    } catch {
      alert("Erreur de connexion.");
    }
    setCheckoutLoading(false);
  }

  async function handleManage() {
    setPortalLoading(true);
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Erreur lors de l'accès au portail.");
      }
    } catch {
      alert("Erreur de connexion.");
    }
    setPortalLoading(false);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  const isPro = user?.subscription_status === "active";

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Abonnement</h1>

      {isPro ? (
        <div className="bg-white rounded-2xl border-2 border-success p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-success/10 text-success text-sm font-bold px-3 py-1 rounded-full">Actif</span>
            <h2 className="text-xl font-bold">Plan Pro</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Vous avez accès à toutes les fonctionnalités : gestion des employés, tâches HACCP,
            traçabilité et suivi en temps réel.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleManage}
              disabled={portalLoading}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-6 py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {portalLoading ? "Chargement..." : "Gérer mon abonnement"}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Gérez votre abonnement, mettez à jour votre moyen de paiement ou annulez via le portail Stripe sécurisé.
          </p>

          {/* Reminder toggle */}
          <div className="border-t border-gray-200 mt-6 pt-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Rappels email quotidiens</p>
                  <p className="text-xs text-gray-500">Recevez un email si des taches HACCP sont en retard</p>
                </div>
              </div>
              <button
                onClick={toggleReminder}
                disabled={reminderSaving}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${reminderEnabled ? "bg-primary" : "bg-gray-300"}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${reminderEnabled ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border-2 border-primary p-8">
          <h2 className="text-xl font-bold mb-2">Passez au plan Pro</h2>
          <p className="text-4xl font-extrabold text-primary mb-1">20€<span className="text-lg font-normal text-gray-500">/mois</span></p>
          <p className="text-sm text-gray-500 mb-6">Sans engagement · Annulation à tout moment</p>

          <ul className="space-y-2 mb-8">
            {[
              "Gestion des employés",
              "Création et suivi des tâches HACCP",
              "Traçabilité avec historique complet",
              "Relevés de température numériques",
              "Fiches de non-conformité",
              "Export des données",
              "Tableau de bord en temps réel",
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-sm">
                <span className="text-success">✓</span> {f}
              </li>
            ))}
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={checkoutLoading}
            className="w-full bg-primary hover:bg-primary-light text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {checkoutLoading ? "Redirection vers le paiement..." : "S'abonner – 20€/mois"}
          </button>

          <div className="flex items-center justify-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Paiement securise Stripe</span>
            <span>Visa, Mastercard, CB</span>
          </div>
        </div>
      )}
    </div>
  );
}
