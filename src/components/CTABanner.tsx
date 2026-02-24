import Link from "next/link";

export function CTABanner() {
  return (
    <section className="bg-primary text-white rounded-2xl p-8 md:p-12 my-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Gérez votre HACCP simplement pour 20€/mois
        </h2>
        <p className="text-primary-light text-lg mb-6 opacity-90">
          Fiches PDF gratuites + gestion des employés, tâches HACCP, traçabilité et suivi en temps réel.
          Inscription gratuite, essayez sans engagement.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/inscription"
            className="bg-accent hover:bg-accent-dark text-gray-900 font-bold px-8 py-3 rounded-lg transition-colors text-lg"
          >
            S&apos;inscrire gratuitement
          </Link>
          <Link
            href="/tarifs"
            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-3 rounded-lg transition-colors border border-white/20"
          >
            Voir les tarifs
          </Link>
        </div>
      </div>
    </section>
  );
}
