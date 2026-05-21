import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientas, insertClientaSchema } from "@shared/schema";
import { signToken, clientaToPayload } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = insertClientaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", details: parsed.error.flatten() }, { status: 400 });
  }
  const { mail, password, nombre, apellido, telefono } = parsed.data;

  const existing = await db.select().from(clientas).where(eq(clientas.mail, mail)).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ error: "El mail ya está registrado" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const [clienta] = await db.insert(clientas).values({ nombre, apellido, mail, telefono, password: hash }).returning();

  const token = await signToken(clientaToPayload(clienta));
  const res = NextResponse.json({ clienta: { id: clienta.id, nombre: clienta.nombre, mail: clienta.mail, isAdmin: clienta.isAdmin } });
  res.cookies.set("session", token, { httpOnly: true, path: "/", maxAge: 60 * 60 * 24 * 7 });
  return res;
}
