"use client";

import Link from "next/link";

function track(name: string, data?: Record<string, unknown>) {
  if (typeof window !== "undefined" && (window as any).kipstats?.event) {
    (window as any).kipstats.event(name, data || {});
  }
}

export function UpgradeBanner() {
  return (
    <section className="bg-c-brand text-white rounded-2xl p-8 md:p-12 my-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          Vous voulez passer au tout-numérique ?
        </h2>
        <p className="text-emerald-200 text-lg mb-6">
          Les fiches PDF sont gratuites. L&apos;abonnement Pro ajoute la gestion
          des employés, les tâches HACCP et le suivi en temps réel pour 20&nbsp;€/mois.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/inscription"
            onClick={() => track("cta_click", { cta: "upgrade_banner_inscription" })}
            className="bg-c-accent hover:bg-c-accent-dark text-gray-900 font-bold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            Essayer gratuitement
          </Link>
          <Link
            href="/tarifs"
            onClick={() => track("cta_click", { cta: "upgrade_banner_tarifs" })}
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition-colors border border-white/20"
          >
            Voir les tarifs
          </Link>
        </div>
      </div>
    </section>
  );
}
