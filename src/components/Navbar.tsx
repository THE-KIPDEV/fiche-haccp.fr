"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.ok && setLogged(true))
      .catch(() => {});
  }, []);

  return (
    <header className="bg-white text-gray-900 sticky top-0 z-50 border-b border-gray-200">
      <nav className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-c-brand">
          Fiche HACCP
        </Link>

        <ul className="hidden md:flex items-center gap-5 text-sm">
          <li>
            <Link href="/fiches-haccp" className="text-gray-600 hover:text-c-brand transition-colors">
              Les fiches
            </Link>
          </li>
          <li>
            <Link href="/tarifs" className="text-gray-600 hover:text-c-brand transition-colors">
              Tarifs
            </Link>
          </li>
          <li>
            <Link href="/faq" className="text-gray-600 hover:text-c-brand transition-colors">
              FAQ
            </Link>
          </li>
          {logged ? (
            <li>
              <Link
                href="/tableau-de-bord"
                className="bg-c-brand hover:bg-c-brand-light text-white font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Mon espace
              </Link>
            </li>
          ) : (
            <>
              <li>
                <Link href="/connexion" className="text-gray-600 hover:text-c-brand transition-colors">
                  Connexion
                </Link>
              </li>
              <li>
                <Link
                  href="/inscription"
                  className="bg-c-brand hover:bg-c-brand-light text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  S&apos;inscrire
                </Link>
              </li>
            </>
          )}
        </ul>

        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-label="Menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <ul className="flex flex-col px-4 py-3 gap-2 text-sm">
            <li>
              <Link href="/fiches-haccp" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                Les fiches
              </Link>
            </li>
            <li>
              <Link href="/tarifs" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                Tarifs
              </Link>
            </li>
            <li>
              <Link href="/faq" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                FAQ
              </Link>
            </li>
            {logged ? (
              <li>
                <Link
                  href="/tableau-de-bord"
                  className="block bg-c-brand text-white font-semibold px-4 py-2 rounded-lg text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Mon espace
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link href="/connexion" className="block py-2 text-gray-700" onClick={() => setMenuOpen(false)}>
                    Connexion
                  </Link>
                </li>
                <li>
                  <Link
                    href="/inscription"
                    className="block bg-c-brand text-white font-semibold px-4 py-2 rounded-lg text-center"
                    onClick={() => setMenuOpen(false)}
                  >
                    S&apos;inscrire
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
