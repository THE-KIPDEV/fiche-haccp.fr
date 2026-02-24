import Link from "next/link";
import { FICHES, CATEGORIES } from "@/lib/fiches";
import { FicheCard } from "@/components/FicheCard";
import { CTABanner } from "@/components/CTABanner";
import { Scale, Shield, BarChart3, Thermometer, SprayCan, Users, Bell } from "lucide-react";

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
    a: "En cas de contrôle de la DDPP, l'absence de documents HACCP peut entraîner : un avertissement, une mise en demeure avec délai de mise en conformité, une fermeture administrative temporaire, ou une amende pouvant aller jusqu'à 1 500€ (contravention de 5ème classe). En cas de problème sanitaire grave, les sanctions pénales sont plus lourdes.",
  },
  {
    q: "Le téléchargement des fiches HACCP est-il gratuit ?",
    a: "Oui, toutes nos fiches HACCP sont téléchargeables gratuitement au format PDF après inscription. Nos fiches sont conformes à la réglementation française en vigueur. L'abonnement Pro à 20€/mois donne accès à la gestion complète : employés, tâches HACCP, traçabilité et suivi en temps réel.",
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
        <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-12 md:py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Fiches HACCP gratuites<br className="hidden md:block" /> pour votre restaurant
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Toutes les fiches de contrôle HACCP obligatoires au format PDF.
              Conformes au <strong>règlement CE 852/2004</strong> et à l&apos;arrêté du 21 décembre 2009.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="bg-accent hover:bg-accent-dark text-gray-900 font-bold px-8 py-4 rounded-xl text-lg transition-colors shadow-lg"
              >
                Télécharger les fiches
              </Link>
              <Link
                href="/fiches-haccp"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl border border-white/20 transition-colors"
              >
                Voir toutes les fiches
              </Link>
            </div>
            <p className="text-sm text-emerald-200 mt-4">Inscription gratuite — Aucune carte bancaire nécessaire</p>
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
              Les fiches de contrôle indispensables pour votre Plan de Maîtrise Sanitaire (PMS),
              conformes à la réglementation française.
            </p>

            {CATEGORIES.map((cat) => {
              const catFiches = FICHES.filter((f) => f.category === cat.id);
              if (catFiches.length === 0) return null;
              return (
                <div key={cat.id} id={cat.id} className="mb-12">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {cat.label}
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

        {/* Online HACCP management */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-wide">
                Gestion en ligne
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-4">
                Gérez votre HACCP en ligne
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mt-3">
                Au-delà des fiches PDF, passez au numérique. Suivez vos contrôles
                quotidiens, gérez vos employés et recevez des alertes automatiques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Thermometer, title: "Relevés de température", desc: "Enregistrez vos contrôles de température en quelques secondes depuis votre tableau de bord." },
                { icon: SprayCan, title: "Checklists nettoyage", desc: "Validez vos opérations de nettoyage avec un simple clic. Historique complet conservé." },
                { icon: Users, title: "Gestion des employés", desc: "Assignez les tâches HACCP à vos employés et suivez qui fait quoi." },
                { icon: Bell, title: "Rappels automatiques", desc: "Recevez un email quotidien si des tâches HACCP sont en retard." },
                { icon: BarChart3, title: "Tableau de bord", desc: "Visualisez votre taux de conformité du jour et identifiez les retards en un coup d'oeil." },
                { icon: Shield, title: "Historique 5 ans", desc: "Tous vos relevés sont conservés et disponibles en cas de contrôle DDPP." },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/inscription"
                className="inline-block bg-primary hover:bg-primary-light text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Essayer gratuitement
              </Link>
              <p className="text-xs text-gray-500 mt-2">20€/mois pour la gestion complète — sans engagement</p>
            </div>
          </div>
        </section>

        {/* Why HACCP */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Pourquoi les fiches HACCP sont indispensables
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Scale className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Obligation légale</h3>
                <p className="text-gray-600 text-sm">
                  Le règlement CE 852/2004 et l&apos;arrêté du 21 décembre 2009 imposent à tout restaurant
                  de documenter ses procédures HACCP. Les fiches de contrôle constituent
                  la preuve de votre conformité lors des contrôles sanitaires.
                </p>
              </article>
              <article className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Protection sanitaire</h3>
                <p className="text-gray-600 text-sm">
                  Les fiches HACCP permettent de détecter et prévenir les risques sanitaires :
                  rupture de la chaîne du froid, contamination croisée.
                  Elles protègent vos clients et votre établissement.
                </p>
              </article>
              <article className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">Gestion simplifiée</h3>
                <p className="text-gray-600 text-sm">
                  Passez du papier au numérique. Gérez vos employés,
                  assignez les tâches HACCP, suivez la traçabilité et exportez vos données.
                  Tout en un seul endroit pour 20€/mois.
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
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="bg-white border border-gray-200 rounded-xl p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-primary group-open:rotate-180 transition-transform ml-2">&#9660;</span>
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
