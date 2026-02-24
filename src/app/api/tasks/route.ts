import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();
    const tasks = await query<RowDataPacket[]>(
      `SELECT t.id, t.title, t.description, t.frequency, t.category,
              t.assigned_employee_id, t.active, e.name as assigned_employee_name
       FROM haccp_tasks t
       LEFT JOIN employees e ON t.assigned_employee_id = e.id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [auth.userId]
    );

    return NextResponse.json({ tasks });
  } catch (error) {
    console.error("Tasks GET error:", error);
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

    const { title, description, frequency, category, assigned_employee_id } = await request.json();
    if (!title) return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });

    await query(
      "INSERT INTO haccp_tasks (user_id, title, description, frequency, category, assigned_employee_id) VALUES (?, ?, ?, ?, ?, ?)",
      [auth.userId, title.trim(), description || null, frequency || "quotidien", category || "general", assigned_employee_id || null]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Tasks POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
