import type { MetadataRoute } from "next";
import { FICHES } from "@/lib/fiches";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fiche-haccp.fr";

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${siteUrl}/fiches-haccp`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${siteUrl}/tarifs`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/inscription`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${siteUrl}/connexion`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: `${siteUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
    { url: `${siteUrl}/politique-confidentialite`, lastModified: new Date(), changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const fichePages = FICHES.map((fiche) => ({
    url: `${siteUrl}/fiches-haccp/${fiche.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...fichePages];
}
