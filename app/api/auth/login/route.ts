import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientas } from "@shared/schema";
import { signToken, clientaToPayload } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { mail, password } = await req.json();
  if (!mail || !password) {
    return NextResponse.json({ error: "Mail y contraseña requeridos" }, { status: 400 });
  }

  const [clienta] = await db.select().from(clientas).where(eq(clientas.mail, mail)).limit(1);
  if (!clienta) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, clienta.password);
  if (!valid) {
    return NextResponse.json({ error: "Credenciales incorrectas" }, { status: 401 });
  }

  const token = await signToken(clientaToPayload(clienta));
  const res = NextResponse.json({ clienta: { id: clienta.id, nombre: clienta.nombre, mail: clienta.mail, isAdmin: clienta.isAdmin } });
  res.cookies.set("session", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
