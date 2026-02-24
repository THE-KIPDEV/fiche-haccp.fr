import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { COMPANY } from "./company-info";

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const MARGIN = 50;

const PRIMARY = rgb(6 / 255, 95 / 255, 70 / 255); // #065f46
const TEXT = rgb(31 / 255, 41 / 255, 55 / 255);
const GRAY = rgb(107 / 255, 114 / 255, 128 / 255);
const LIGHT_GRAY = rgb(140 / 255, 140 / 255, 140 / 255);
const BORDER = rgb(224 / 255, 224 / 255, 224 / 255);
const BG_LIGHT = rgb(247 / 255, 247 / 255, 247 / 255);

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  customerEmail: string;
  customerName: string;
  description: string;
  amountCents: number;
  stripeInvoiceId?: string;
  periodStart?: string;
  periodEnd?: string;
  billingName?: string;
  billingAddress?: string;
  billingSiret?: string;
  billingTvaNumber?: string;
}

export async function generateInvoicePdf(data: InvoiceData): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);
  const { height } = page.getSize();

  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const CONTENT_WIDTH = A4_WIDTH - 2 * MARGIN;
  let y = height - MARGIN;

  // Top accent bar
  page.drawRectangle({ x: 0, y: height - 5, width: A4_WIDTH, height: 5, color: PRIMARY });

  // Company info (seller) - top left
  y -= 15;
  page.drawText(COMPANY.name, { x: MARGIN, y, size: 18, font: fontBold, color: PRIMARY });
  y -= 18;
  page.drawText(COMPANY.legalName, { x: MARGIN, y, size: 9, font: fontRegular, color: GRAY });
  y -= 12;
  page.drawText(COMPANY.address, { x: MARGIN, y, size: 9, font: fontRegular, color: GRAY });
  y -= 12;
  page.drawText(`SIRET : ${COMPANY.siret}`, { x: MARGIN, y, size: 9, font: fontRegular, color: GRAY });
  y -= 12;
  page.drawText(`TVA Intracom. : ${COMPANY.tvaIntracom}`, { x: MARGIN, y, size: 9, font: fontRegular, color: GRAY });
  y -= 12;
  page.drawText(COMPANY.email, { x: MARGIN, y, size: 9, font: fontRegular, color: GRAY });

  // FACTURE label - top right
  const factureLabel = "FACTURE";
  const factureLabelWidth = fontBold.widthOfTextAtSize(factureLabel, 28);
  page.drawText(factureLabel, {
    x: A4_WIDTH - MARGIN - factureLabelWidth, y: height - MARGIN - 15, size: 28, font: fontBold, color: PRIMARY,
  });

  const numText = `N\u00B0 ${data.invoiceNumber}`;
  const numWidth = fontRegular.widthOfTextAtSize(numText, 10);
  page.drawText(numText, {
    x: A4_WIDTH - MARGIN - numWidth, y: height - MARGIN - 42, size: 10, font: fontRegular, color: TEXT,
  });

  const dateText = `Date : ${data.date}`;
  const dateWidth = fontRegular.widthOfTextAtSize(dateText, 10);
  page.drawText(dateText, {
    x: A4_WIDTH - MARGIN - dateWidth, y: height - MARGIN - 57, size: 10, font: fontRegular, color: TEXT,
  });

  // Separator
  y -= 20;
  page.drawRectangle({ x: MARGIN, y, width: CONTENT_WIDTH, height: 0.5, color: BORDER });
  y -= 30;

  // Customer info box
  const clientName = data.billingName || data.customerName;
  const clientLines = [clientName, data.customerEmail];
  if (data.billingAddress) clientLines.push(data.billingAddress);
  if (data.billingSiret) clientLines.push(`SIRET : ${data.billingSiret}`);
  if (data.billingTvaNumber) clientLines.push(`TVA : ${data.billingTvaNumber}`);

  const boxHeight = 20 + clientLines.length * 14;
  page.drawRectangle({ x: MARGIN, y: y - boxHeight + 15, width: 280, height: boxHeight, color: BG_LIGHT });
  page.drawText("Facture a :", { x: MARGIN + 12, y: y - 5, size: 8, font: fontRegular, color: LIGHT_GRAY });
  let clientY = y - 20;
  page.drawText(clientName, { x: MARGIN + 12, y: clientY, size: 11, font: fontBold, color: TEXT });
  clientY -= 14;
  for (let i = 1; i < clientLines.length; i++) {
    page.drawText(clientLines[i], { x: MARGIN + 12, y: clientY, size: 10, font: fontRegular, color: GRAY });
    clientY -= 14;
  }

  y -= boxHeight + 20;

  // Table header
  const col1X = MARGIN;
  const col2X = MARGIN + 320;
  const col3X = MARGIN + 400;
  const col4X = MARGIN + CONTENT_WIDTH;

  page.drawRectangle({ x: MARGIN, y: y - 5, width: CONTENT_WIDTH, height: 28, color: PRIMARY });
  page.drawText("Description", { x: col1X + 10, y: y + 3, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Qte", { x: col2X, y: y + 3, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  page.drawText("Prix unit.", { x: col3X, y: y + 3, size: 9, font: fontBold, color: rgb(1, 1, 1) });
  const totalHeader = "Total";
  const totalHeaderW = fontBold.widthOfTextAtSize(totalHeader, 9);
  page.drawText(totalHeader, { x: col4X - totalHeaderW - 10, y: y + 3, size: 9, font: fontBold, color: rgb(1, 1, 1) });

  // Table row
  y -= 30;
  page.drawRectangle({ x: MARGIN, y: y - 8, width: CONTENT_WIDTH, height: 30, color: BG_LIGHT });

  const amountEur = (data.amountCents / 100).toFixed(2).replace(".", ",") + " \u20AC";
  page.drawText(data.description, { x: col1X + 10, y: y, size: 10, font: fontRegular, color: TEXT });
  page.drawText("1", { x: col2X, y: y, size: 10, font: fontRegular, color: TEXT });
  page.drawText(amountEur, { x: col3X, y: y, size: 10, font: fontRegular, color: TEXT });
  const amountWidth = fontRegular.widthOfTextAtSize(amountEur, 10);
  page.drawText(amountEur, { x: col4X - amountWidth - 10, y: y, size: 10, font: fontRegular, color: TEXT });

  // Period info (for subscriptions)
  if (data.periodStart && data.periodEnd) {
    y -= 16;
    page.drawText(`Periode : ${data.periodStart} - ${data.periodEnd}`, {
      x: col1X + 10, y, size: 8, font: fontRegular, color: GRAY,
    });
  }

  // Totals
  y -= 40;
  const totalsX = col3X - 30;

  page.drawText("Total HT", { x: totalsX, y, size: 10, font: fontRegular, color: GRAY });
  const htW = fontRegular.widthOfTextAtSize(amountEur, 10);
  page.drawText(amountEur, { x: col4X - htW - 10, y, size: 10, font: fontRegular, color: TEXT });

  y -= 20;
  page.drawText("TVA", { x: totalsX, y, size: 10, font: fontRegular, color: GRAY });
  const tvaText = "Non applicable";
  const tvaW = fontRegular.widthOfTextAtSize(tvaText, 10);
  page.drawText(tvaText, { x: col4X - tvaW - 10, y, size: 10, font: fontRegular, color: GRAY });

  y -= 8;
  page.drawRectangle({ x: totalsX, y, width: col4X - totalsX, height: 0.5, color: BORDER });

  y -= 20;
  page.drawText("Total TTC", { x: totalsX, y, size: 12, font: fontBold, color: TEXT });
  const ttcW = fontBold.widthOfTextAtSize(amountEur, 12);
  page.drawText(amountEur, { x: col4X - ttcW - 10, y, size: 12, font: fontBold, color: PRIMARY });

  // TVA note
  y -= 40;
  page.drawText("TVA non applicable, article 293 B du Code General des Impots.", {
    x: MARGIN, y, size: 8, font: fontRegular, color: LIGHT_GRAY,
  });

  // Payment info
  y -= 25;
  page.drawRectangle({ x: MARGIN, y: y - 25, width: CONTENT_WIDTH, height: 40, color: BG_LIGHT });
  page.drawText("Paiement effectue par carte bancaire via Stripe", {
    x: MARGIN + 12, y: y - 2, size: 9, font: fontRegular, color: GRAY,
  });
  if (data.stripeInvoiceId) {
    page.drawText(`Reference : ${data.stripeInvoiceId}`, {
      x: MARGIN + 12, y: y - 16, size: 8, font: fontRegular, color: LIGHT_GRAY,
    });
  }

  // Footer
  const footerY = 40;
  page.drawRectangle({ x: MARGIN, y: footerY + 15, width: CONTENT_WIDTH, height: 0.5, color: BORDER });
  const footerText = `${COMPANY.legalName} - SIRET ${COMPANY.siret} - TVA ${COMPANY.tvaIntracom}`;
  const ftW = fontRegular.widthOfTextAtSize(footerText, 7);
  page.drawText(footerText, { x: (A4_WIDTH - ftW) / 2, y: footerY, size: 7, font: fontRegular, color: LIGHT_GRAY });
  const footerText2 = COMPANY.website;
  const ft2W = fontRegular.widthOfTextAtSize(footerText2, 7);
  page.drawText(footerText2, { x: (A4_WIDTH - ft2W) / 2, y: footerY - 12, size: 7, font: fontRegular, color: PRIMARY });

  // Bottom accent bar
  page.drawRectangle({ x: 0, y: 0, width: A4_WIDTH, height: 4, color: PRIMARY });

  return pdfDoc.save();
}
