"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Fiche {
  id: number;
  slug: string;
  title: string;
  shortTitle: string;
  icon: string;
  category: string;
}

export default function FichesDownloadPage() {
  const router = useRouter();
  const [fiches, setFiches] = useState<Fiche[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) { router.push("/connexion"); return; }
        return fetch("/api/fiches").then((r2) => r2.json());
      })
      .then((data) => { if (data) setFiches(data.fiches); })
      .catch(() => router.push("/connexion"))
      .finally(() => setLoading(false));
  }, [router]);

  async function handleDownload(slug: string) {
    setDownloading(slug);
    try {
      const res = await fetch(`/api/download?slug=${slug}`);
      if (!res.ok) throw new Error("Erreur de téléchargement");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fiche-haccp-${slug}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors du téléchargement. Veuillez réessayer.");
    }
    setDownloading(null);
  }

  async function handleDownloadAll() {
    setDownloading("all");
    try {
      const res = await fetch("/api/download?slug=all");
      if (!res.ok) throw new Error("Erreur de téléchargement");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "fiches-haccp-pack-complet.pdf";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Erreur lors du téléchargement. Veuillez réessayer.");
    }
    setDownloading(null);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Fiches HACCP en PDF</h1>
          <p className="text-gray-500 text-sm mt-1">Téléchargez ou personnalisez vos fiches</p>
        </div>
        <button
          onClick={handleDownloadAll}
          disabled={downloading === "all"}
          className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50"
        >
          {downloading === "all" ? "Téléchargement..." : "Tout télécharger (PDF)"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fiches.map((fiche) => (
          <div key={fiche.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm truncate">{fiche.shortTitle}</h3>
              <p className="text-xs text-gray-500 truncate">{fiche.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href={`/tableau-de-bord/fiches/${fiche.slug}/builder`}
                className="text-xs border border-gray-300 text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Personnaliser
              </Link>
              <button
                onClick={() => handleDownload(fiche.slug)}
                disabled={downloading === fiche.slug}
                className="text-primary hover:text-primary-light font-medium text-sm whitespace-nowrap disabled:opacity-50"
              >
                {downloading === fiche.slug ? "..." : "PDF"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
