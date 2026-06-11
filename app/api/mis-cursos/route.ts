import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accesos, cursos, lecciones, progresoLecciones } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

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

  // Total de lecciones por curso
  const leccionCounts = await db
    .select({
      cursoId: lecciones.cursoId,
      total: sql<number>`COUNT(*)::int`,
    })
    .from(lecciones)
    .groupBy(lecciones.cursoId);

  // Lecciones completadas por el usuario, por curso
  const completedCounts = await db
    .select({
      cursoId: lecciones.cursoId,
      completadas: sql<number>`COUNT(*)::int`,
    })
    .from(progresoLecciones)
    .innerJoin(lecciones, eq(progresoLecciones.leccionId, lecciones.id))
    .where(
      and(
        eq(progresoLecciones.clientaId, session.id),
        eq(progresoLecciones.completada, true),
      ),
    )
    .groupBy(lecciones.cursoId);

  const leccionMap = Object.fromEntries(leccionCounts.map((l) => [l.cursoId, l.total]));
  const completedMap = Object.fromEntries(completedCounts.map((c) => [c.cursoId, c.completadas]));

  const now = new Date();
  return NextResponse.json(myAccesos.map(({ acceso, curso }) => {
    const diasRestantes = Math.max(0, Math.ceil((new Date(acceso.fechaFin).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
    return {
      acceso,
      curso,
      activo: new Date(acceso.fechaFin) > now,
      diasRestantes,
      totalLecciones: leccionMap[curso.id] || 0,
      leccionesCompletadas: completedMap[curso.id] || 0,
    };
  }));
}
