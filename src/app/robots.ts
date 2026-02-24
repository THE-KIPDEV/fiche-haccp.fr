import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fiche-haccp.fr";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/tableau-de-bord/"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/tableau-de-bord/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
