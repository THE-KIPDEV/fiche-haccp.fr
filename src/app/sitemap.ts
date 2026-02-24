import type { MetadataRoute } from "next";
import { FICHES } from "@/lib/fiches";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fiche-haccp.fr";
  const lastModified = "2026-02-24";

  const staticPages = [
    { url: siteUrl, lastModified, changeFrequency: "monthly" as const, priority: 1 },
    { url: `${siteUrl}/fiches-haccp`, lastModified, changeFrequency: "monthly" as const, priority: 0.9 },
    { url: `${siteUrl}/tarifs`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/faq`, lastModified, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/inscription`, lastModified, changeFrequency: "yearly" as const, priority: 0.5 },
    { url: `${siteUrl}/connexion`, lastModified, changeFrequency: "yearly" as const, priority: 0.4 },
    { url: `${siteUrl}/mentions-legales`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/politique-confidentialite`, lastModified, changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const fichePages = FICHES.map((fiche) => ({
    url: `${siteUrl}/fiches-haccp/${fiche.slug}`,
    lastModified,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...fichePages];
}
