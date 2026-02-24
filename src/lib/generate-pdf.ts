import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from "pdf-lib";
import { FicheHACCP, FICHES } from "./fiches";

const PRIMARY = rgb(6 / 255, 95 / 255, 70 / 255);
const PRIMARY_LIGHT = rgb(5 / 255, 150 / 255, 105 / 255);
const TEXT_COLOR = rgb(31 / 255, 41 / 255, 55 / 255);
const GRAY = rgb(107 / 255, 114 / 255, 128 / 255);
const LIGHT_BG = rgb(249 / 255, 250 / 255, 251 / 255);
const WHITE = rgb(1, 1, 1);
const LINE_COLOR = rgb(229 / 255, 231 / 255, 235 / 255);

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;

function drawHeader(page: PDFPage, font: PDFFont, boldFont: PDFFont, fiche: FicheHACCP) {
  // Green header bar
  page.drawRectangle({
    x: 0, y: PAGE_H - 80,
    width: PAGE_W, height: 80,
    color: PRIMARY,
  });

  page.drawText("fiche-haccp.fr", {
    x: MARGIN, y: PAGE_H - 35,
    size: 10, font, color: WHITE,
  });

  page.drawText(fiche.title, {
    x: MARGIN, y: PAGE_H - 60,
    size: 13, font: boldFont, color: WHITE,
    maxWidth: CONTENT_W,
  });

  // Legal basis below header
  page.drawRectangle({
    x: MARGIN, y: PAGE_H - 120,
    width: CONTENT_W, height: 30,
    color: LIGHT_BG,
  });

  page.drawText(`Base légale : ${fiche.legalBasis.substring(0, 100)}...`, {
    x: MARGIN + 8, y: PAGE_H - 112,
    size: 7, font, color: GRAY,
    maxWidth: CONTENT_W - 16,
  });
}

function drawTableHeader(page: PDFPage, boldFont: PDFFont, y: number, fields: string[], colWidths: number[]) {
  page.drawRectangle({
    x: MARGIN, y: y - 18,
    width: CONTENT_W, height: 20,
    color: PRIMARY,
  });

  let x = MARGIN + 4;
  fields.forEach((field, i) => {
    page.drawText(field, {
      x, y: y - 14,
      size: 7, font: boldFont, color: WHITE,
      maxWidth: colWidths[i] - 8,
    });
    x += colWidths[i];
  });

  return y - 18;
}

function drawTableRows(page: PDFPage, font: PDFFont, y: number, rowCount: number, colWidths: number[]) {
  let currentY = y;

  for (let r = 0; r < rowCount; r++) {
    const bg = r % 2 === 0 ? WHITE : LIGHT_BG;
    page.drawRectangle({
      x: MARGIN, y: currentY - 18,
      width: CONTENT_W, height: 18,
      color: bg,
    });

    // Draw column separators
    let x = MARGIN;
    colWidths.forEach((w) => {
      page.drawLine({
        start: { x, y: currentY },
        end: { x, y: currentY - 18 },
        thickness: 0.5,
        color: LINE_COLOR,
      });
      x += w;
    });

    // Bottom line
    page.drawLine({
      start: { x: MARGIN, y: currentY - 18 },
      end: { x: MARGIN + CONTENT_W, y: currentY - 18 },
      thickness: 0.5,
      color: LINE_COLOR,
    });

    // Empty cell text placeholder
    let cellX = MARGIN + 4;
    colWidths.forEach((w) => {
      page.drawText("", {
        x: cellX, y: currentY - 14,
        size: 8, font, color: TEXT_COLOR,
      });
      cellX += w;
    });

    currentY -= 18;
  }

  return currentY;
}

function drawFooter(page: PDFPage, font: PDFFont) {
  // Footer bar
  page.drawRectangle({
    x: 0, y: 0,
    width: PAGE_W, height: 35,
    color: PRIMARY_LIGHT,
  });

  page.drawText("Document généré sur fiche-haccp.fr — Conforme à la réglementation française en vigueur", {
    x: MARGIN, y: 14,
    size: 8, font, color: WHITE,
  });

  page.drawText(`Généré le ${new Date().toLocaleDateString("fr-FR")}`, {
    x: PAGE_W - MARGIN - 120, y: 14,
    size: 8, font, color: WHITE,
  });
}

