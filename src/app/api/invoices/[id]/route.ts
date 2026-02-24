import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { query, initDatabase } from "@/lib/db";
import { generateInvoicePdf } from "@/lib/generate-invoice";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Non connecte." }, { status: 401 });
    }

    const { id } = await params;
    await initDatabase();

    const rows = await query<Array<{
      invoice_number: string;
      stripe_invoice_id: string | null;
      description: string;
      amount_cents: number;
      period_start: string | null;
      period_end: string | null;
      created_at: string;
      email: string;
      name: string;
      billing_name: string | null;
      billing_address: string | null;
      billing_siret: string | null;
      billing_tva_number: string | null;
    }>>(
      `SELECT i.invoice_number, i.stripe_invoice_id, i.description, i.amount_cents, i.period_start, i.period_end, i.created_at,
              u.email, u.name, u.billing_name, u.billing_address, u.billing_siret, u.billing_tva_number
       FROM invoices i JOIN users u ON u.id = i.user_id
       WHERE i.id = ? AND i.user_id = ?`,
      [parseInt(id), auth.userId]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Facture introuvable." }, { status: 404 });
    }

    const inv = rows[0];
    const createdAt = new Date(inv.created_at);
    const dateStr = createdAt.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

    const formatPeriod = (d: string | null) => {
      if (!d) return undefined;
      return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const pdfBytes = await generateInvoicePdf({
      invoiceNumber: inv.invoice_number,
      date: dateStr,
      customerEmail: inv.email,
      customerName: inv.billing_name || inv.name || inv.email,
      description: inv.description,
      amountCents: inv.amount_cents,
      stripeInvoiceId: inv.stripe_invoice_id || undefined,
      periodStart: formatPeriod(inv.period_start),
      periodEnd: formatPeriod(inv.period_end),
      billingName: inv.billing_name || undefined,
      billingAddress: inv.billing_address || undefined,
      billingSiret: inv.billing_siret || undefined,
      billingTvaNumber: inv.billing_tva_number || undefined,
    });

    return new NextResponse(new Uint8Array(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="facture-${inv.invoice_number}.pdf"`,
      },
    });
  } catch (err) {
    console.error("Invoice PDF error:", err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
