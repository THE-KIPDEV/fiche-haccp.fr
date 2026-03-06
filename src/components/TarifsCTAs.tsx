"use client";

import Link from "next/link";

function track(name: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as any).kipstats?.event) {
    (window as any).kipstats.event(name, data || {});
  }
}

export function TarifFreeCTA() {
  return (
    <Link
      href="/inscription"
      onClick={() => track("cta_click", { cta: "tarifs_free_inscription" })}
      className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold px-6 py-3 rounded-lg transition-colors mb-8"
    >
      S&apos;inscrire gratuitement
    </Link>
  );
}

export function TarifProCTA() {
  return (
    <Link
      href="/inscription"
      onClick={() => track("cta_click", { cta: "tarifs_pro_commencer" })}
      className="block text-center bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors mb-8"
    >
      Commencer maintenant
    </Link>
  );
}
