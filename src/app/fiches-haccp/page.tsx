import type { Metadata } from "next";
import { FICHES, CATEGORIES } from "@/lib/fiches";
import { FicheCard } from "@/components/FicheCard";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTABanner } from "@/components/CTABanner";

export const metadata: Metadata = {
  title: "Toutes les fiches HACCP restaurant – PDF gratuits à télécharger",
  description:
    "Retrouvez toutes les fiches HACCP obligatoires pour votre restaurant : contrôle des températures, traçabilité, nettoyage, allergènes, non-conformité. Téléchargement PDF gratuit.",
  alternates: { canonical: "/fiches-haccp" },
};

export default function FichesPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Fiches HACCP" }]} />

      <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
        Fiches HACCP obligatoires pour restaurant
      </h1>
      <p className="text-gray-600 text-lg mb-10 max-w-3xl">
        Téléchargez gratuitement toutes les fiches de contrôle HACCP nécessaires à votre Plan de Maîtrise
        Sanitaire (PMS). Documents conformes au règlement CE 852/2004 et à l&apos;arrêté du 21 décembre 2009.
      </p>

      {CATEGORIES.map((cat) => {
        const catFiches = FICHES.filter((f) => f.category === cat.id);
        if (catFiches.length === 0) return null;
        return (
          <section key={cat.id} id={cat.id} className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span aria-hidden="true">{cat.icon}</span> {cat.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {catFiches.map((fiche) => (
                <FicheCard key={fiche.id} fiche={fiche} />
              ))}
            </div>
          </section>
        );
      })}

      <CTABanner />
    </main>
  );
}
