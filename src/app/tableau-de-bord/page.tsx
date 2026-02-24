"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FileText, Users, CheckSquare, ClipboardList } from "lucide-react";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  restaurant_name: string;
  subscription_status: string;
}

interface Stats {
  employees: number;
  tasks: number;
  logsToday: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [stats, setStats] = useState<Stats>({ employees: 0, tasks: 0, logsToday: 0 });

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) { router.push("/connexion"); return null; }
        return r.json();
      })
      .then((data) => { if (data) setUser(data.user); })
      .catch(() => router.push("/connexion"));

    fetch("/api/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { if (data) setStats(data); })
      .catch(() => {});
  }, [router]);

  if (!user) {
    return <div className="text-center py-12 text-gray-500">Chargement...</div>;
  }

  const isPro = user.subscription_status === "active";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          Bonjour {user.name}
        </h1>
        {user.restaurant_name && (
          <p className="text-gray-500">{user.restaurant_name}</p>
        )}
      </div>

      {!isPro && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="font-bold text-lg">Passez au plan Pro</h2>
              <p className="text-sm text-gray-600 mt-1">
                Débloquez la gestion des employés, le suivi des tâches HACCP et la traçabilité
                pour 20€/mois.
              </p>
            </div>
            <Link
              href="/tableau-de-bord/abonnement"
              className="bg-primary hover:bg-primary-light text-white font-semibold px-6 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              S&apos;abonner
            </Link>
          </div>
        </div>
      )}

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Employés</p>
          <p className="text-3xl font-bold text-primary mt-1">{stats.employees}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Tâches HACCP</p>
          <p className="text-3xl font-bold text-primary mt-1">{stats.tasks}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Relevés aujourd&apos;hui</p>
          <p className="text-3xl font-bold text-primary mt-1">{stats.logsToday}</p>
        </div>
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-bold mb-4">Actions rapides</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/tableau-de-bord/fiches"
          className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
        >
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold">Fiches HACCP</h3>
          <p className="text-sm text-gray-500 mt-1">Télécharger ou personnaliser</p>
        </Link>

        {isPro && (
          <>
            <Link
              href="/tableau-de-bord/employes"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Employés</h3>
              <p className="text-sm text-gray-500 mt-1">Ajouter, modifier, affecter</p>
            </Link>
            <Link
              href="/tableau-de-bord/taches"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <CheckSquare className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Tâches HACCP</h3>
              <p className="text-sm text-gray-500 mt-1">Créer et suivre les contrôles</p>
            </Link>
            <Link
              href="/tableau-de-bord/tracabilite"
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
            >
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <ClipboardList className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold">Traçabilité</h3>
              <p className="text-sm text-gray-500 mt-1">Historique des relevés et contrôles</p>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
