import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales du site fiche-haccp.fr. Informations sur l'éditeur, l'hébergeur et les conditions d'utilisation.",
  alternates: { canonical: "/mentions-legales" },
};

export default function MentionsLegalesPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Mentions légales" }]} />

      <h1 className="text-3xl font-extrabold mb-8">Mentions légales</h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-bold mb-3">Éditeur du site</h2>
          <p className="text-gray-700">
            Le site fiche-haccp.fr est édité par :<br />
            <strong>KIPDEV</strong><br />
            SIREN : 884 120 890<br />
            Adresse : Bordeaux, France<br />
            Email : yohann@kipdev.io<br />
            Directeur de la publication : Yohann — Gérant
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Informations vérifiables sur{" "}
            <a href="https://www.pappers.fr/entreprise/kipdev-884120890" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Pappers.fr
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Hébergement</h2>
          <p className="text-gray-700">
            Le site est hébergé par :<br />
            <strong>Railway Corporation</strong><br />
            340 S Lemon Ave #4133, Walnut, CA 91789, USA<br />
            Site : railway.app
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Propriété intellectuelle</h2>
          <p className="text-gray-700">
            L&apos;ensemble du contenu de ce site (textes, images, PDF, code source) est protégé par le droit
            d&apos;auteur. Toute reproduction ou représentation, totale ou partielle, est interdite sans
            autorisation préalable de l&apos;éditeur. Les fiches HACCP téléchargeables sont fournies pour un
            usage professionnel interne et ne peuvent être redistribuées ou revendues.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Responsabilité</h2>
          <p className="text-gray-700">
            Les informations et fiches HACCP présentes sur ce site sont fournies à titre informatif et
            pratique. Elles ne se substituent pas à un conseil juridique professionnel ni à un audit
            sanitaire réalisé par un organisme agréé. L&apos;éditeur ne saurait être tenu responsable de
            l&apos;utilisation qui pourrait être faite de ces documents. Il appartient à chaque restaurateur
            de s&apos;assurer de la conformité de son établissement aux réglementations en vigueur.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Paiement sécurisé</h2>
          <p className="text-gray-700">
            Les transactions financières sont sécurisées par Stripe, Inc., conforme PCI DSS Level 1.
            Aucune donnée bancaire n&apos;est stockée sur nos serveurs. Stripe est certifié aux normes
            de sécurité les plus élevées de l&apos;industrie du paiement.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">Droit applicable</h2>
          <p className="text-gray-700">
            Le présent site et ses mentions légales sont régis par le droit français.
            En cas de litige, les tribunaux de Bordeaux seront seuls compétents.
          </p>
        </section>
      </div>
    </main>
  );
}
