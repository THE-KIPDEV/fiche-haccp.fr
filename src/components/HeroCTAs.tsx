"use client";

import Link from "next/link";

function track(name: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as any).kipstats?.event) {
    (window as any).kipstats.event(name, data || {});
  }
}

export function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        href="/inscription"
        onClick={() => track("cta_click", { cta: "hero_telecharger_fiches" })}
        className="bg-c-accent hover:bg-c-accent-dark text-gray-900 font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
      >
        Télécharger les fiches
      </Link>
      <Link
        href="/fiches-haccp"
        onClick={() => track("cta_click", { cta: "hero_voir_fiches" })}
        className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-lg border border-white/20 transition-colors"
      >
        Voir toutes les fiches
      </Link>
    </div>
  );
}

export function SectionCTA() {
  return (
    <Link
      href="/inscription"
      onClick={() => track("cta_click", { cta: "section_essayer_gratuitement" })}
      className="inline-block bg-c-brand hover:bg-c-brand-light text-white font-semibold px-8 py-3 rounded-lg transition-colors"
    >
      Essayer gratuitement
    </Link>
  );
}
