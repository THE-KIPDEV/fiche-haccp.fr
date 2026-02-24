import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();
    const logs = await query<RowDataPacket[]>(
      `SELECT tl.id, tl.task_id, t.title as task_title,
              tl.employee_id, e.name as employee_name,
              tl.completed_at, tl.notes, tl.temperature, tl.conformity
       FROM task_logs tl
       JOIN haccp_tasks t ON tl.task_id = t.id
       LEFT JOIN employees e ON tl.employee_id = e.id
       WHERE tl.user_id = ?
       ORDER BY tl.completed_at DESC
       LIMIT 100`,
      [auth.userId]
    );

    return NextResponse.json({ logs });
  } catch (error) {
    console.error("TaskLogs GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    const users = await query<RowDataPacket[]>(
      "SELECT subscription_status FROM users WHERE id = ?",
      [auth.userId]
    );
    if (users.length === 0 || users[0].subscription_status !== "active") {
      return NextResponse.json({ error: "Abonnement Pro requis" }, { status: 403 });
    }

    const { task_id, employee_id, notes, temperature, conformity } = await request.json();

    if (!task_id) return NextResponse.json({ error: "task_id requis" }, { status: 400 });

    // Verify task belongs to user
    const tasks = await query<RowDataPacket[]>(
      "SELECT id FROM haccp_tasks WHERE id = ? AND user_id = ?",
      [task_id, auth.userId]
    );
    if (tasks.length === 0) return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });

    await query(
      "INSERT INTO task_logs (task_id, employee_id, user_id, notes, temperature, conformity) VALUES (?, ?, ?, ?, ?, ?)",
      [task_id, employee_id || null, auth.userId, notes || null, temperature ?? null, conformity !== false ? 1 : 0]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("TaskLogs POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
