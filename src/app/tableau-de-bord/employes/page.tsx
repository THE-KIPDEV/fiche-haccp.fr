"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  name: string;
  role: string;
  created_at: string;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formName, setFormName] = useState("");
  const [formRole, setFormRole] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => {
        if (!r.ok) { router.push("/connexion"); return null; }
        return r.json();
      })
      .then((data) => {
        if (!data) return;
        setIsPro(data.user.subscription_status === "active");
        return loadEmployees();
      })
      .catch(() => router.push("/connexion"))
      .finally(() => setLoading(false));
  }, [router]);

  async function loadEmployees() {
    const res = await fetch("/api/employees");
    if (res.ok) {
      const data = await res.json();
      setEmployees(data.employees || []);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const url = editId ? `/api/employees/${editId}` : "/api/employees";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: formName, role: formRole }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur");
      return;
    }

    setFormName("");
    setFormRole("");
    setShowForm(false);
    setEditId(null);
    await loadEmployees();
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cet employé ?")) return;
    await fetch(`/api/employees/${id}`, { method: "DELETE" });
    await loadEmployees();
  }

  function startEdit(emp: Employee) {
    setEditId(emp.id);
    setFormName(emp.name);
    setFormRole(emp.role);
    setShowForm(true);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  if (!isPro) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl" aria-hidden="true">👥</span>
        <h1 className="text-2xl font-bold mt-4 mb-2">Gestion des employés</h1>
        <p className="text-gray-500 mb-6">Fonctionnalité disponible avec l&apos;abonnement Pro à 20€/mois.</p>
        <a
          href="/tableau-de-bord/abonnement"
          className="inline-block bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          S&apos;abonner maintenant
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Employés ({employees.length})</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); setFormName(""); setFormRole(""); }}
          className="bg-primary hover:bg-primary-light text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + Ajouter
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
          {error && <div className="text-danger text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nom de l'employé"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle / Poste</label>
              <input
                type="text"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Cuisinier, plongeur, serveur..."
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
              {editId ? "Modifier" : "Ajouter"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditId(null); }} className="text-gray-500 hover:text-gray-700 text-sm">
              Annuler
            </button>
          </div>
        </form>
      )}

      {employees.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>Aucun employé ajouté. Commencez par ajouter votre équipe.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {emp.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="font-semibold">{emp.name}</p>
                <p className="text-sm text-gray-500">{emp.role || "Non défini"}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(emp)} className="text-primary hover:text-primary-light text-sm font-medium">
                  Modifier
                </button>
                <button onClick={() => handleDelete(emp.id)} className="text-danger hover:text-red-700 text-sm font-medium">
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
