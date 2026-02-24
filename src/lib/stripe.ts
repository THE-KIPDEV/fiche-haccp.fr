import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY manquant");
    stripeInstance = new Stripe(key, { apiVersion: "2026-01-28.clover" });
  }
  return stripeInstance;
}

export const SUBSCRIPTION_PRICE_CENTS = parseInt(process.env.SUBSCRIPTION_PRICE_CENTS || "2000", 10);
