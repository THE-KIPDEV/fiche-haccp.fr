import Link from "next/link";
import { FICHES, CATEGORIES } from "@/lib/fiches";
import { FicheCard } from "@/components/FicheCard";
import { UpgradeBanner } from "@/components/UpgradeBanner";
import { Scale, Shield, BarChart3, Thermometer, SprayCan, Users, Bell } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Le HACCP, c'est quoi concrètement ?",
    a: "HACCP signifie Hazard Analysis Critical Control Point. En clair, c'est une méthode pour identifier les risques sanitaires dans votre cuisine et mettre en place des contrôles pour les éviter. Le règlement CE 852/2004 l'impose à tous les restaurants. Chaque établissement doit avoir un Plan de Maîtrise Sanitaire (PMS) qui intègre ces principes.",
  },
  {
    q: "On risque quoi si on n'a pas les fiches ?",
    a: "Lors d'un contrôle de la DDPP, l'absence de documents HACCP peut mener à un avertissement, une mise en demeure, une fermeture administrative temporaire, ou une amende allant jusqu'à 1 500 € (contravention de 5ème classe). Si un problème sanitaire survient en parallèle, les sanctions pénales montent vite.",
  },
  {
    q: "Combien de temps garder les fiches remplies ?",
    a: "5 ans minimum. C'est le délai de prescription en matière de sécurité alimentaire. Gardez vos fiches de température, bons de livraison, fiches de non-conformité et rapports de maintenance dans un classeur dédié. Ou mieux : passez au numérique et tout est archivé automatiquement.",
  },
  {
    q: "C'est vraiment gratuit ?",
    a: "Oui, les fiches PDF sont téléchargeables gratuitement après inscription. Aucune carte bancaire demandée. L'abonnement Pro à 20 €/mois est optionnel : il ajoute la gestion des employés, les tâches HACCP automatisées et le suivi en temps réel.",
  },
  {
    q: "Est-ce que ça remplace la formation HACCP ?",
    a: "Non. Depuis 2012, au moins une personne par restaurant doit avoir suivi la formation hygiène alimentaire de 14 heures. Nos fiches vous aident à appliquer ce que vous avez appris en formation, mais ne la remplacent pas.",
  },
];

