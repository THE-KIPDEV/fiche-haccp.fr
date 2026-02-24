import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    const users = await query<RowDataPacket[]>(
      "SELECT stripe_customer_id FROM users WHERE id = ?",
      [auth.userId]
    );

    if (users.length === 0 || !users[0].stripe_customer_id) {
      return NextResponse.json({ error: "Aucun abonnement trouvé" }, { status: 404 });
    }

    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fiche-haccp.fr";

    const session = await stripe.billingPortal.sessions.create({
      customer: users[0].stripe_customer_id,
      return_url: `${siteUrl}/tableau-de-bord/abonnement`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Billing portal error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
