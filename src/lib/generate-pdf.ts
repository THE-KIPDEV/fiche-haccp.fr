import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont, PDFImage } from "pdf-lib";
import { FicheHACCP, FICHES } from "./fiches";

// Default colors
const DEFAULT_PRIMARY = { r: 6 / 255, g: 95 / 255, b: 70 / 255 };
const TEXT_COLOR = rgb(31 / 255, 41 / 255, 55 / 255);
const GRAY = rgb(107 / 255, 114 / 255, 128 / 255);
const LIGHT_BG = rgb(245 / 255, 245 / 255, 245 / 255);
const WHITE = rgb(1, 1, 1);
const LINE_COLOR = rgb(220 / 255, 220 / 255, 220 / 255);

const MARGIN = 40;
const HEADER_HEIGHT = 55;
const FOOTER_HEIGHT = 28;
const ROW_HEIGHT = 20;
const HEADER_ROW_HEIGHT = 22;

export interface PdfBuilderOptions {
  fiche: FicheHACCP;
  orientation?: "portrait" | "landscape";
  rowCount?: number;
  selectedFields?: string[];
  headerColor?: { r: number; g: number; b: number };
  restaurantName?: string;
  logoBytes?: Uint8Array;
  logoMimeType?: string;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      }
    : DEFAULT_PRIMARY;
}

function lightenColor(c: { r: number; g: number; b: number }, amount: number) {
  return {
    r: Math.min(1, c.r + amount),
    g: Math.min(1, c.g + amount),
    b: Math.min(1, c.b + amount),
  };
}

function calculateColumnWidths(
  fields: string[],
  font: PDFFont,
  totalWidth: number,
  fontSize: number
): number[] {
  const minColWidth = 45;
  const padding = 10;

  const labelWidths = fields.map(
    (f) => Math.max(font.widthOfTextAtSize(f, fontSize) + padding, minColWidth)
  );

  const totalRequested = labelWidths.reduce((a, b) => a + b, 0);

  if (totalRequested <= totalWidth) {
    const remaining = totalWidth - totalRequested;
    return labelWidths.map(
      (w) => w + (w / totalRequested) * remaining
    );
  }

  const scale = totalWidth / totalRequested;
  return labelWidths.map((w) => Math.max(w * scale, minColWidth));
}

function drawHeader(
  page: PDFPage,
  font: PDFFont,
  boldFont: PDFFont,
  fiche: FicheHACCP,
  primaryColor: { r: number; g: number; b: number },
  pageW: number,
  pageH: number,
  restaurantName?: string,
  logoImage?: PDFImage
) {
  const primary = rgb(primaryColor.r, primaryColor.g, primaryColor.b);

  page.drawRectangle({
    x: 0,
    y: pageH - HEADER_HEIGHT,
    width: pageW,
    height: HEADER_HEIGHT,
    color: primary,
  });

  let textX = MARGIN;

  if (logoImage) {
    const logoMaxH = HEADER_HEIGHT - 12;
    const logoMaxW = 80;
    const scale = Math.min(
      logoMaxW / logoImage.width,
      logoMaxH / logoImage.height
    );
    const logoW = logoImage.width * scale;
    const logoH = logoImage.height * scale;

    page.drawImage(logoImage, {
      x: MARGIN,
      y: pageH - HEADER_HEIGHT + (HEADER_HEIGHT - logoH) / 2,
      width: logoW,
      height: logoH,
    });
    textX = MARGIN + logoW + 10;
  }

  const titleText = restaurantName
    ? `${restaurantName} — ${fiche.shortTitle}`
    : fiche.shortTitle;

  page.drawText(titleText, {
    x: textX,
    y: pageH - 25,
    size: 12,
    font: boldFont,
    color: WHITE,
    maxWidth: pageW - textX - MARGIN,
  });

  page.drawText(fiche.legalBasis.substring(0, 80) + "...", {
    x: textX,
    y: pageH - 42,
    size: 7,
    font,
    color: rgb(
      Math.min(1, primaryColor.r + 0.4),
      Math.min(1, primaryColor.g + 0.4),
      Math.min(1, primaryColor.b + 0.4)
    ),
    maxWidth: pageW - textX - MARGIN,
  });

  // Frequency badge below header
  const contentW = pageW - MARGIN * 2;
  page.drawText(`Fréquence : ${fiche.frequency}`, {
    x: MARGIN,
    y: pageH - HEADER_HEIGHT - 16,
    size: 8,
    font: boldFont,
    color: primary,
  });

  return pageH - HEADER_HEIGHT - 28;
}

