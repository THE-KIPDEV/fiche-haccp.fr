import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    const users = await query<RowDataPacket[]>(
      "SELECT reminder_enabled FROM users WHERE id = ?",
      [auth.userId]
    );

    return NextResponse.json({
      reminder_enabled: users[0]?.reminder_enabled !== 0,
    });
  } catch (error) {
    console.error("Preferences GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    const { reminder_enabled } = await request.json();

    await query(
      "UPDATE users SET reminder_enabled = ? WHERE id = ?",
      [reminder_enabled ? 1 : 0, auth.userId]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Preferences PUT error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
