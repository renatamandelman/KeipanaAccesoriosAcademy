import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientas, codigos } from "@shared/schema";
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

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

    const id = req.nextUrl.searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Falta el parámetro id" }, { status: 400 });

    // Liberar códigos que esta clienta usó, así no viola la FK
    await db.update(codigos).set({ usado: false, usadoPor: null, usadoEn: null }).where(eq(codigos.usadoPor, id));
    await db.delete(clientas).where(eq(clientas.id, id));
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error en DELETE clientas:", err);
    const message = err instanceof Error ? err.message : "Error desconocido";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