export default function HomePage() {
  const jsonLdWebsite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fiche HACCP",
    url: "https://fiche-haccp.fr",
    description: "Les fiches de contrôle HACCP exigées par la DDPP lors d'un contrôle sanitaire en restaurant.",
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
        <section className="bg-gradient-to-br from-c-brand-deep via-c-brand to-c-brand-light text-white py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-6 leading-tight">
              Toutes les fiches HACCP exigées par la DDPP,
              <br className="hidden md:block" /> prêtes à remplir
            </h1>
            <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
              Relevés de température, traçabilité, nettoyage, réception marchandises&hellip;
              Les fiches que l&apos;inspecteur sanitaire attend dans votre classeur.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inscription"
                className="bg-c-accent hover:bg-c-accent-dark text-gray-900 font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
              >
                Télécharger les fiches
              </Link>
              <Link
                href="/fiches-haccp"
                className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg border border-white/20 transition-colors"
              >
                Voir toutes les fiches
              </Link>
            </div>
            <p className="text-sm text-emerald-200 mt-4">Téléchargement libre, sans engagement.</p>
          </div>
        </section>

        {/* Stats */}
        <section className="py-10 bg-gray-50 border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl font-bold text-c-brand">{FICHES.length}</p>
                <p className="text-sm text-gray-600">fiches disponibles</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-c-brand">CE 852/2004</p>
                <p className="text-sm text-gray-600">conformité</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-c-brand">PDF</p>
                <p className="text-sm text-gray-600">prêts à imprimer</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-c-brand">0 €</p>
                <p className="text-sm text-gray-600">pour les fiches</p>
              </div>
            </div>
          </div>
        </section>

        {/* Fiches by category */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
              Les fiches que la DDPP vous demandera
            </h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Chaque fiche correspond à un point de contrôle de votre Plan de Maîtrise Sanitaire.
              Cliquez pour télécharger le PDF ou voir le détail.
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

            {/* Cross-links */}
            <div className="bg-emerald-50 rounded-lg p-6 mt-8">
              <h3 className="font-bold text-gray-900 mb-3">
                Le HACCP ne fait pas tout
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                Le HACCP s&apos;inscrit dans un ensemble plus large d&apos;obligations pour les restaurateurs.
                Vérifiez que vos{" "}
                <a href="https://affichage-obligatoire-restaurant.fr" className="text-c-brand font-medium underline">
                  affichages obligatoires
                </a>{" "}
                sont en place, que votre{" "}
                <a href="https://tableau-allergenes.fr" className="text-c-brand font-medium underline">
                  tableau des allergènes
                </a>{" "}
                est à jour, et que l&apos;
                <a href="https://origine-viande.fr" className="text-c-brand font-medium underline">
                  affichage de l&apos;origine des viandes
                </a>{" "}
                est bien en place depuis le décret de février 2025.
              </p>
            </div>
          </div>
        </section>

        {/* Online HACCP management */}
        <section className="py-16 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold text-c-brand bg-c-brand/10 px-3 py-1 rounded-full uppercase tracking-wide">
                Gestion en ligne
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mt-4">
                Passez du classeur papier au numérique
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto mt-3">
                Les fiches PDF c&apos;est bien pour démarrer. L&apos;outil en ligne va plus loin :
                suivi des contrôles, gestion des employés, alertes automatiques.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { icon: Thermometer, title: "Relevés de température", desc: "Enregistrez vos contrôles depuis le tableau de bord. Plus de papier qui traîne." },
                { icon: SprayCan, title: "Checklists nettoyage", desc: "Un clic pour valider une opération de nettoyage. L'historique est conservé automatiquement." },
                { icon: Users, title: "Gestion des employés", desc: "Assignez les tâches HACCP à chaque membre de l'équipe. Vous voyez qui fait quoi." },
                { icon: Bell, title: "Rappels automatiques", desc: "Un email part chaque matin si des tâches sont en retard. Rien ne passe entre les mailles." },
                { icon: BarChart3, title: "Tableau de bord", desc: "Votre taux de conformité du jour en un coup d'oeil. Identifiez les retards immédiatement." },
                { icon: Shield, title: "Historique 5 ans", desc: "Tous les relevés sont archivés. En cas de contrôle DDPP, tout est prêt." },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 rounded-lg bg-c-brand/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-c-brand" />
                  </div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                href="/inscription"
                className="inline-block bg-c-brand hover:bg-c-brand-light text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Essayer gratuitement
              </Link>
              <p className="text-xs text-gray-500 mt-2">20 €/mois pour la gestion complète, sans engagement</p>
            </div>
          </div>
        </section>

        {/* Why HACCP */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Un contrôle DDPP sans fiches HACCP, ça se termine mal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <article className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-c-brand/10 flex items-center justify-center mb-3">
                  <Scale className="w-5 h-5 text-c-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">La loi est claire</h3>
                <p className="text-gray-600 text-sm">
                  Le règlement CE 852/2004 impose à tout restaurant de documenter
                  ses procédures HACCP. Les fiches constituent la preuve de votre
                  conformité. Sans elles, l&apos;inspecteur rédige un PV.
                </p>
              </article>
              <article className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-c-brand/10 flex items-center justify-center mb-3">
                  <Shield className="w-5 h-5 text-c-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">Vos clients d&apos;abord</h3>
                <p className="text-gray-600 text-sm">
                  Rupture de la chaîne du froid, contamination croisée, allergènes
                  non déclarés : les fiches HACCP permettent de détecter les risques
                  avant qu&apos;il ne soit trop tard.
                </p>
              </article>
              <article className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-10 h-10 rounded-lg bg-c-brand/10 flex items-center justify-center mb-3">
                  <BarChart3 className="w-5 h-5 text-c-brand" />
                </div>
                <h3 className="font-bold text-lg mb-2">Du papier au numérique</h3>
                <p className="text-gray-600 text-sm">
                  Commencez avec les fiches PDF gratuites. Quand vous êtes prêt,
                  passez à la gestion en ligne : employés, tâches, traçabilité,
                  tout centralisé pour 20 €/mois.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="max-w-5xl mx-auto px-4">
          <UpgradeBanner />
        </div>

        {/* FAQ */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Les questions qu&apos;on nous pose tout le temps
            </h2>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} className="border-l-4 border-c-brand bg-white p-5 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                    {item.q}
                    <span className="text-gray-400 ml-2 group-open:hidden">+</span>
                    <span className="text-gray-400 ml-2 hidden group-open:inline">&minus;</span>
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
