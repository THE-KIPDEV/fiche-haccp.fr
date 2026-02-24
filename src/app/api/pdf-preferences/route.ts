import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
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

    await initDatabase();

    const rows = await query<Array<Record<string, unknown>>>(
      "SELECT restaurant_name, logo_base64, logo_mime_type, header_color, orientation, row_count, selected_fields FROM pdf_preferences WHERE user_id = ? AND fiche_slug = ?",
      [auth.userId, slug]
    );

    if (rows.length === 0) {
      return NextResponse.json({ preferences: null });
    }

    const row = rows[0];
    return NextResponse.json({
      preferences: {
        restaurantName: row.restaurant_name,
        logoBase64: row.logo_base64,
        logoMimeType: row.logo_mime_type,
        headerColor: row.header_color,
        orientation: row.orientation,
        rowCount: row.row_count,
        selectedFields: row.selected_fields ? JSON.parse(row.selected_fields as string) : null,
      },
    });
  } catch (error) {
    console.error("PDF preferences GET error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await getAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const body = await request.json();
    const {
      ficheSlug,
      restaurantName = "",
      logoBase64 = null,
      logoMimeType = null,
      headerColor = "#065f46",
      orientation = "portrait",
      rowCount = 30,
      selectedFields = null,
    } = body;

    if (!ficheSlug) {
      return NextResponse.json({ error: "ficheSlug requis" }, { status: 400 });
    }

    await initDatabase();

    await query(
      `INSERT INTO pdf_preferences (user_id, fiche_slug, restaurant_name, logo_base64, logo_mime_type, header_color, orientation, row_count, selected_fields)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         restaurant_name = VALUES(restaurant_name),
         logo_base64 = VALUES(logo_base64),
         logo_mime_type = VALUES(logo_mime_type),
         header_color = VALUES(header_color),
         orientation = VALUES(orientation),
         row_count = VALUES(row_count),
         selected_fields = VALUES(selected_fields)`,
      [
        auth.userId,
        ficheSlug,
        restaurantName,
        logoBase64,
        logoMimeType,
        headerColor,
        orientation,
        rowCount,
        selectedFields ? JSON.stringify(selectedFields) : null,
      ]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PDF preferences PUT error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
