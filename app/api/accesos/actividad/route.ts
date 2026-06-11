import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accesos } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq, and, sql } from "drizzle-orm";

/**
 * POST /api/accesos/actividad
 * Body: { cursoId: string }
 *
 * Actualiza el ultimoAcceso del acceso activo del usuario para ese curso.
 * Se llama desde la página de aprendizaje.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { cursoId } = await req.json();
  if (!cursoId) return NextResponse.json({ error: "cursoId requerido" }, { status: 400 });

  const now = new Date();

  const [updated] = await db
    .update(accesos)
    .set({ ultimoAcceso: now })
    .where(
      and(
        eq(accesos.clientaId, session.id),
        eq(accesos.cursoId, cursoId),
        sql`fecha_fin > NOW()`, // solo si el acceso sigue activo
      ),
    )
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "No hay acceso activo para este curso" }, { status: 404 });
  }

  return NextResponse.json({ ok: true, ultimoAcceso: now.toISOString() });
}
