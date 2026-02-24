import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface TaskRow extends RowDataPacket {
  id: number;
  title: string;
  description: string | null;
  frequency: string;
  category: string;
  assigned_employee_id: number | null;
  assigned_employee_name: string | null;
  last_completed_at: string | null;
  completed_today: number;
}

function getTaskStatus(task: TaskRow): "completed" | "due" | "overdue" {
  if (task.completed_today > 0) return "completed";

  if (!task.last_completed_at) {
    return task.frequency === "ponctuel" ? "due" : "overdue";
  }

  const lastDone = new Date(task.last_completed_at);
  const now = new Date();
  const daysSinceLast = Math.floor(
    (now.getTime() - lastDone.getTime()) / (1000 * 60 * 60 * 24)
  );

  switch (task.frequency) {
    case "quotidien":
      return daysSinceLast >= 1 ? "due" : "completed";
    case "hebdomadaire":
      return daysSinceLast >= 7 ? "due" : "completed";
    case "mensuel":
      return daysSinceLast >= 30 ? "due" : "completed";
    case "ponctuel":
      return "completed";
    default:
      return "due";
  }
}

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth)
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    const users = await query<RowDataPacket[]>(
      "SELECT subscription_status FROM users WHERE id = ?",
      [auth.userId]
    );
    if (users.length === 0 || users[0].subscription_status !== "active") {
      return NextResponse.json(
        { error: "Abonnement Pro requis" },
        { status: 403 }
      );
    }

    const tasks = await query<TaskRow[]>(
      `SELECT
        t.id, t.title, t.description, t.frequency, t.category,
        t.assigned_employee_id, e.name as assigned_employee_name,
        (
          SELECT MAX(tl.completed_at)
          FROM task_logs tl
          WHERE tl.task_id = t.id
        ) as last_completed_at,
        (
          SELECT COUNT(*)
          FROM task_logs tl
          WHERE tl.task_id = t.id
          AND DATE(tl.completed_at) = CURDATE()
        ) as completed_today
      FROM haccp_tasks t
      LEFT JOIN employees e ON t.assigned_employee_id = e.id
      WHERE t.user_id = ? AND t.active = 1
      ORDER BY t.category, t.title`,
      [auth.userId]
    );

    const enrichedTasks = tasks.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      frequency: t.frequency,
      category: t.category,
      assigned_employee_id: t.assigned_employee_id,
      assigned_employee_name: t.assigned_employee_name,
      last_completed_at: t.last_completed_at,
      completed_today: t.completed_today,
      status: getTaskStatus(t),
    }));

    const completed = enrichedTasks.filter((t) => t.status === "completed").length;
    const due = enrichedTasks.filter((t) => t.status === "due").length;
    const overdue = enrichedTasks.filter((t) => t.status === "overdue").length;
    const total = enrichedTasks.length;

    return NextResponse.json({
      tasks: enrichedTasks,
      summary: {
        total,
        completed,
        due,
        overdue,
        completionPercent: total > 0 ? Math.round((completed / total) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Tasks-due error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
