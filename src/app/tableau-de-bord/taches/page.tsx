"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Employee {
  id: number;
  name: string;
}

interface Task {
  id: number;
  title: string;
  description: string;
  frequency: string;
  category: string;
  assigned_employee_id: number | null;
  assigned_employee_name?: string;
  active: boolean;
}

const FREQUENCIES = [
  { value: "quotidien", label: "Quotidien" },
  { value: "hebdomadaire", label: "Hebdomadaire" },
  { value: "mensuel", label: "Mensuel" },
  { value: "ponctuel", label: "Ponctuel" },
];

const TASK_CATEGORIES = [
  { value: "temperatures", label: "Températures" },
  { value: "nettoyage", label: "Nettoyage" },
  { value: "tracabilite", label: "Traçabilité" },
  { value: "reception", label: "Réception" },
  { value: "equipement", label: "Équipement" },
  { value: "general", label: "Général" },
];

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", frequency: "quotidien", category: "general", assigned_employee_id: "" });
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
        return Promise.all([loadTasks(), loadEmployees()]);
      })
      .catch(() => router.push("/connexion"))
      .finally(() => setLoading(false));
  }, [router]);

  async function loadTasks() {
    const res = await fetch("/api/tasks");
    if (res.ok) {
      const data = await res.json();
      setTasks(data.tasks || []);
    }
  }

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

    const url = editId ? `/api/tasks/${editId}` : "/api/tasks";
    const method = editId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        assigned_employee_id: form.assigned_employee_id ? parseInt(form.assigned_employee_id) : null,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur");
      return;
    }

    resetForm();
    await loadTasks();
  }

  async function handleDelete(id: number) {
    if (!confirm("Supprimer cette tâche ?")) return;
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    await loadTasks();
  }

  function startEdit(task: Task) {
    setEditId(task.id);
    setForm({
      title: task.title,
      description: task.description || "",
      frequency: task.frequency,
      category: task.category,
      assigned_employee_id: task.assigned_employee_id?.toString() || "",
    });
    setShowForm(true);
  }

  function resetForm() {
    setForm({ title: "", description: "", frequency: "quotidien", category: "general", assigned_employee_id: "" });
    setShowForm(false);
    setEditId(null);
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  if (!isPro) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl" aria-hidden="true">✅</span>
        <h1 className="text-2xl font-bold mt-4 mb-2">Tâches HACCP</h1>
        <p className="text-gray-500 mb-6">Fonctionnalité disponible avec l&apos;abonnement Pro à 20€/mois.</p>
        <a href="/tableau-de-bord/abonnement" className="inline-block bg-primary hover:bg-primary-light text-white font-semibold px-6 py-3 rounded-lg transition-colors">
          S&apos;abonner maintenant
        </a>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Tâches HACCP ({tasks.length})</h1>
        <button
          onClick={() => { setShowForm(true); setEditId(null); resetForm(); setShowForm(true); }}
          className="bg-primary hover:bg-primary-light text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + Nouvelle tâche
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
          {error && <div className="text-danger text-sm">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la tâche</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ex: Relevé température chambre froide"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Détails de la procédure..."
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fréquence</label>
              <select
                value={form.frequency}
                onChange={(e) => setForm({ ...form, frequency: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {FREQUENCIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {TASK_CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
              <select
                value={form.assigned_employee_id}
                onChange={(e) => setForm({ ...form, assigned_employee_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Non assigné</option>
                {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
              {editId ? "Modifier" : "Créer"}
            </button>
            <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700 text-sm">
              Annuler
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>Aucune tâche HACCP créée. Commencez par définir vos contrôles.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="font-semibold">{task.title}</h3>
                  {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {FREQUENCIES.find((f) => f.value === task.frequency)?.label}
                    </span>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {TASK_CATEGORIES.find((c) => c.value === task.category)?.label}
                    </span>
                    {task.assigned_employee_name && (
                      <span className="text-xs bg-accent/10 text-accent-dark px-2 py-0.5 rounded-full">
                        👤 {task.assigned_employee_name}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => startEdit(task)} className="text-primary hover:text-primary-light text-sm font-medium">
                    Modifier
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="text-danger hover:text-red-700 text-sm font-medium">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
