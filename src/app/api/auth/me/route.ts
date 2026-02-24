import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  restaurant_name: string;
  subscription_status: string;
}

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    await initDatabase();

    const users = await query<UserRow[]>(
      "SELECT id, email, name, restaurant_name, subscription_status, billing_name, billing_address, billing_siret, billing_tva_number FROM users WHERE id = ?",
      [auth.userId]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    return NextResponse.json({ user: users[0] });
  } catch (error) {
    console.error("Me error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
