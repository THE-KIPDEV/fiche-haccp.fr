import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { RegisterForm } from "./RegisterForm";

export const metadata: Metadata = {
  title: "Inscription gratuite – Téléchargez vos fiches HACCP",
  description:
    "Créez votre compte gratuit pour télécharger toutes les fiches HACCP obligatoires en PDF. Aucune carte bancaire requise.",
  alternates: { canonical: "/inscription" },
};

export default function InscriptionPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Inscription" }]} />

      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3">Créer un compte gratuit</h1>
        <p className="text-gray-600">
          Inscrivez-vous pour télécharger gratuitement toutes les fiches HACCP en PDF.
          Aucune carte bancaire requise.
        </p>
      </div>

      <RegisterForm />

      <p className="text-center text-sm text-gray-500 mt-6">
        Déjà inscrit ?{" "}
        <a href="/connexion" className="text-primary font-medium hover:underline">
          Se connecter
        </a>
      </p>
    </main>
  );
}
