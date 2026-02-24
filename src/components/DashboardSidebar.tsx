"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NAV_ITEMS = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: "📊" },
  { href: "/tableau-de-bord/fiches", label: "Fiches HACCP (PDF)", icon: "📄" },
  { href: "/tableau-de-bord/employes", label: "Employés", icon: "👥" },
  { href: "/tableau-de-bord/taches", label: "Tâches HACCP", icon: "✅" },
  { href: "/tableau-de-bord/tracabilite", label: "Traçabilité", icon: "📋" },
  { href: "/tableau-de-bord/abonnement", label: "Abonnement", icon: "💳" },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <aside className="w-full md:w-64 bg-white md:min-h-screen border-b md:border-b-0 md:border-r border-gray-200">
      <div className="p-4">
        <h2 className="font-bold text-lg text-primary mb-4 hidden md:block">Mon espace HACCP</h2>
        <nav>
          <ul className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <span aria-hidden="true">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="hidden md:block mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 w-full transition-colors"
              >
                <span aria-hidden="true">🚪</span>
                Déconnexion
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
