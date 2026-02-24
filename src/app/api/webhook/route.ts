import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { query, initDatabase } from "@/lib/db";
import { sendMail, subscriptionConfirmEmailHtml, subscriptionCancelEmailHtml } from "@/lib/mail";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");

    if (!signature) {
      return NextResponse.json({ error: "Signature manquante" }, { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret non configuré" }, { status: 500 });
    }

    const stripe = getStripe();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
    }

    await initDatabase();

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.user_id;
        const subscriptionId = session.subscription as string;

        if (userId && subscriptionId) {
          await query(
            "UPDATE users SET subscription_status = 'active', subscription_id = ? WHERE id = ?",
            [subscriptionId, userId]
          );

          // Send confirmation email
          try {
            const users = await query<Array<{ name: string; email: string }>>(
              "SELECT name, email FROM users WHERE id = ?",
              [userId]
            );
            if (users[0]) {
              await sendMail({
                to: users[0].email,
                toName: users[0].name,
                subject: "Abonnement Pro activé — Fiche HACCP",
                html: subscriptionConfirmEmailHtml(users[0].name),
              });
            }
          } catch {
            // Non-blocking
          }
        }
        break;
      }

      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as unknown as { subscription: string }).subscription;

        if (subscriptionId) {
          await query(
            "UPDATE users SET subscription_status = 'active' WHERE subscription_id = ?",
            [subscriptionId]
          );
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = (invoice as unknown as { subscription: string }).subscription;

        if (subscriptionId) {
          await query(
            "UPDATE users SET subscription_status = 'past_due' WHERE subscription_id = ?",
            [subscriptionId]
          );
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        // Send cancellation email
        try {
          const users = await query<Array<{ name: string; email: string }>>(
            "SELECT name, email FROM users WHERE subscription_id = ?",
            [subscription.id]
          );
          if (users[0]) {
            await sendMail({
              to: users[0].email,
              toName: users[0].name,
              subject: "Abonnement annulé — Fiche HACCP",
              html: subscriptionCancelEmailHtml(users[0].name),
            });
          }
        } catch {
          // Non-blocking
        }

        await query(
          "UPDATE users SET subscription_status = 'canceled', subscription_id = NULL WHERE subscription_id = ?",
          [subscription.id]
        );
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const status = subscription.status === "active" ? "active" :
                       subscription.status === "past_due" ? "past_due" : "canceled";

        await query(
          "UPDATE users SET subscription_status = ? WHERE subscription_id = ?",
          [status, subscription.id]
        );
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Erreur webhook" }, { status: 500 });
  }
}
