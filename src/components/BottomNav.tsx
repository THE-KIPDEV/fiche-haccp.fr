import Link from "next/link";
import { CATEGORIES } from "@/lib/fiches";

export function BottomNav() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-white font-bold text-lg mb-3">Fiche HACCP</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              Les fiches de contrôle que la DDPP exige lors d&apos;un contrôle sanitaire
              en restaurant. Conformes au règlement CE 852/2004, prêtes à remplir.
            </p>
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">Voir aussi</p>
              <ul className="space-y-1 text-sm">
                <li>
                  <a href="https://affichage-obligatoire-restaurant.fr" className="hover:text-white transition-colors">
                    Affichages obligatoires restaurant
                  </a>
                </li>
                <li>
                  <a href="https://tableau-allergenes.fr" className="hover:text-white transition-colors">
                    Tableau des allergènes
                  </a>
                </li>
                <li>
                  <a href="https://origine-viande.fr" className="hover:text-white transition-colors">
                    Affichage origine des viandes
                  </a>
                </li>
                <li>
                  <a href="https://creer-menu-restaurant.fr" className="hover:text-white transition-colors">
                    Créer un menu de restaurant
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-sm">Navigation</h4>
            <ul className="space-y-1.5 text-sm mb-6">
              <li><Link href="/fiches-haccp" className="hover:text-white transition-colors">Toutes les fiches</Link></li>
              <li><Link href="/tarifs" className="hover:text-white transition-colors">Tarifs</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/inscription" className="hover:text-white transition-colors">Inscription</Link></li>
            </ul>
            <h4 className="text-white font-semibold mb-3 text-sm">Légal</h4>
            <ul className="space-y-1.5 text-sm">
              <li><Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/fiches-haccp#${cat.id}`}
                className="text-xs bg-gray-800 text-gray-400 px-3 py-1 rounded-full hover:text-white hover:bg-gray-700 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-600">
            <p>© {new Date().getFullYear()} fiche-haccp.fr</p>
            <p>
              Ce site ne se substitue pas aux obligations réglementaires.
              Consultez votre organisme de formation HACCP en cas de doute.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
