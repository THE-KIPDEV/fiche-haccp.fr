import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";

export async function GET() {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Non connecte." }, { status: 401 });
    }

    await initDatabase();

    const rows = await query<Array<{ billing_name: string | null; billing_address: string | null; billing_siret: string | null; billing_tva_number: string | null }>>(
      "SELECT billing_name, billing_address, billing_siret, billing_tva_number FROM users WHERE id = ?",
      [auth.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Utilisateur introuvable." }, { status: 404 });
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Billing GET error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Non connecte." }, { status: 401 });
    }

    const { billingName, billingAddress, billingSiret, billingTvaNumber } = await req.json();

    await initDatabase();

    await query(
      "UPDATE users SET billing_name = ?, billing_address = ?, billing_siret = ?, billing_tva_number = ? WHERE id = ?",
      [billingName || null, billingAddress || null, billingSiret || null, billingTvaNumber || null, auth.userId]
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Billing PUT error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
