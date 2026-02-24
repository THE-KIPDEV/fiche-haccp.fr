import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Tarifs – Abonnement gestion HACCP restaurant à 20€/mois",
  description:
    "Fiches HACCP PDF gratuites après inscription. Abonnement gestion complète à 20€/mois : employés, tâches HACCP, traçabilité, suivi en temps réel.",
  alternates: { canonical: "/tarifs" },
};

const FREE_FEATURES = [
  "Téléchargement de toutes les fiches HACCP en PDF",
  "8 fiches conformes à la réglementation",
  "Mises à jour des documents",
  "Format prêt à imprimer",
];

const PRO_FEATURES = [
  "Tout le plan gratuit inclus",
  "Gestion des employés (ajout, rôles, affectation)",
  "Création et suivi des tâches HACCP",
  "Traçabilité complète avec historique",
  "Enregistrement des relevés de température",
  "Fiches de non-conformité numériques",
  "Export des données et rapports",
  "Tableau de bord en temps réel",
  "Support prioritaire",
];

export default function TarifsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Abonnement Fiche HACCP Pro",
    description: "Gestion complète HACCP pour restaurant : employés, tâches, traçabilité.",
    offers: {
      "@type": "Offer",
      price: "20.00",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      priceValidUntil: "2026-12-31",
      url: "https://fiche-haccp.fr/tarifs",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Tarifs" }]} />

        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
            Des tarifs simples et transparents
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Les fiches HACCP en PDF sont gratuites. L&apos;abonnement Pro vous donne accès à la gestion
            complète de votre HACCP en ligne.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free plan */}
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Gratuit</h2>
            <p className="text-gray-500 mb-6">Pour télécharger les fiches HACCP</p>
            <p className="text-4xl font-extrabold mb-1">0€</p>
            <p className="text-sm text-gray-500 mb-8">pour toujours</p>
            <Link
              href="/inscription"
              className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors mb-8"
            >
              S&apos;inscrire gratuitement
            </Link>
            <ul className="space-y-3">
              {FREE_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-success mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro plan */}
          <div className="bg-white border-2 border-primary rounded-2xl p-8 relative shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
              Recommandé
            </div>
            <h2 className="text-xl font-bold mb-2">Pro</h2>
            <p className="text-gray-500 mb-6">Gestion HACCP complète</p>
            <p className="text-4xl font-extrabold mb-1 text-primary">20€</p>
            <p className="text-sm text-gray-500 mb-8">par mois · sans engagement</p>
            <Link
              href="/inscription"
              className="block text-center bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-8"
            >
              Commencer maintenant
            </Link>
            <ul className="space-y-3">
              {PRO_FEATURES.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-success mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ tarifs */}
        <section className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Questions sur les tarifs</h2>
          <div className="space-y-4">
            <details className="bg-white border border-gray-200 rounded-xl p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Puis-je télécharger les fiches sans payer ?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-3 text-sm">
                Oui ! Toutes les fiches HACCP au format PDF sont téléchargeables gratuitement après inscription.
                Aucune carte bancaire n&apos;est nécessaire pour le plan gratuit.
              </p>
            </details>
            <details className="bg-white border border-gray-200 rounded-xl p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Y a-t-il un engagement ?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-3 text-sm">
                Non, l&apos;abonnement Pro est sans engagement. Vous pouvez annuler à tout moment depuis votre
                espace personnel. L&apos;accès reste actif jusqu&apos;à la fin de la période payée.
              </p>
            </details>
            <details className="bg-white border border-gray-200 rounded-xl p-5 group">
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                Quels moyens de paiement acceptez-vous ?
                <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-gray-600 mt-3 text-sm">
                Nous acceptons les cartes bancaires (Visa, Mastercard, CB) via Stripe, notre partenaire
                de paiement sécurisé. Toutes les transactions sont chiffrées.
              </p>
            </details>
          </div>
        </section>
      </main>
    </>
  );
}
