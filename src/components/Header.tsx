"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ClipboardList } from "lucide-react";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok && setLogged(true))
      .catch(() => {});
  }, []);

  return (
    <header className="bg-primary text-white sticky top-0 z-50 shadow-md">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <ClipboardList className="w-6 h-6" />
          <span className="hidden sm:inline">Fiche HACCP</span>
          <span className="sm:hidden">HACCP</span>
        </Link>

        <button
          className="md:hidden p-2 rounded hover:bg-primary-light transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Menu de navigation"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        <ul className="hidden md:flex items-center gap-6 text-sm">
          <li>
            <Link href="/fiches-haccp" className="hover:text-accent transition-colors">
              Fiches HACCP
            </Link>
          </li>
          <li>
            <Link href="/tarifs" className="hover:text-accent transition-colors">
              Tarifs
            </Link>
          </li>
          <li>
            <Link href="/faq" className="hover:text-accent transition-colors">
              FAQ
            </Link>
          </li>
          {logged ? (
            <li>
              <Link
                href="/tableau-de-bord"
                className="bg-accent hover:bg-accent-dark text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Mon espace
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link href="/connexion" className="hover:text-accent transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  href="/inscription"
                  className="bg-accent hover:bg-accent-dark text-gray-900 font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Inscription gratuite
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-primary-dark border-t border-primary-light">
          <ul className="flex flex-col px-4 py-3 gap-3 text-sm">
            <li>
              <Link href="/fiches-haccp" className="block py-2 hover:text-accent transition-colors" onClick={() => setMenuOpen(false)}>
                Fiches HACCP
              </Link>
            </li>
            <li>
              <Link href="/tarifs" className="block py-2 hover:text-accent transition-colors" onClick={() => setMenuOpen(false)}>
                Tarifs
              </Link>
            </li>
            <li>
              <Link href="/faq" className="block py-2 hover:text-accent transition-colors" onClick={() => setMenuOpen(false)}>
                FAQ
              </Link>
            </li>
            {logged ? (
              <li>
                <Link
                  href="/tableau-de-bord"
                  className="block bg-accent hover:bg-accent-dark text-gray-900 font-semibold px-4 py-2 rounded-lg text-center transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Mon espace
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/connexion" className="block py-2 hover:text-accent transition-colors" onClick={() => setMenuOpen(false)}>
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inscription"
                    className="block bg-accent hover:bg-accent-dark text-gray-900 font-semibold px-4 py-2 rounded-lg text-center transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Inscription gratuite
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
