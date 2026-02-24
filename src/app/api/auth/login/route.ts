import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { query, initDatabase } from "@/lib/db";
import { createToken, getTokenCookieOptions } from "@/lib/auth";
import { RowDataPacket } from "mysql2";

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    await initDatabase();

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email et mot de passe requis." }, { status: 400 });
    }

    const users = await query<UserRow[]>(
      "SELECT id, email, password FROM users WHERE email = ?",
      [email.toLowerCase().trim()]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json({ error: "Email ou mot de passe incorrect." }, { status: 401 });
    }

    const token = await createToken({ userId: user.id, email: user.email });

    const response = NextResponse.json({ success: true });
    response.cookies.set(getTokenCookieOptions(token));

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
