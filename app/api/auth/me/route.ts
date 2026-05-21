import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientas } from "@shared/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json(null);

  const [clienta] = await db.select({
    id: clientas.id,
    nombre: clientas.nombre,
    apellido: clientas.apellido,
    mail: clientas.mail,
    telefono: clientas.telefono,
    isAdmin: clientas.isAdmin,
    activa: clientas.activa,
  }).from(clientas).where(eq(clientas.id, session.id)).limit(1);

  return NextResponse.json(clienta ?? null);
}
