import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getStripe, SUBSCRIPTION_PRICE_CENTS } from "@/lib/stripe";
import { query, initDatabase } from "@/lib/db";
import { RowDataPacket } from "mysql2";

export async function POST() {
  try {
    const auth = await getAuthUser();
    if (!auth) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await initDatabase();

    const users = await query<RowDataPacket[]>(
      "SELECT id, email, name, stripe_customer_id FROM users WHERE id = ?",
      [auth.userId]
    );
    if (users.length === 0) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    const user = users[0];
    const stripe = getStripe();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://fiche-haccp.fr";

    // Get or create Stripe customer
    let customerId = user.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { user_id: user.id.toString() },
      });
      customerId = customer.id;
      await query(
        "UPDATE users SET stripe_customer_id = ? WHERE id = ?",
        [customerId, user.id]
      );
    }

    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Fiche HACCP Pro",
              description: "Gestion complète HACCP : employés, tâches, traçabilité",
            },
            unit_amount: SUBSCRIPTION_PRICE_CENTS,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${siteUrl}/tableau-de-bord/abonnement?success=true`,
      cancel_url: `${siteUrl}/tableau-de-bord/abonnement?canceled=true`,
      metadata: {
        user_id: user.id.toString(),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Erreur de création du paiement" }, { status: 500 });
  }
}
