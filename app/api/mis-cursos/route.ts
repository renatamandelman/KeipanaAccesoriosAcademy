import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accesos, cursos } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const myAccesos = await db
    .select({
      acceso: accesos,
      curso: cursos,
    })
    .from(accesos)
    .innerJoin(cursos, eq(accesos.cursoId, cursos.id))
    .where(eq(accesos.clientaId, session.id));

  const now = new Date();
  return NextResponse.json(myAccesos.map(({ acceso, curso }) => {
    const diasRestantes = Math.max(0, Math.ceil((new Date(acceso.fechaFin).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    return { acceso, curso, activo: new Date(acceso.fechaFin) > now, diasRestantes };
  }));
}
