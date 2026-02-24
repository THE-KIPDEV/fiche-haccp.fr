import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description: "Politique de confidentialité du site fiche-haccp.fr. Protection des données personnelles conformément au RGPD.",
  alternates: { canonical: "/politique-confidentialite" },
};

export default function PolitiqueConfidentialitePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Politique de confidentialité" }]} />

      <h1 className="text-3xl font-extrabold mb-8">Politique de confidentialité</h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <p className="text-gray-700">
          Dernière mise à jour : février 2026. Cette politique décrit comment fiche-haccp.fr (édité par KIPDEV)
          collecte, utilise et protège vos données personnelles conformément au Règlement Général sur la
          Protection des Données (RGPD — UE 2016/679).
        </p>

        <section>
          <h2 className="text-xl font-bold mb-3">1. Responsable du traitement</h2>
          <p className="text-gray-700">
            KIPDEV — SIREN 884 120 890<br />
            Bordeaux, France<br />
            Contact : yohann@kipdev.io
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">2. Données collectées</h2>
          <p className="text-gray-700">Nous collectons les données suivantes :</p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Inscription :</strong> nom, adresse email, nom du restaurant, mot de passe (chiffré)</li>
            <li><strong>Abonnement :</strong> données de facturation via Stripe (nous ne stockons pas vos données bancaires)</li>
            <li><strong>Utilisation :</strong> données de navigation (pages visitées, téléchargements), données HACCP saisies (employés, tâches, relevés)</li>
            <li><strong>Technique :</strong> adresse IP, type de navigateur, système d&apos;exploitation</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">3. Finalités du traitement</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Gestion de votre compte et accès aux services</li>
            <li>Téléchargement des fiches HACCP</li>
            <li>Gestion de l&apos;abonnement et facturation</li>
            <li>Envoi d&apos;emails de service (confirmation, notifications)</li>
            <li>Amélioration de nos services</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Base légale : exécution du contrat (article 6.1.b du RGPD) et intérêt légitime (article 6.1.f).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">4. Durée de conservation</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Données de compte : pendant la durée de l&apos;inscription + 3 ans après suppression</li>
            <li>Données de facturation : 10 ans (obligation comptable)</li>
            <li>Données HACCP saisies : pendant la durée de l&apos;abonnement + 5 ans (conformité HACCP)</li>
            <li>Logs techniques : 12 mois</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">5. Sous-traitants</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Railway</strong> (hébergement) — États-Unis — Clauses contractuelles types</li>
            <li><strong>Stripe</strong> (paiement) — États-Unis — Certifié PCI DSS, Privacy Shield</li>
            <li><strong>Mailjet</strong> (emails) — France — Conforme RGPD</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">6. Vos droits</h2>
          <p className="text-gray-700">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li><strong>Accès :</strong> obtenir une copie de vos données</li>
            <li><strong>Rectification :</strong> corriger vos données inexactes</li>
            <li><strong>Suppression :</strong> demander l&apos;effacement de vos données</li>
            <li><strong>Portabilité :</strong> recevoir vos données dans un format structuré</li>
            <li><strong>Opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong>Limitation :</strong> demander la restriction du traitement</li>
          </ul>
          <p className="text-gray-700 mt-2">
            Pour exercer vos droits, contactez-nous à : <strong>yohann@kipdev.io</strong>.
            Nous répondrons dans un délai de 30 jours.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Cookies</h2>
          <p className="text-gray-700">
            Ce site utilise uniquement un cookie d&apos;authentification technique (httpOnly, sécurisé)
            nécessaire au fonctionnement du service. Aucun cookie de tracking, publicitaire ou analytique
            tiers n&apos;est utilisé. Ce cookie étant strictement nécessaire, il ne requiert pas de
            consentement préalable (article 82 de la loi Informatique et Libertés).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">8. Sécurité</h2>
          <p className="text-gray-700">
            Nous mettons en œuvre des mesures techniques et organisationnelles pour protéger vos données :
            chiffrement des mots de passe (bcrypt), connexion HTTPS, tokens JWT sécurisés, accès
            restreint aux bases de données, paiements via Stripe (PCI DSS Level 1).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">9. Réclamation</h2>
          <p className="text-gray-700">
            Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation
            auprès de la CNIL : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.cnil.fr</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