function drawTableHeader(
  page: PDFPage,
  boldFont: PDFFont,
  y: number,
  fields: string[],
  colWidths: number[],
  primaryColor: { r: number; g: number; b: number }
) {
  const primary = rgb(primaryColor.r, primaryColor.g, primaryColor.b);
  const contentW = colWidths.reduce((a, b) => a + b, 0);

  page.drawRectangle({
    x: MARGIN,
    y: y - HEADER_ROW_HEIGHT,
    width: contentW,
    height: HEADER_ROW_HEIGHT,
    color: primary,
  });

  let x = MARGIN + 4;
  fields.forEach((field, i) => {
    const maxW = colWidths[i] - 8;
    const fontSize = field.length > 15 ? 6 : 7;
    page.drawText(field, {
      x,
      y: y - HEADER_ROW_HEIGHT + 7,
      size: fontSize,
      font: boldFont,
      color: WHITE,
      maxWidth: maxW,
    });
    x += colWidths[i];
  });

  return y - HEADER_ROW_HEIGHT;
}

function drawTableRows(
  page: PDFPage,
  font: PDFFont,
  y: number,
  rowCount: number,
  colWidths: number[],
  primaryColor: { r: number; g: number; b: number }
) {
  let currentY = y;
  const contentW = colWidths.reduce((a, b) => a + b, 0);
  const altBg = rgb(
    Math.min(1, primaryColor.r * 0.05 + 0.95),
    Math.min(1, primaryColor.g * 0.05 + 0.95),
    Math.min(1, primaryColor.b * 0.05 + 0.95)
  );

  for (let r = 0; r < rowCount; r++) {
    const bg = r % 2 === 0 ? WHITE : altBg;
    page.drawRectangle({
      x: MARGIN,
      y: currentY - ROW_HEIGHT,
      width: contentW,
      height: ROW_HEIGHT,
      color: bg,
    });

    // Column separators
    let x = MARGIN;
    colWidths.forEach((w) => {
      page.drawLine({
        start: { x, y: currentY },
        end: { x, y: currentY - ROW_HEIGHT },
        thickness: 0.3,
        color: LINE_COLOR,
      });
      x += w;
    });

    // Right border
    page.drawLine({
      start: { x, y: currentY },
      end: { x, y: currentY - ROW_HEIGHT },
      thickness: 0.3,
      color: LINE_COLOR,
    });

    // Bottom border
    page.drawLine({
      start: { x: MARGIN, y: currentY - ROW_HEIGHT },
      end: { x: MARGIN + contentW, y: currentY - ROW_HEIGHT },
      thickness: 0.3,
      color: LINE_COLOR,
    });

    currentY -= ROW_HEIGHT;
  }

  return currentY;
}

function drawFooter(
  page: PDFPage,
  font: PDFFont,
  pageW: number,
  primaryColor: { r: number; g: number; b: number }
) {
  const lighter = lightenColor(primaryColor, 0.15);
  page.drawRectangle({
    x: 0,
    y: 0,
    width: pageW,
    height: FOOTER_HEIGHT,
    color: rgb(lighter.r, lighter.g, lighter.b),
  });

  page.drawText(
    "fiche-haccp.fr — Conforme à la réglementation française",
    {
      x: MARGIN,
      y: 10,
      size: 7,
      font,
      color: WHITE,
    }
  );

  page.drawText(`${new Date().toLocaleDateString("fr-FR")}`, {
    x: pageW - MARGIN - 60,
    y: 10,
    size: 7,
    font,
    color: WHITE,
  });
}

