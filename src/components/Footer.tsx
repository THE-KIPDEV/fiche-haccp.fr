import Link from "next/link";
import { FICHES, CATEGORIES } from "@/lib/fiches";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">📋 Fiche HACCP</h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              Toutes les fiches HACCP obligatoires pour votre restaurant.
              Documents conformes à la réglementation française, prêts à imprimer.
              Téléchargement gratuit après inscription.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Catégories</h4>
            <ul className="space-y-2 text-sm">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/fiches-haccp#${cat.id}`} className="hover:text-accent transition-colors">
                    {cat.icon} {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Fiches populaires</h4>
            <ul className="space-y-2 text-sm">
              {FICHES.slice(0, 6).map((fiche) => (
                <li key={fiche.id}>
                  <Link href={`/fiches-haccp/${fiche.slug}`} className="hover:text-accent transition-colors">
                    {fiche.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/tarifs" className="hover:text-accent transition-colors">
                  Tarifs abonnement
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-accent transition-colors">
                  Questions fréquentes
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="hover:text-accent transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="hover:text-accent transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} fiche-haccp.fr – Tous droits réservés.</p>
          <p className="mt-1">
            Les informations présentes sur ce site sont fournies à titre indicatif et ne se
            substituent pas à un conseil juridique professionnel ou à un audit sanitaire.
          </p>
        </div>
      </div>
    </footer>
  );
}
