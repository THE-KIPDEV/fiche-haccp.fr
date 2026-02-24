"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Lock } from "lucide-react";

interface UserInfo {
  subscription_status: string;
  billing_name?: string;
  billing_address?: string;
  billing_siret?: string;
  billing_tva_number?: string;
}

interface InvoiceInfo {
  id: number;
  invoice_number: string;
  description: string;
  amount_cents: number;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}

export default function AbonnementPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [portalLoading, setPortalLoading] = useState(false);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderSaving, setReminderSaving] = useState(false);
  const [invoices, setInvoices] = useState<InvoiceInfo[]>([]);
  const [billingName, setBillingName] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingSiret, setBillingSiret] = useState("");
  const [billingTvaNumber, setBillingTvaNumber] = useState("");
  const [billingSaving, setBillingSaving] = useState(false);
  const [billingSaved, setBillingSaved] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) { router.push("/connexion"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setUser(data.user);
        if (data.user.billing_name) setBillingName(data.user.billing_name);
        if (data.user.billing_address) setBillingAddress(data.user.billing_address);
        if (data.user.billing_siret) setBillingSiret(data.user.billing_siret);
        if (data.user.billing_tva_number) setBillingTvaNumber(data.user.billing_tva_number);
        if (data.user.subscription_status === "active") {
          fetch("/api/auth/preferences").then(r => r.ok ? r.json() : null).then(d => {
            if (d) setReminderEnabled(d.reminder_enabled);
          }).catch(() => {});
          fetch("/api/invoices").then(r => r.ok ? r.json() : null).then(d => {
            if (d?.invoices) setInvoices(d.invoices);
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

  async function handleSaveBilling() {
    setBillingSaving(true);
    setBillingSaved(false);
    try {
      const res = await fetch("/api/billing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ billingName, billingAddress, billingSiret, billingTvaNumber }),
      });
      if (res.ok) {
        setBillingSaved(true);
        setTimeout(() => setBillingSaved(false), 3000);
      }
    } catch {
      alert("Erreur lors de la sauvegarde.");
    } finally {
      setBillingSaving(false);
    }
  }

  async function handleDownloadInvoice(inv: InvoiceInfo) {
    try {
      const res = await fetch(`/api/invoices/${inv.id}`);
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `facture-${inv.invoice_number}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors du telechargement de la facture.");
    }
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

      {/* Billing info section */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-4">Informations de facturation</h2>
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <p className="text-sm text-gray-500 mb-4">
            Ces informations apparaitront sur vos factures. Vous pouvez les modifier et re-telecharger vos factures.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom / Raison sociale</label>
              <input type="text" value={billingName} onChange={(e) => setBillingName(e.target.value)}
                placeholder="Ex : SARL Mon Restaurant"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input type="text" value={billingAddress} onChange={(e) => setBillingAddress(e.target.value)}
                placeholder="Ex : 12 Rue de la Paix, 75002 Paris"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SIRET <span className="text-gray-400 font-normal">(optionnel)</span></label>
              <input type="text" value={billingSiret} onChange={(e) => setBillingSiret(e.target.value)}
                placeholder="Ex : 123 456 789 00012"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">N° TVA <span className="text-gray-400 font-normal">(optionnel)</span></label>
              <input type="text" value={billingTvaNumber} onChange={(e) => setBillingTvaNumber(e.target.value)}
                placeholder="Ex : FR12345678901"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <button onClick={handleSaveBilling} disabled={billingSaving}
              className="bg-primary hover:bg-primary-light text-white font-semibold px-5 py-2 rounded-lg transition-colors text-sm disabled:opacity-50">
              {billingSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
            {billingSaved && <span className="text-sm text-green-600 font-medium">Informations sauvegardees</span>}
          </div>
        </div>
      </div>

      {/* Invoices section */}
      {invoices.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold mb-4">Mes factures</h2>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">N° Facture</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Date</th>
                  <th className="text-left px-5 py-3 font-semibold text-gray-600">Montant</th>
                  <th className="text-right px-5 py-3 font-semibold text-gray-600"></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv.id} className="border-b border-gray-100 last:border-0">
                    <td className="px-5 py-3 text-gray-900 font-medium">{inv.invoice_number}</td>
                    <td className="px-5 py-3 text-gray-500">{new Date(inv.created_at).toLocaleDateString("fr-FR")}</td>
                    <td className="px-5 py-3 text-gray-900">{(inv.amount_cents / 100).toFixed(2).replace(".", ",")} €</td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => handleDownloadInvoice(inv)} className="text-primary hover:underline font-medium">
                        Telecharger
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
