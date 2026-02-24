import { NextResponse } from "next/server";
import { FICHES } from "@/lib/fiches";

export async function GET() {
  const fiches = FICHES.map((f) => ({
    id: f.id,
    slug: f.slug,
    title: f.title,
    shortTitle: f.shortTitle,
    icon: f.icon,
    category: f.category,
    pdfSections: f.pdfSections,
  }));

  return NextResponse.json({ fiches });
}
