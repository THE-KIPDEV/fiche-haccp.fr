import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fiche-haccp.fr"
  ),
  title: {
    default: "Fiches HACCP Restaurant Gratuites – Téléchargement PDF | fiche-haccp.fr",
    template: "%s | Fiche HACCP",
  },
  description:
    "Téléchargez gratuitement toutes les fiches HACCP obligatoires pour votre restaurant. Contrôle des températures, traçabilité, nettoyage, allergènes. PDF conformes à la réglementation française.",
  keywords: [
    "fiche HACCP",
    "HACCP restaurant",
    "fiche traçabilité restaurant",
    "plan nettoyage restaurant",
    "fiche HACCP PDF gratuit",
    "HACCP restauration",
    "contrôle sanitaire restaurant",
    "plan de maîtrise sanitaire",
    "hygiène alimentaire restaurant",
    "règlement CE 852/2004",
    "fiche non-conformité HACCP",
    "refroidissement rapide HACCP",
    "réception marchandises HACCP",
  ],
  authors: [{ name: "Fiche HACCP" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Fiche HACCP",
    title: "Fiches HACCP Restaurant Gratuites – PDF à Télécharger",
    description:
      "Toutes les fiches HACCP obligatoires pour votre restaurant. Téléchargement gratuit, documents conformes à la réglementation.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiches HACCP Restaurant – PDF Gratuits",
    description:
      "Téléchargez gratuitement les fiches HACCP obligatoires pour votre restaurant. Documents conformes, prêts à imprimer.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
