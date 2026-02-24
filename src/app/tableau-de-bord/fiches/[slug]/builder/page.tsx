"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { PdfBuilder } from "@/components/PdfBuilder";
import Link from "next/link";

interface Fiche {
  slug: string;
  title: string;
  shortTitle: string;
  pdfSections: { title: string; fields: string[] }[];
}

export default function BuilderPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [fiche, setFiche] = useState<Fiche | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const authRes = await fetch("/api/auth/me");
        if (!authRes.ok) {
          router.push("/connexion");
          return;
        }

        const fichesRes = await fetch("/api/fiches");
        const data = await fichesRes.json();
        const found = data.fiches?.find(
          (f: { slug: string }) => f.slug === slug
        );

        if (!found) {
          router.push("/tableau-de-bord/fiches");
          return;
        }

        setFiche(found);
      } catch {
        router.push("/connexion");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, router]);

  if (loading) {
    return (
      <div className="text-center py-12 text-gray-500">Chargement...</div>
    );
  }

  if (!fiche) return null;

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link
          href="/tableau-de-bord/fiches"
          className="hover:text-primary transition-colors"
        >
          Fiches HACCP
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{fiche.shortTitle}</span>
      </div>

      <h1 className="text-2xl font-bold mb-6">
        Personnaliser : {fiche.shortTitle}
      </h1>

      <PdfBuilder
        fiche={{
          slug: fiche.slug,
          title: fiche.title,
          shortTitle: fiche.shortTitle,
          pdfFields: fiche.pdfSections[0]?.fields || [],
        }}
      />
    </div>
  );
}
