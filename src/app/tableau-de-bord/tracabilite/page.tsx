"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle, Circle, Clock, AlertTriangle,
  Thermometer, SprayCan, ClipboardList, Package, Wrench, CheckSquare,
  Filter,
} from "lucide-react";
import { TASK_CATEGORIES } from "@/lib/constants";

interface DueTask {
  id: number;
  title: string;
  frequency: string;
  category: string;
  assigned_employee_id: number | null;
  assigned_employee_name: string | null;
  completed_today: number;
  status: "completed" | "due" | "overdue";
}

interface Employee {
  id: number;
  name: string;
}

interface TaskLog {
  id: number;
  task_id: number;
  task_title: string;
  category?: string;
  employee_id: number | null;
  employee_name: string | null;
  completed_at: string;
  notes: string | null;
  temperature: number | null;
  conformity: boolean;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  temperatures: Thermometer,
  nettoyage: SprayCan,
  tracabilite: ClipboardList,
  reception: Package,
  equipement: Wrench,
  general: CheckSquare,
};

export default function TracabilitePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isPro, setIsPro] = useState(false);
  const [tab, setTab] = useState<"today" | "history">("today");

  // Today's data
  const [dueTasks, setDueTasks] = useState<DueTask[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // History data
  const [logs, setLogs] = useState<TaskLog[]>([]);
  const [filterDays, setFilterDays] = useState("7");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterEmployee, setFilterEmployee] = useState("");

  const loadDueTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks-due");
      if (res.ok) {
        const data = await res.json();
        setDueTasks(data.tasks || []);
      }
    } catch { /* ignore */ }
  }, []);

  const loadLogs = useCallback(async () => {
    const params = new URLSearchParams();
    if (filterDays) params.set("days", filterDays);
    if (filterCategory) params.set("category", filterCategory);
    if (filterEmployee) params.set("employee_id", filterEmployee);
    try {
      const res = await fetch(`/api/task-logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch { /* ignore */ }
  }, [filterDays, filterCategory, filterEmployee]);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => { if (!r.ok) { router.push("/connexion"); return null; } return r.json(); })
      .then((data) => {
        if (!data) return;
        const pro = data.user.subscription_status === "active";
        setIsPro(pro);
        if (pro) {
          loadDueTasks();
          loadLogs();
          fetch("/api/employees").then(r => r.ok ? r.json() : null).then(d => { if (d) setEmployees(d.employees || []); }).catch(() => {});
        }
      })
      .catch(() => router.push("/connexion"))
      .finally(() => setLoading(false));
  }, [router, loadDueTasks, loadLogs]);

  useEffect(() => {
    if (isPro && tab === "history") loadLogs();
  }, [isPro, tab, loadLogs]);

  if (loading) return <div className="text-center py-12 text-gray-500">Chargement...</div>;

  if (!isPro) {
    return (
      <div className="text-center py-16">
        <ClipboardList className="w-12 h-12 text-gray-300 mx-auto" />
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
      <h1 className="text-2xl font-bold mb-4">Traçabilité</h1>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6 w-fit">
        <button
          onClick={() => setTab("today")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "today" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Aujourd&apos;hui
        </button>
        <button
          onClick={() => setTab("history")}
          className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === "history" ? "bg-white text-primary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
        >
          Historique
        </button>
      </div>

      {tab === "today" ? (
        <TodayView tasks={dueTasks} employees={employees} onLogged={loadDueTasks} />
      ) : (
        <HistoryView
          logs={logs}
          employees={employees}
          filterDays={filterDays} setFilterDays={setFilterDays}
          filterCategory={filterCategory} setFilterCategory={setFilterCategory}
          filterEmployee={filterEmployee} setFilterEmployee={setFilterEmployee}
        />
      )}
    </div>
  );
}

/* ---- Today's checklist ---- */

function TodayView({ tasks, employees, onLogged }: { tasks: DueTask[]; employees: Employee[]; onLogged: () => void }) {
  const tasksByCategory = new Map<string, DueTask[]>();
  for (const task of tasks) {
    const existing = tasksByCategory.get(task.category) || [];
    existing.push(task);
    tasksByCategory.set(task.category, existing);
  }

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === "completed").length;

  if (total === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">Aucune tâche HACCP créée.</p>
        <a href="/tableau-de-bord/taches" className="text-primary hover:underline font-medium text-sm mt-2 inline-block">
          Créer vos premières tâches
        </a>
      </div>
    );
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 mb-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">Progression du jour</span>
            <span className="text-sm font-bold text-primary">{completed}/{total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all duration-500"
              style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      {TASK_CATEGORIES.map(cat => {
        const catTasks = tasksByCategory.get(cat.value);
        if (!catTasks || catTasks.length === 0) return null;
        const done = catTasks.filter(t => t.status === "completed").length;
        const Icon = CATEGORY_ICONS[cat.value] || CheckSquare;

        return (
          <div key={cat.value} className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">{cat.label}</h3>
              <span className={`text-xs font-medium ml-auto ${done === catTasks.length ? "text-emerald-600" : "text-gray-400"}`}>
                {done}/{catTasks.length}
              </span>
            </div>
            <div className="space-y-1">
              {catTasks.map(task => (
                <InlineTaskRow key={task.id} task={task} employees={employees} onLogged={onLogged} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function InlineTaskRow({ task, employees, onLogged }: { task: DueTask; employees: Employee[]; onLogged: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [conformity, setConformity] = useState(true);
  const [notes, setNotes] = useState("");
  const [employeeId, setEmployeeId] = useState(task.assigned_employee_id?.toString() || "");

  if (task.status === "completed") {
    return (
      <div className="flex items-center gap-3 bg-emerald-50/60 rounded-lg px-4 py-3">
        <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
        <span className="text-sm text-gray-500 line-through flex-1">{task.title}</span>
      </div>
    );
  }

  const isOverdue = task.status === "overdue";
  const isTemp = task.category === "temperatures";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        task_id: task.id,
        conformity,
        notes: notes || null,
        employee_id: employeeId ? parseInt(employeeId) : null,
      };
      if (isTemp && temperature) body.temperature = parseFloat(temperature);

      const res = await fetch("/api/task-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setOpen(false);
        setTemperature("");
        setNotes("");
        setConformity(true);
        onLogged();
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={`rounded-lg border ${isOverdue ? "border-red-200 bg-red-50/50" : "border-amber-200 bg-amber-50/50"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full px-4 py-3 text-left"
      >
        {isOverdue ? (
          <Clock className="w-4 h-4 text-red-400 shrink-0" />
        ) : (
          <Circle className="w-4 h-4 text-amber-400 shrink-0" />
        )}
        <span className="text-sm font-medium flex-1">{task.title}</span>
        {task.assigned_employee_name && (
          <span className="text-xs text-gray-400 hidden sm:inline">{task.assigned_employee_name}</span>
        )}
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${isOverdue ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>
          {isOverdue ? "En retard" : "À faire"}
        </span>
      </button>

      {open && (
        <form onSubmit={handleSubmit} className="px-4 pb-4 pt-1 border-t border-gray-200/60">
          <div className="flex flex-wrap gap-2 items-end">
            {isTemp && (
              <div className="w-24">
                <label className="text-xs text-gray-500 block mb-1">Temp. (°C)</label>
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={temperature}
                  onChange={e => setTemperature(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
                  placeholder="3.2"
                />
              </div>
            )}
            <div className="w-32">
              <label className="text-xs text-gray-500 block mb-1">Conformité</label>
              <select
                value={conformity ? "1" : "0"}
                onChange={e => setConformity(e.target.value === "1")}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
              >
                <option value="1">Conforme</option>
                <option value="0">Non conforme</option>
              </select>
            </div>
            {employees.length > 0 && (
              <div className="w-36">
                <label className="text-xs text-gray-500 block mb-1">Employé</label>
                <select
                  value={employeeId}
                  onChange={e => setEmployeeId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
                >
                  <option value="">—</option>
                  {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                </select>
              </div>
            )}
            <div className="flex-1 min-w-28">
              <label className="text-xs text-gray-500 block mb-1">Notes</label>
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm"
                placeholder="Optionnel..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {submitting ? "..." : "Valider"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

/* ---- History view with filters ---- */

function HistoryView({
  logs, employees,
  filterDays, setFilterDays,
  filterCategory, setFilterCategory,
  filterEmployee, setFilterEmployee,
}: {
  logs: TaskLog[];
  employees: Employee[];
  filterDays: string; setFilterDays: (v: string) => void;
  filterCategory: string; setFilterCategory: (v: string) => void;
  filterEmployee: string; setFilterEmployee: (v: string) => void;
}) {
  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
        </div>
        <select
          value={filterDays}
          onChange={e => setFilterDays(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="1">Aujourd&apos;hui</option>
          <option value="7">7 derniers jours</option>
          <option value="30">30 derniers jours</option>
          <option value="">Tout</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
        >
          <option value="">Toutes catégories</option>
          {TASK_CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
        {employees.length > 0 && (
          <select
            value={filterEmployee}
            onChange={e => setFilterEmployee(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
          >
            <option value="">Tous employés</option>
            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.name}</option>)}
          </select>
        )}
      </div>

      {logs.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p>Aucun relevé pour cette période.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <div key={log.id} className={`bg-white rounded-xl border p-4 ${log.conformity ? "border-gray-200" : "border-red-200 bg-red-50/30"}`}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-sm">{log.task_title}</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <span className="text-xs text-gray-500">
                      {new Date(log.completed_at).toLocaleString("fr-FR")}
                    </span>
                    {log.employee_name && (
                      <span className="text-xs text-gray-500">{log.employee_name}</span>
                    )}
                    {log.temperature !== null && (
                      <span className="text-xs font-medium text-primary">{log.temperature}°C</span>
                    )}
                    {log.category && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                        {TASK_CATEGORIES.find(c => c.value === log.category)?.label || log.category}
                      </span>
                    )}
                  </div>
                  {log.notes && <p className="text-sm text-gray-600 mt-1">{log.notes}</p>}
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full shrink-0 ${log.conformity ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
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
