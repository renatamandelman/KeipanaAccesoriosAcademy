import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientas, accesos, cursos } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const all = await db.select({
    id: clientas.id,
    nombre: clientas.nombre,
    apellido: clientas.apellido,
    mail: clientas.mail,
    telefono: clientas.telefono,
    activa: clientas.activa,
    creadaEn: clientas.creadaEn,
  }).from(clientas);

  return NextResponse.json(all);
}
