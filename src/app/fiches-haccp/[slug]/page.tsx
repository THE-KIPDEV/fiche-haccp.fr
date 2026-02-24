import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FICHES, getFicheBySlug, CATEGORIES } from "@/lib/fiches";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CTABanner } from "@/components/CTABanner";
import { FicheIcon } from "@/components/FicheIcon";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FICHES.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const fiche = getFicheBySlug(slug);
  if (!fiche) return {};
  return {
    title: fiche.metaTitle,
    description: fiche.metaDescription,
    alternates: { canonical: `/fiches-haccp/${fiche.slug}` },
  };
}

export default async function FicheDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const fiche = getFicheBySlug(slug);
  if (!fiche) notFound();

  const category = CATEGORIES.find((c) => c.id === fiche.category);
  const relatedFiches = FICHES.filter((f) => f.category === fiche.category && f.id !== fiche.id).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: fiche.title,
    description: fiche.description,
    datePublished: "2025-01-15",
    dateModified: "2026-02-24",
    author: { "@type": "Organization", name: "Fiche HACCP", url: "https://fiche-haccp.fr" },
    publisher: { "@type": "Organization", name: "Fiche HACCP" },
    mainEntityOfPage: `https://fiche-haccp.fr/fiches-haccp/${fiche.slug}`,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Fiches HACCP", href: "/fiches-haccp" },
            { label: fiche.shortTitle },
          ]}
        />

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
              {category && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full font-medium inline-flex items-center gap-1.5">
                  <FicheIcon name={category.icon} className="w-3.5 h-3.5" />
                  {category.label}
                </span>
              )}
              <span className="bg-accent/10 text-accent-dark px-3 py-1 rounded-full font-medium">
                PDF gratuit
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold mb-4">{fiche.title}</h1>
            <p className="text-gray-600 text-lg">{fiche.description}</p>
          </header>

          {/* Download CTA */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1">
                <h2 className="font-bold text-lg mb-1">Télécharger cette fiche en PDF</h2>
                <p className="text-sm text-gray-600">
                  Inscription gratuite requise. Document conforme, prêt à imprimer.
                </p>
              </div>
              <Link
                href="/inscription"
                className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
              >
                Télécharger le PDF
              </Link>
            </div>
          </div>

          {/* Info card */}
          <div className="bg-gray-50 rounded-xl p-5 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Fréquence</p>
              <p className="font-semibold text-sm">{fiche.frequency}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-medium">Catégorie</p>
              <p className="font-semibold text-sm">{category?.label}</p>
            </div>
          </div>

          {/* Legal basis */}
          <div className="bg-amber-50 border-l-4 border-accent rounded-r-xl p-5 mb-8">
            <p className="text-xs text-gray-500 uppercase font-medium mb-1">Base légale</p>
            <p className="text-sm text-gray-700">{fiche.legalBasis}</p>
          </div>

          {/* Content sections */}
          {fiche.content.map((section, i) => (
            <section key={i} className="mb-8">
              <h2 className="text-xl font-bold mb-3">{section.title}</h2>
              <p className="text-gray-700 leading-relaxed">{section.text}</p>
            </section>
          ))}

          {/* PDF sections preview */}
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4">Contenu de la fiche PDF</h2>
            {fiche.pdfSections.map((section, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-5 mb-4">
                <h3 className="font-semibold mb-3">{section.title}</h3>
                <div className="flex flex-wrap gap-2">
                  {section.fields.map((field, j) => (
                    <span key={j} className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-700">
                      {field}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </section>

          {/* Download CTA 2 */}
          <div className="bg-primary text-white rounded-xl p-8 text-center mb-8">
            <h2 className="text-xl font-bold mb-2">Prêt à télécharger cette fiche ?</h2>
            <p className="text-emerald-200 mb-4">Inscription gratuite, aucune carte bancaire requise.</p>
            <Link
              href="/inscription"
              className="inline-block bg-accent hover:bg-accent-dark text-gray-900 font-bold px-8 py-3 rounded-lg transition-colors"
            >
              S&apos;inscrire et télécharger
            </Link>
          </div>
        </article>

        {/* Related fiches */}
        {relatedFiches.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-bold mb-4">Fiches HACCP similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedFiches.map((f) => (
                <Link
                  key={f.id}
                  href={`/fiches-haccp/${f.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <FicheIcon name={f.icon} className="w-4 h-4 text-primary" />
                  </div>
                  <h3 className="font-semibold">{f.shortTitle}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{f.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <CTABanner />
      </main>
    </>
  );
}
