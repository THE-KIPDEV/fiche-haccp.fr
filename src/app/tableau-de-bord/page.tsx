"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText, Users, CheckSquare, ClipboardList, AlertTriangle,
  Thermometer, SprayCan, Package, Wrench, CheckCircle, Circle, Clock,
} from "lucide-react";
import { TASK_CATEGORIES, FREQUENCIES } from "@/lib/constants";
import { FicheIcon } from "@/components/FicheIcon";

interface UserInfo {
  id: number;
  name: string;
  email: string;
  restaurant_name: string;
  subscription_status: string;
}

interface DueTask {
  id: number;
  title: string;
  description: string | null;
  frequency: string;
  category: string;
  assigned_employee_id: number | null;
  assigned_employee_name: string | null;
  last_completed_at: string | null;
  completed_today: number;
  status: "completed" | "due" | "overdue";
}

interface DueSummary {
  total: number;
  completed: number;
  due: number;
  overdue: number;
  completionPercent: number;
}

interface Employee {
  id: number;
  name: string;
}

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  temperatures: Thermometer,
  nettoyage: SprayCan,
  tracabilite: ClipboardList,
  reception: Package,
  equipement: Wrench,
  general: CheckSquare,
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [tasks, setTasks] = useState<DueTask[]>([]);
  const [summary, setSummary] = useState<DueSummary | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadDueTasks = useCallback(async () => {
    try {
      const res = await fetch("/api/tasks-due");
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        setSummary(data.summary || null);
      }
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => { if (!r.ok) { router.push("/connexion"); return null; } return r.json(); })
      .then((data) => {
        if (!data) return;
        setUser(data.user);
        if (data.user.subscription_status === "active") {
          loadDueTasks();
          fetch("/api/employees").then(r => r.ok ? r.json() : null).then(d => { if (d) setEmployees(d.employees || []); }).catch(() => {});
        }
      })
      .catch(() => router.push("/connexion"))
      .finally(() => setLoading(false));
  }, [router, loadDueTasks]);

  if (loading || !user) {
    return <div className="text-center py-12 text-gray-500">Chargement...</div>;
  }

  const isPro = user.subscription_status === "active";

  if (!isPro) return <FreeUserDashboard user={user} />;

  const tasksByCategory = new Map<string, DueTask[]>();
  for (const task of tasks) {
    const existing = tasksByCategory.get(task.category) || [];
    existing.push(task);
    tasksByCategory.set(task.category, existing);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Bonjour {user.name}</h1>
        {user.restaurant_name && <p className="text-gray-500">{user.restaurant_name}</p>}
      </div>

      {/* Progress bar + stats */}
      {summary && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <div className="flex items-center gap-6">
            <ProgressCircle percent={summary.completionPercent} />
            <div className="flex-1 grid grid-cols-3 gap-3">
              <MiniStat label="Complétées" value={summary.completed} color="text-emerald-600" bg="bg-emerald-50" />
              <MiniStat label="À faire" value={summary.due} color="text-amber-600" bg="bg-amber-50" />
              <MiniStat label="En retard" value={summary.overdue} color="text-red-600" bg="bg-red-50" />
            </div>
          </div>
        </div>
      )}

      {/* Overdue alert */}
      {summary && summary.overdue > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h2 className="font-bold text-red-700">
              {summary.overdue} tâche{summary.overdue > 1 ? "s" : ""} en retard
            </h2>
          </div>
          <div className="space-y-2">
            {tasks.filter(t => t.status === "overdue").map(task => (
              <QuickLogRow
                key={task.id}
                task={task}
                employees={employees}
                onLogged={loadDueTasks}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tasks by category */}
      {TASK_CATEGORIES.map(cat => {
        const catTasks = tasksByCategory.get(cat.value);
        if (!catTasks || catTasks.length === 0) return null;
        const done = catTasks.filter(t => t.status === "completed").length;
        const Icon = CATEGORY_ICONS[cat.value] || CheckSquare;

        return (
          <details key={cat.value} className="mb-3 group" open>
            <summary className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:bg-gray-50 list-none">
              <Icon className="w-5 h-5 text-primary" />
              <span className="font-semibold flex-1">{cat.label}</span>
              <span className={`text-sm font-medium ${done === catTasks.length ? "text-emerald-600" : "text-gray-500"}`}>
                {done}/{catTasks.length}
              </span>
            </summary>
            <div className="mt-1 space-y-1 pl-2">
              {catTasks.map(task => (
                <QuickLogRow
                  key={task.id}
                  task={task}
                  employees={employees}
                  onLogged={loadDueTasks}
                />
              ))}
            </div>
          </details>
        );
      })}

      {tasks.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <CheckSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 mb-4">Aucune tâche HACCP créée.</p>
          <Link href="/tableau-de-bord/taches" className="text-primary hover:underline font-medium text-sm">
            Créer vos premières tâches
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <h2 className="text-lg font-bold mt-8 mb-4">Accès rapide</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <QuickAction href="/tableau-de-bord/fiches" icon={FileText} label="Fiches PDF" />
        <QuickAction href="/tableau-de-bord/employes" icon={Users} label="Employés" />
        <QuickAction href="/tableau-de-bord/taches" icon={CheckSquare} label="Tâches" />
        <QuickAction href="/tableau-de-bord/tracabilite" icon={ClipboardList} label="Historique" />
      </div>
    </div>
  );
}

/* ---- Sub-components ---- */

function FreeUserDashboard({ user }: { user: UserInfo }) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Bonjour {user.name}</h1>
        {user.restaurant_name && <p className="text-gray-500">{user.restaurant_name}</p>}
      </div>
      <div className="bg-accent/10 border border-accent/30 rounded-xl p-5 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <h2 className="font-bold text-lg">Passez au plan Pro</h2>
            <p className="text-sm text-gray-600 mt-1">
              Débloquez la gestion des employés, le suivi des tâches HACCP et la traçabilité pour 20€/mois.
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/tableau-de-bord/fiches" className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-semibold">Fiches HACCP</h3>
          <p className="text-sm text-gray-500 mt-1">Télécharger ou personnaliser</p>
        </Link>
      </div>
    </div>
  );
}

