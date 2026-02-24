import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, initDatabase } from "@/lib/db";
import { createToken, getTokenCookieOptions } from "@/lib/auth";
import { sendMail, welcomeEmailHtml } from "@/lib/mail";
import { RowDataPacket } from "mysql2";

export async function POST(request: Request) {
  try {
    await initDatabase();

    const { name, email, password, restaurant_name } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Tous les champs obligatoires doivent être remplis." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    // Check existing user
    const existing = await query<RowDataPacket[]>(
      "SELECT id FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );

    if (existing.length > 0) {
      return NextResponse.json({ error: "Un compte existe déjà avec cette adresse email." }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await query<{ insertId: number }>(
      "INSERT INTO users (email, password, name, restaurant_name) VALUES (?, ?, ?, ?)",
      [email.toLowerCase().trim(), hashedPassword, name.trim(), (restaurant_name || "").trim()]
    );

    const userId = (result as unknown as { insertId: number }).insertId;

    const token = await createToken({ userId, email: email.toLowerCase().trim() });

    // Send welcome email (non-blocking)
    sendMail({
      to: email,
      toName: name,
      subject: "Bienvenue sur Fiche HACCP !",
      html: welcomeEmailHtml(name),
    }).catch(console.error);

    const response = NextResponse.json({ success: true, userId });
    response.cookies.set(getTokenCookieOptions(token));

    return response;
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur serveur. Veuillez réessayer." }, { status: 500 });
  }
}