export async function generateFichePDF(fiche: FicheHACCP): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const page = doc.addPage([PAGE_W, PAGE_H]);

  drawHeader(page, font, boldFont, fiche);

  let y = PAGE_H - 150;

  // Frequency info
  page.drawText(`Fréquence : ${fiche.frequency}`, {
    x: MARGIN, y,
    size: 9, font: boldFont, color: PRIMARY,
  });
  y -= 25;

  // Content sections
  for (const section of fiche.content) {
    if (y < 150) break;

    page.drawText(section.title, {
      x: MARGIN, y,
      size: 11, font: boldFont, color: PRIMARY,
    });
    y -= 16;

    const words = section.text.split(" ");
    let line = "";
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const width = font.widthOfTextAtSize(testLine, 9);
      if (width > CONTENT_W) {
        page.drawText(line, { x: MARGIN, y, size: 9, font, color: TEXT_COLOR });
        y -= 13;
        line = word;
      } else {
        line = testLine;
      }
    }
    if (line) {
      page.drawText(line, { x: MARGIN, y, size: 9, font, color: TEXT_COLOR });
      y -= 20;
    }
  }

  // PDF table sections
  for (const section of fiche.pdfSections) {
    if (y < 250) {
      // Add new page for table
      const newPage = doc.addPage([PAGE_W, PAGE_H]);
      drawHeader(newPage, font, boldFont, fiche);
      y = PAGE_H - 150;

      newPage.drawText(section.title, {
        x: MARGIN, y,
        size: 12, font: boldFont, color: PRIMARY,
      });
      y -= 25;

      // Calculate column widths
      const maxCols = Math.min(section.fields.length, 6);
      const colWidth = CONTENT_W / maxCols;
      const colWidths = Array(maxCols).fill(colWidth);
      const displayFields = section.fields.slice(0, maxCols);

      y = drawTableHeader(newPage, boldFont, y, displayFields, colWidths);
      y = drawTableRows(newPage, font, y, 15, colWidths);

      // If more fields, add remaining on separate rows
      if (section.fields.length > 6) {
        y -= 20;
        const remainingFields = section.fields.slice(6);
        const maxCols2 = Math.min(remainingFields.length, 6);
        const colWidth2 = CONTENT_W / maxCols2;
        const colWidths2 = Array(maxCols2).fill(colWidth2);

        y = drawTableHeader(newPage, boldFont, y, remainingFields.slice(0, maxCols2), colWidths2);
        y = drawTableRows(newPage, font, y, 15, colWidths2);
      }

      drawFooter(newPage, font);
    } else {
      page.drawText(section.title, {
        x: MARGIN, y,
        size: 12, font: boldFont, color: PRIMARY,
      });
      y -= 25;

      const maxCols = Math.min(section.fields.length, 5);
      const colWidth = CONTENT_W / maxCols;
      const colWidths = Array(maxCols).fill(colWidth);
      const displayFields = section.fields.slice(0, maxCols);

      y = drawTableHeader(page, boldFont, y, displayFields, colWidths);
      y = drawTableRows(page, font, y, 10, colWidths);
    }
  }

  drawFooter(page, font);

  return doc.save();
}

export async function generateAllFichesPDF(): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Cover page
  const cover = doc.addPage([PAGE_W, PAGE_H]);

  cover.drawRectangle({
    x: 0, y: PAGE_H - 200,
    width: PAGE_W, height: 200,
    color: PRIMARY,
  });

  cover.drawText("FICHES HACCP", {
    x: MARGIN, y: PAGE_H - 80,
    size: 36, font: boldFont, color: WHITE,
  });

  cover.drawText("Pack complet — Toutes les fiches de contrôle HACCP", {
    x: MARGIN, y: PAGE_H - 115,
    size: 14, font, color: WHITE,
  });

  cover.drawText("Conformes à la réglementation française en vigueur", {
    x: MARGIN, y: PAGE_H - 140,
    size: 11, font, color: rgb(200 / 255, 230 / 255, 220 / 255),
  });

  cover.drawText("fiche-haccp.fr", {
    x: MARGIN, y: PAGE_H - 175,
    size: 10, font, color: WHITE,
  });

  let y = PAGE_H - 240;
  cover.drawText("Contenu du pack :", {
    x: MARGIN, y,
    size: 14, font: boldFont, color: PRIMARY,
  });
  y -= 30;

  for (const fiche of FICHES) {
    cover.drawText(`• ${fiche.title}`, {
      x: MARGIN + 10, y,
      size: 10, font, color: TEXT_COLOR,
      maxWidth: CONTENT_W - 20,
    });
    y -= 18;
  }

  drawFooter(cover, font);

  // Generate each fiche and merge
  for (const fiche of FICHES) {
    const fichePdf = await generateFichePDF(fiche);
    const ficheDoc = await PDFDocument.load(fichePdf);
    const pages = await doc.copyPages(ficheDoc, ficheDoc.getPageIndices());
    pages.forEach((p) => doc.addPage(p));
  }

  return doc.save();
}
