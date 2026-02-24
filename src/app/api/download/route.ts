import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { getFicheBySlug } from "@/lib/fiches";
import { generateFichePDF, generateAllFichesPDF } from "@/lib/generate-pdf";
import { query, initDatabase } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const slug = request.nextUrl.searchParams.get("slug");
    if (!slug) {
      return NextResponse.json({ error: "Paramètre slug manquant" }, { status: 400 });
    }

    let pdfBytes: Uint8Array;
    let filename: string;

    if (slug === "all") {
      pdfBytes = await generateAllFichesPDF();
      filename = "fiches-haccp-pack-complet.pdf";
    } else {
      const fiche = getFicheBySlug(slug);
      if (!fiche) {
        return NextResponse.json({ error: "Fiche non trouvée" }, { status: 404 });
      }
      pdfBytes = await generateFichePDF({ fiche });
      filename = `fiche-haccp-${slug}.pdf`;
    }

    // Track download
    try {
      await initDatabase();
      await query(
        "INSERT INTO downloads (user_id, fiche_slug) VALUES (?, ?)",
        [auth.userId, slug]
      );
    } catch {
      // Non-blocking
    }

    return new NextResponse(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ error: "Erreur de génération du PDF" }, { status: 500 });
  }
}
