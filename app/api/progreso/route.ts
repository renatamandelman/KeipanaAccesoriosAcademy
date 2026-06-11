import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { progresoLecciones, lecciones } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

/**
 * GET /api/progreso?cursoId=xxx
 *
 * Devuelve los IDs de lecciones completadas por el usuario para ese curso.
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const cursoId = searchParams.get("cursoId");
  if (!cursoId) return NextResponse.json({ error: "cursoId requerido" }, { status: 400 });

  const completadas = await db
    .select({ leccionId: progresoLecciones.leccionId })
    .from(progresoLecciones)
    .innerJoin(lecciones, eq(progresoLecciones.leccionId, lecciones.id))
    .where(
      and(
        eq(progresoLecciones.clientaId, session.id),
        eq(lecciones.cursoId, cursoId),
        eq(progresoLecciones.completada, true),
      ),
    );

  return NextResponse.json({
    completadas: completadas.map((c) => c.leccionId),
  });
}

/**
 * POST /api/progreso
 * Body: { leccionId: string, completada: boolean }
 *
 * Toggle (crea o actualiza) el estado de completada de una lección.
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { leccionId, completada } = await req.json();
  if (!leccionId) return NextResponse.json({ error: "leccionId requerido" }, { status: 400 });

  // Upsert: si existe el registro lo actualiza, si no lo crea
  await db
    .insert(progresoLecciones)
    .values({
      clientaId: session.id,
      leccionId,
      completada: completada ?? true,
    })
    .onConflictDoUpdate({
      target: [progresoLecciones.clientaId, progresoLecciones.leccionId],
      set: {
        completada: completada ?? true,
        completadaEn: sql`NOW()`,
      },
    });

  return NextResponse.json({ ok: true });
}
