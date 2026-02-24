import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { id } = await params;
    await initDatabase();

    const existing = await query<RowDataPacket[]>(
      "SELECT id FROM haccp_tasks WHERE id = ? AND user_id = ?",
      [id, auth.userId]
    );
    if (existing.length === 0) return NextResponse.json({ error: "Tâche non trouvée" }, { status: 404 });

    const { title, description, frequency, category, assigned_employee_id } = await request.json();
    if (!title) return NextResponse.json({ error: "Le titre est requis" }, { status: 400 });

    await query(
      "UPDATE haccp_tasks SET title = ?, description = ?, frequency = ?, category = ?, assigned_employee_id = ? WHERE id = ? AND user_id = ?",
      [title.trim(), description || null, frequency || "quotidien", category || "general", assigned_employee_id || null, id, auth.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Task PUT error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { id } = await params;
    await initDatabase();

    await query(
      "DELETE FROM haccp_tasks WHERE id = ? AND user_id = ?",
      [id, auth.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Task DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
