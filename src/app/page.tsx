import Link from "next/link";
import { FICHES, CATEGORIES } from "@/lib/fiches";
import { FicheCard } from "@/components/FicheCard";
import { CTABanner } from "@/components/CTABanner";

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce que le HACCP en restauration ?",
    a: "Le HACCP (Hazard Analysis Critical Control Point) est une méthode de maîtrise de la sécurité sanitaire des aliments. Obligatoire en restauration depuis le règlement CE 852/2004, il impose l'identification des dangers, la définition de points de contrôle critiques et la mise en place de procédures de surveillance. Chaque restaurant doit disposer d'un Plan de Maîtrise Sanitaire (PMS) intégrant les principes HACCP.",
  },
  {
    q: "Les fiches HACCP sont-elles obligatoires pour un restaurant ?",
    a: "Oui. Tout exploitant du secteur alimentaire doit mettre en place des procédures de type HACCP et conserver des documents de traçabilité (règlement CE 852/2004, arrêté du 21 décembre 2009). Les fiches de contrôle des températures, de traçabilité et de nettoyage font partie du Plan de Maîtrise Sanitaire obligatoire. Ces documents peuvent être demandés lors d'un contrôle de la DDPP.",
  },
  {
    q: "Combien de temps conserver les fiches HACCP ?",
    a: "Les fiches HACCP et documents de traçabilité doivent être conservés pendant 5 ans minimum. Cette durée correspond au délai de prescription en matière de sécurité alimentaire. Conservez les fiches remplies, les bons de livraison, les fiches de non-conformité et les rapports de maintenance dans un classeur dédié.",
  },
  {
    q: "Que risque un restaurant sans fiches HACCP ?",
    a: "En cas de contrôle de la DDPP (Direction Départementale de la Protection des Populations), l'absence de documents HACCP peut entraîner : un avertissement, une mise en demeure avec délai de mise en conformité, une fermeture administrative temporaire, ou une amende pouvant aller jusqu'à 1 500€ (contravention de 5ème classe). En cas de problème sanitaire grave, les sanctions pénales sont plus lourdes.",
  },
  {
    q: "Le téléchargement des fiches HACCP est-il vraiment gratuit ?",
    a: "Oui, toutes nos fiches HACCP sont téléchargeables gratuitement au format PDF après inscription (gratuite). Nos fiches sont conformes à la réglementation française en vigueur. Pour aller plus loin, notre abonnement à 20€/mois vous donne accès à la gestion complète : employés, tâches HACCP, traçabilité et suivi en temps réel.",
  },
];

export default function HomePage() {
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fiche HACCP",
    url: "https://fiche-haccp.fr",
    description: "Fiches HACCP gratuites pour restaurant – Téléchargement PDF",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://fiche-haccp.fr/fiches-haccp?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const jsonLdFAQ = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFAQ) }} />

      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-16 md:py-24">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Fiches HACCP gratuites<br className="hidden md:block" /> pour votre restaurant
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Téléchargez toutes les fiches de contrôle HACCP obligatoires au format PDF.
              Documents conformes au <strong>règlement CE 852/2004</strong> et à l&apos;arrêté du 21 décembre 2009.
              Prêts à imprimer et à utiliser immédiatement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="bg-accent hover:bg-accent-dark text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
              >
                Télécharger les fiches gratuitement
              </Link>
              <Link
                href="/fiches-haccp"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-colors"
              >
                Voir toutes les fiches
              </Link>
            </div>
            <p className="text-sm text-emerald-200 mt-4">Inscription gratuite requise — Aucune carte bancaire nécessaire</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 bg-gray-50 border-b border-gray-200">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-primary">{FICHES.length}</p>
                <p className="text-sm text-gray-600">Fiches HACCP</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">100%</p>
                <p className="text-sm text-gray-600">Conformes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">PDF</p>
                <p className="text-sm text-gray-600">Prêts à imprimer</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary">Gratuit</p>
                <p className="text-sm text-gray-600">Téléchargement</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fiches by category */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Toutes les fiches HACCP obligatoires
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Retrouvez les fiches de contrôle indispensables pour votre Plan de Maîtrise Sanitaire (PMS).
              Chaque fiche est conforme à la réglementation française en vigueur.
            </p>

            {CATEGORIES.map((cat) => {
              const catFiches = FICHES.filter((f) => f.category === cat.id);
              if (catFiches.length === 0) return null;
              return (
                <div key={cat.id} id={cat.id} className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span aria-hidden="true">{cat.icon}</span> {cat.label}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {catFiches.map((fiche) => (
                      <FicheCard key={fiche.id} fiche={fiche} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Why HACCP */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Pourquoi les fiches HACCP sont indispensables ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3" aria-hidden="true">⚖️</div>
                <h3 className="font-bold text-lg mb-2">Obligation légale</h3>
                <p className="text-gray-600 text-sm">
                  Le règlement CE 852/2004 et l&apos;arrêté du 21 décembre 2009 imposent à tout restaurant
                  de mettre en place et documenter des procédures HACCP. Les fiches de contrôle constituent
                  la preuve de votre conformité lors des contrôles sanitaires.
                </p>
              </article>
              <article className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3" aria-hidden="true">🛡️</div>
                <h3 className="font-bold text-lg mb-2">Protection sanitaire</h3>
                <p className="text-gray-600 text-sm">
                  Les fiches HACCP permettent de détecter et prévenir les risques sanitaires avant qu&apos;ils
                  ne surviennent : rupture de la chaîne du froid, contamination croisée, allergènes non
                  déclarés. Elles protègent vos clients et votre établissement.
                </p>
              </article>
              <article className="bg-white rounded-xl p-6 shadow-sm">
                <div className="text-3xl mb-3" aria-hidden="true">📊</div>
                <h3 className="font-bold text-lg mb-2">Gestion simplifiée</h3>
                <p className="text-gray-600 text-sm">
                  Notre plateforme vous permet de passer du papier au numérique. Gérez vos employés,
                  assignez les tâches HACCP, suivez la traçabilité et exportez vos données.
                  Tout en un seul endroit pour seulement 20€/mois.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-6xl mx-auto px-4">
          <CTABanner />
        </div>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Questions fréquentes sur le HACCP
            </h2>
            <div className="space-y-6">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-xl p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-primary group-open:rotate-180 transition-transform ml-2">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-3 text-sm leading-relaxed">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
