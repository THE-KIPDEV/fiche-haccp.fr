import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "FAQ – Questions fréquentes sur le HACCP en restauration",
  description:
    "Retrouvez les réponses à toutes vos questions sur le HACCP en restauration : obligations, fiches, contrôles, sanctions, Plan de Maîtrise Sanitaire.",
  alternates: { canonical: "/faq" },
};

const FAQ_SECTIONS = [
  {
    title: "HACCP et réglementation",
    items: [
      {
        q: "Qu'est-ce que le HACCP ?",
        a: "Le HACCP (Hazard Analysis Critical Control Point) est une méthode systématique de maîtrise de la sécurité sanitaire des aliments. Née dans les années 1960 pour l'industrie spatiale américaine (NASA), elle est devenue obligatoire en restauration en Europe avec le règlement CE 852/2004. Elle repose sur 7 principes : analyser les dangers, déterminer les points critiques (CCP), fixer les seuils critiques, mettre en place un système de surveillance, définir les actions correctives, vérifier l'efficacité et documenter le tout.",
      },
      {
        q: "Le HACCP est-il obligatoire pour tous les restaurants ?",
        a: "Oui. Depuis le règlement CE 852/2004, tous les exploitants du secteur alimentaire doivent mettre en place des procédures fondées sur les principes HACCP. Cela concerne les restaurants traditionnels, les fast-foods, les brasseries, les traiteurs, les hôtels-restaurants, les cantines, les food-trucks et tout établissement servant des denrées alimentaires.",
      },
      {
        q: "Qu'est-ce que le Plan de Maîtrise Sanitaire (PMS) ?",
        a: "Le PMS est le document clé de tout restaurant. Il regroupe : les bonnes pratiques d'hygiène (BPH), le plan HACCP avec les fiches de contrôle, le plan de nettoyage et désinfection, le plan de lutte contre les nuisibles, les procédures de traçabilité, la gestion des non-conformités. C'est ce document que la DDPP demande en priorité lors d'un contrôle.",
      },
      {
        q: "Quelle est la différence entre HACCP et hygiène alimentaire ?",
        a: "L'hygiène alimentaire est un concept global regroupant toutes les mesures garantissant la salubrité des aliments (propreté, chaîne du froid, etc.). Le HACCP est une méthode spécifique et structurée au sein de l'hygiène alimentaire : il identifie les dangers, définit les points critiques et organise leur surveillance. L'hygiène est la base, le HACCP est l'outil de maîtrise.",
      },
    ],
  },
  {
    title: "Fiches et documents HACCP",
    items: [
      {
        q: "Quelles fiches HACCP sont obligatoires en restaurant ?",
        a: "Les fiches indispensables sont : la fiche de contrôle des températures à réception, la fiche de relevé des températures de stockage (chambres froides), le plan de nettoyage et désinfection, la fiche de traçabilité des produits, le protocole de lavage des mains, la fiche de gestion des allergènes, la fiche de non-conformité, et la fiche de suivi du refroidissement rapide si vous pratiquez la liaison froide.",
      },
      {
        q: "Combien de temps conserver les fiches HACCP ?",
        a: "Les fiches HACCP et les documents de traçabilité doivent être conservés pendant au moins 5 ans. C'est la durée préconisée par l'administration et correspondant au délai de prescription. Conservez les fiches remplies, bons de livraison, factures fournisseurs et rapports de maintenance.",
      },
      {
        q: "Les fiches téléchargées sur fiche-haccp.fr sont-elles conformes ?",
        a: "Oui. Toutes nos fiches sont rédigées en conformité avec le règlement CE 852/2004, l'arrêté du 21 décembre 2009 et les recommandations de la DGAL (Direction Générale de l'Alimentation). Elles contiennent tous les champs nécessaires pour satisfaire aux exigences d'un contrôle DDPP.",
      },
    ],
  },
  {
    title: "Contrôles et sanctions",
    items: [
      {
        q: "Qui effectue les contrôles HACCP dans un restaurant ?",
        a: "Les contrôles sont effectués par la DDPP (Direction Départementale de la Protection des Populations), anciennement DSV (Direction des Services Vétérinaires). Les inspecteurs peuvent se présenter à tout moment, sans prévenir. Ils vérifient l'hygiène générale, les documents HACCP, la traçabilité, les températures, le plan de nettoyage, et la formation du personnel.",
      },
      {
        q: "Quelles sanctions en cas de non-conformité HACCP ?",
        a: "Les sanctions vont de l'avertissement simple à la fermeture administrative : avertissement avec mise en demeure (délai pour se conformer), amende de contravention de 5ème classe (jusqu'à 1 500€), fermeture administrative temporaire ou définitive, poursuites pénales en cas d'intoxication alimentaire (jusqu'à 2 ans de prison et 30 000€ d'amende si blessures involontaires).",
      },
      {
        q: "Mon restaurant a reçu un avertissement, que faire ?",
        a: "Prenez les mesures correctives immédiatement. Mettez en place les fiches HACCP manquantes, corrigez les problèmes identifiés, formez votre personnel si nécessaire. Documentez toutes vos actions correctives. L'inspecteur reviendra vérifier la mise en conformité dans le délai imparti (généralement 1 à 3 mois).",
      },
    ],
  },
  {
    title: "Notre service",
    items: [
      {
        q: "Le téléchargement des fiches est-il vraiment gratuit ?",
        a: "Oui, toutes les fiches HACCP au format PDF sont téléchargeables gratuitement après inscription (gratuite, sans carte bancaire). Vous pouvez les imprimer et les utiliser immédiatement dans votre restaurant.",
      },
      {
        q: "À quoi sert l'abonnement Pro à 20€/mois ?",
        a: "L'abonnement Pro vous donne accès à un espace de gestion numérique complet : gestion des employés (ajout, rôles, affectation aux tâches), création et suivi des tâches HACCP quotidiennes, enregistrement de la traçabilité en ligne, historique complet et exportable, tableau de bord en temps réel. C'est la version numérique et améliorée de vos classeurs papier.",
      },
      {
        q: "Puis-je annuler mon abonnement à tout moment ?",
        a: "Oui, l'abonnement est sans engagement. Vous pouvez annuler depuis votre espace personnel en un clic. L'accès reste actif jusqu'à la fin de la période payée. Vos données restent accessibles en lecture seule après l'annulation.",
      },
    ],
  },
];

export default function FAQPage() {
  const allItems = FAQ_SECTIONS.flatMap((s) => s.items);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: allItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "FAQ" }]} />

        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          Questions fréquentes sur le HACCP
        </h1>
        <p className="text-gray-600 text-lg mb-12">
          Tout ce que vous devez savoir sur le HACCP en restauration : réglementation,
          fiches obligatoires, contrôles et sanctions.
        </p>

        {FAQ_SECTIONS.map((section, si) => (
          <section key={si} className="mb-10">
            <h2 className="text-xl font-bold mb-4">{section.title}</h2>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-xl p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-primary group-open:rotate-180 transition-transform ml-2">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="bg-primary text-white rounded-2xl p-8 text-center mt-12">
          <h2 className="text-2xl font-bold mb-3">Vous avez d&apos;autres questions ?</h2>
          <p className="text-emerald-200 mb-6">Téléchargez nos fiches HACCP gratuitement et commencez dès maintenant.</p>
          <Link
            href="/inscription"
            className="inline-block bg-accent hover:bg-accent-dark text-gray-900 font-bold px-8 py-3 rounded-lg transition-colors"
          >
            S&apos;inscrire gratuitement
          </Link>
        </div>
      </main>
    </>
  );
}
