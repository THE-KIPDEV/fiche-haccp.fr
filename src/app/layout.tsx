import type { Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNav } from "@/components/BottomNav";

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://fiche-haccp.fr"
  ),
  title: {
    default: "Fiches HACCP Restaurant Gratuites & Gestion en Ligne | fiche-haccp.fr",
    template: "%s | Fiche HACCP",
  },
  description:
    "Les fiches HACCP que la DDPP exige lors d'un contrôle sanitaire en restaurant. Températures, nettoyage, traçabilité, réception marchandises. PDF gratuits, conformes au règlement CE 852/2004.",
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
    "gestion HACCP en ligne",
    "logiciel HACCP restaurant",
  ],
  authors: [{ name: "Fiche HACCP" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Fiche HACCP",
    title: "Fiches HACCP Restaurant – PDF gratuits conformes",
    description:
      "Les fiches de contrôle HACCP exigées par la DDPP. Températures, nettoyage, traçabilité. Téléchargement gratuit.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fiches HACCP Restaurant – PDF Gratuits",
    description:
      "Les fiches de contrôle HACCP que la DDPP demande lors d'un contrôle. PDF gratuits et conformes.",
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
      <body className={`${nunitoSans.variable} font-sans antialiased`}>
        <Navbar />
        {children}
        <BottomNav />
        <Script
          defer
          src="https://kipstats.com/tracker.js"
          data-site="kp_abf26560"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