export async function generateFichePDF(
  options: PdfBuilderOptions
): Promise<Uint8Array> {
  const {
    fiche,
    orientation = "portrait",
    rowCount = 30,
    selectedFields,
    headerColor = DEFAULT_PRIMARY,
    restaurantName,
    logoBytes,
    logoMimeType,
  } = options;

  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageW = orientation === "landscape" ? 841.89 : 595.28;
  const pageH = orientation === "landscape" ? 595.28 : 841.89;
  const contentW = pageW - MARGIN * 2;

  // Embed logo if provided
  let logoImage: PDFImage | undefined;
  if (logoBytes && logoMimeType) {
    try {
      if (logoMimeType.includes("png")) {
        logoImage = await doc.embedPng(logoBytes);
      } else {
        logoImage = await doc.embedJpg(logoBytes);
      }
    } catch {
      // Skip logo on error
    }
  }

  // Determine fields to use
  const allFields = fiche.pdfSections[0]?.fields || [];
  const fields = selectedFields
    ? allFields.filter((f) => selectedFields.includes(f))
    : allFields;

  if (fields.length === 0) return doc.save();

  // Calculate how many rows fit per page
  const availableHeight =
    pageH - HEADER_HEIGHT - 28 - HEADER_ROW_HEIGHT - FOOTER_HEIGHT - 20;
  const maxRowsPerPage = Math.floor(availableHeight / ROW_HEIGHT);
  const totalRows = Math.min(rowCount, 100);
  const totalPages = Math.ceil(totalRows / maxRowsPerPage);

  const colWidths = calculateColumnWidths(fields, boldFont, contentW, 7);

  let remainingRows = totalRows;

  for (let p = 0; p < totalPages; p++) {
    const page = doc.addPage([pageW, pageH]);
    let y = drawHeader(
      page,
      font,
      boldFont,
      fiche,
      headerColor,
      pageW,
      pageH,
      restaurantName,
      logoImage
    );

    y = drawTableHeader(page, boldFont, y, fields, colWidths, headerColor);

    const rowsThisPage = Math.min(remainingRows, maxRowsPerPage);
    y = drawTableRows(page, font, y, rowsThisPage, colWidths, headerColor);
    remainingRows -= rowsThisPage;

    drawFooter(page, font, pageW, headerColor);
  }

  return doc.save();
}

export async function generateAllFichesPDF(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const pageW = 595.28;
  const pageH = 841.89;

  // Cover page
  const cover = doc.addPage([pageW, pageH]);
  const primary = rgb(DEFAULT_PRIMARY.r, DEFAULT_PRIMARY.g, DEFAULT_PRIMARY.b);

  cover.drawRectangle({
    x: 0,
    y: pageH - 160,
    width: pageW,
    height: 160,
    color: primary,
  });

  cover.drawText("FICHES HACCP", {
    x: MARGIN,
    y: pageH - 65,
    size: 32,
    font: boldFont,
    color: WHITE,
  });

  cover.drawText("Pack complet — Toutes les fiches de contrôle HACCP", {
    x: MARGIN,
    y: pageH - 95,
    size: 12,
    font,
    color: WHITE,
  });

  cover.drawText("Conformes à la réglementation française en vigueur", {
    x: MARGIN,
    y: pageH - 115,
    size: 10,
    font,
    color: rgb(0.8, 0.9, 0.85),
  });

  cover.drawText("fiche-haccp.fr", {
    x: MARGIN,
    y: pageH - 140,
    size: 9,
    font,
    color: WHITE,
  });

  let y = pageH - 200;
  cover.drawText("Contenu du pack :", {
    x: MARGIN,
    y,
    size: 13,
    font: boldFont,
    color: primary,
  });
  y -= 28;

  for (const fiche of FICHES) {
    cover.drawText(`•  ${fiche.title}`, {
      x: MARGIN + 8,
      y,
      size: 10,
      font,
      color: TEXT_COLOR,
      maxWidth: pageW - MARGIN * 2 - 16,
    });
    y -= 20;
  }

  drawFooter(cover, font, pageW, DEFAULT_PRIMARY);

  // Generate each fiche and merge
  for (const fiche of FICHES) {
    const fichePdf = await generateFichePDF({ fiche });
    const ficheDoc = await PDFDocument.load(fichePdf);
    const pages = await doc.copyPages(ficheDoc, ficheDoc.getPageIndices());
    pages.forEach((p) => doc.addPage(p));
  }

  return doc.save();
}
