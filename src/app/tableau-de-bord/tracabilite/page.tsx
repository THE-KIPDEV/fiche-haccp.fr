"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
  id: number;
  title: string;
}

interface Employee {
  id: number;
  name: string;
}

interface TaskLog {
  id: number;
  task_id: number;
  task_title: string;
  employee_id: number | null;
  employee_name: string | null;
  completed_at: string;
  notes: string | null;
  temperature: number | null;
  conformity: boolean;
}

export default function TracabilitePage() {
  const router = useRouter();
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ task_id: "", employee_id: "", notes: "", temperature: "", conformity: "1" });
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
        return Promise.all([loadLogs(), loadTasks(), loadEmployees()]);
      })
      .catch(() => router.push("/connexion"))
      .finally(() => setLoading(false));
  }, [router]);

  async function loadLogs() {
    const res = await fetch("/api/task-logs");
    if (res.ok) {
      const data = await res.json();
      setLogs(data.logs || []);
    }
  }

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

    if (!form.task_id) {
      setError("Sélectionnez une tâche.");
      return;
    }

    const res = await fetch("/api/task-logs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        task_id: parseInt(form.task_id),
        employee_id: form.employee_id ? parseInt(form.employee_id) : null,
        notes: form.notes || null,
        temperature: form.temperature ? parseFloat(form.temperature) : null,
        conformity: form.conformity === "1",
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur");
      return;
    }

    setForm({ task_id: "", employee_id: "", notes: "", temperature: "", conformity: "1" });
    setShowForm(false);
    await loadLogs();
  }

  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  if (!isPro) {
    return (
      <div className="text-center py-16">
        <span className="text-5xl" aria-hidden="true">📋</span>
        <h1 className="text-2xl font-bold mt-4 mb-2">Traçabilité HACCP</h1>
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
        <h1 className="text-2xl font-bold">Traçabilité</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-primary hover:bg-primary-light text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm"
        >
          + Nouveau relevé
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5 mb-6 space-y-3">
          {error && <div className="text-danger text-sm">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tâche HACCP</label>
              <select
                value={form.task_id}
                onChange={(e) => setForm({ ...form, task_id: e.target.value })}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionner...</option>
                {tasks.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employé</label>
              <select
                value={form.employee_id}
                onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Sélectionner...</option>
                {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Température (°C)</label>
              <input
                type="number"
                step="0.1"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                placeholder="Ex: 3.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conformité</label>
              <select
                value={form.conformity}
                onChange={(e) => setForm({ ...form, conformity: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="1">Conforme</option>
                <option value="0">Non conforme</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes / Observations</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              placeholder="Observations, actions correctives..."
            />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="bg-primary hover:bg-primary-light text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors">
              Enregistrer
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700 text-sm">
              Annuler
            </button>
          </div>
        </form>
      )}

      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>Aucun relevé enregistré. Ajoutez des tâches HACCP puis enregistrez vos contrôles ici.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className={`bg-white rounded-xl border p-4 ${log.conformity ? "border-gray-200" : "border-danger/30 bg-danger/5"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm">{log.task_title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(log.completed_at).toLocaleString("fr-FR")}
                    </span>
                    {log.employee_name && (
                      <span className="text-xs text-gray-500">👤 {log.employee_name}</span>
                    )}
                    {log.temperature !== null && (
                      <span className="text-xs font-medium text-primary">🌡️ {log.temperature}°C</span>
                    )}
                  </div>
                  {log.notes && <p className="text-sm text-gray-600 mt-1">{log.notes}</p>}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${log.conformity ? "bg-success/10 text-success" : "bg-danger/10 text-danger"}`}>
                  {log.conformity ? "Conforme" : "Non conforme"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
