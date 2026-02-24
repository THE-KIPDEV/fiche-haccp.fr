import type { Metadata } from "next";
import { Breadcrumb } from "@/components/Breadcrumb";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Connexion – Accédez à votre espace HACCP",
  description:
    "Connectez-vous à votre espace pour télécharger les fiches HACCP et gérer votre restaurant.",
  alternates: { canonical: "/connexion" },
};

export default function ConnexionPage() {
  return (
    <main className="max-w-lg mx-auto px-4 py-8">
      <Breadcrumb items={[{ label: "Accueil", href: "/" }, { label: "Connexion" }]} />

      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold mb-3">Se connecter</h1>
        <p className="text-gray-600">
          Accédez à votre espace pour télécharger vos fiches HACCP et gérer votre restaurant.
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-gray-500 mt-6">
        Pas encore de compte ?{" "}
        <a href="/inscription" className="text-primary font-medium hover:underline">
          S&apos;inscrire gratuitement
        </a>
      </p>
    </main>
  );
}
