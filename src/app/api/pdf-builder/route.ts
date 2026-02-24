import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getFicheBySlug } from "@/lib/fiches";
import { generateFichePDF } from "@/lib/generate-pdf";
import { query, initDatabase } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const body = await request.json();
    const {
      ficheSlug,
      restaurantName,
      logoBase64,
      logoMimeType,
      headerColor,
      orientation,
      rowCount,
      selectedFields,
    } = body;

    if (!ficheSlug) {
      return NextResponse.json({ error: "ficheSlug requis" }, { status: 400 });
    }

    const fiche = getFicheBySlug(ficheSlug);
    if (!fiche) {
      return NextResponse.json({ error: "Fiche non trouvée" }, { status: 404 });
    }

    // Parse header color
    let parsedColor: { r: number; g: number; b: number } | undefined;
    if (headerColor) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(headerColor);
      if (result) {
        parsedColor = {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        };
      }
    }

    // Decode logo
    let logoBytes: Uint8Array | undefined;
    if (logoBase64) {
      const base64Data = logoBase64.replace(/^data:[^;]+;base64,/, "");
      logoBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    }

    const pdfBytes = await generateFichePDF({
      fiche,
      orientation: orientation || "portrait",
      rowCount: rowCount || 30,
      selectedFields: selectedFields || undefined,
      headerColor: parsedColor,
      restaurantName: restaurantName || undefined,
      logoBytes,
      logoMimeType: logoMimeType || undefined,
    });

    // Track download
    try {
      await initDatabase();
      await query(
        "INSERT INTO downloads (user_id, fiche_slug) VALUES (?, ?)",
        [auth.userId, ficheSlug]
      );
    } catch {
      // Non-blocking
    }

    const filename = `fiche-haccp-${ficheSlug}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("PDF builder error:", error);
    return NextResponse.json({ error: "Erreur de génération du PDF" }, { status: 500 });
  }
}
