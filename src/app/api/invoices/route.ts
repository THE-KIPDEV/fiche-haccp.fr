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

    const invoices = await query<Array<{
      id: number;
      invoice_number: string;
      description: string;
      amount_cents: number;
      period_start: string | null;
      period_end: string | null;
      created_at: string;
    }>>(
      "SELECT id, invoice_number, description, amount_cents, period_start, period_end, created_at FROM invoices WHERE user_id = ? ORDER BY created_at DESC",
      [auth.userId]
    );

    return NextResponse.json({ invoices });
  } catch (err) {
    console.error("Invoices list error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