function ProgressCircle({ percent }: { percent: number }) {
  const r = 36;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="#e5e7eb" strokeWidth="6" />
        <circle
          cx="40" cy="40" r={r} fill="none"
          stroke="#065f46" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-primary">
        {percent}%
      </span>
    </div>
  );
}

function MiniStat({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  return (
    <div className={`${bg} rounded-lg p-3 text-center`}>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-gray-600 mt-0.5">{label}</p>
    </div>
  );
}

function QuickAction({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link href={href} className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow text-center">
      <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}

function QuickLogRow({ task, employees, onLogged }: { task: DueTask; employees: Employee[]; onLogged: () => void }) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [temperature, setTemperature] = useState("");
  const [conformity, setConformity] = useState(true);
  const [notes, setNotes] = useState("");
  const [employeeId, setEmployeeId] = useState(task.assigned_employee_id?.toString() || "");

  if (task.status === "completed") {
    return (
      <div className="flex items-center gap-3 bg-emerald-50/50 rounded-lg px-4 py-3">
        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
        <span className="text-sm text-gray-500 line-through flex-1">{task.title}</span>
        <span className="text-xs text-gray-400">
          {task.completed_today > 0 && "Fait"}
        </span>
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
          <Clock className="w-5 h-5 text-red-400 shrink-0" />
        ) : (
          <Circle className="w-5 h-5 text-amber-400 shrink-0" />
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
            <div className="flex-1 min-w-[120px]">
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
              className="bg-primary hover:bg-primary-light text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors disabled:opacity-50 min-h-[34px]"
            >
              {submitting ? "..." : "Valider"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
