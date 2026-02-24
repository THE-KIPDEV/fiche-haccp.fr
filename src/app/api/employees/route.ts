import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();
    const employees = await query<RowDataPacket[]>(
      "SELECT id, name, role, created_at FROM employees WHERE user_id = ? ORDER BY name",
      [auth.userId]
    );

    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Employees GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    // Check subscription
    const users = await query<RowDataPacket[]>(
      "SELECT subscription_status FROM users WHERE id = ?",
      [auth.userId]
    );
    if (users.length === 0 || users[0].subscription_status !== "active") {
      return NextResponse.json({ error: "Abonnement Pro requis" }, { status: 403 });
    }

    const { name, role } = await request.json();
    if (!name) return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });

    await query(
      "INSERT INTO employees (user_id, name, role) VALUES (?, ?, ?)",
      [auth.userId, name.trim(), (role || "").trim()]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Employees POST error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
