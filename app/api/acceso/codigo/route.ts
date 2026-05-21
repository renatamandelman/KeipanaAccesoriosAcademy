import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codigos, accesos, cursos } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });

  const { codigo } = await req.json();
  if (!codigo) return NextResponse.json({ error: "Código requerido" }, { status: 400 });

  const [code] = await db.select().from(codigos).where(eq(codigos.codigo, codigo.trim().toUpperCase())).limit(1);
  if (!code) return NextResponse.json({ error: "Código inválido" }, { status: 404 });
  if (code.usado) return NextResponse.json({ error: "Este código ya fue utilizado" }, { status: 409 });

  const [curso] = await db.select().from(cursos).where(eq(cursos.id, code.cursoId)).limit(1);
  if (!curso) return NextResponse.json({ error: "Curso no encontrado" }, { status: 404 });

  const existing = await db.select().from(accesos)
    .where(and(eq(accesos.clientaId, session.id), eq(accesos.cursoId, code.cursoId)))
    .limit(1);
  if (existing.length > 0) return NextResponse.json({ error: "Ya tenés acceso a este curso" }, { status: 409 });

  const fechaFin = new Date();
  fechaFin.setDate(fechaFin.getDate() + curso.duracionDias);

  await db.update(codigos).set({ usado: true, usadoPor: session.id, usadoEn: new Date() }).where(eq(codigos.id, code.id));
  const [acceso] = await db.insert(accesos).values({
    clientaId: session.id,
    cursoId: code.cursoId,
    codigoId: code.id,
    fechaFin,
  }).returning();

  return NextResponse.json({ acceso, curso });
}
