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

    // Verify ownership
    const existing = await query<RowDataPacket[]>(
      "SELECT id FROM employees WHERE id = ? AND user_id = ?",
      [id, auth.userId]
    );
    if (existing.length === 0) return NextResponse.json({ error: "Employé non trouvé" }, { status: 404 });

    const { name, role } = await request.json();
    if (!name) return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });

    await query(
      "UPDATE employees SET name = ?, role = ? WHERE id = ? AND user_id = ?",
      [name.trim(), (role || "").trim(), id, auth.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Employee PUT error:", error);
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
      "DELETE FROM employees WHERE id = ? AND user_id = ?",
      [id, auth.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Employee DELETE error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
