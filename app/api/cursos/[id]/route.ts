import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cursos, lecciones, insertCursoSchema } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const [curso] = await db.select().from(cursos).where(eq(cursos.id, params.id)).limit(1);
  if (!curso) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  const lessons = await db.select().from(lecciones).where(eq(lecciones.cursoId, params.id)).orderBy(lecciones.orden);
  return NextResponse.json({ ...curso, lecciones: lessons });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const parsed = insertCursoSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const [updated] = await db.update(cursos).set(parsed.data).where(eq(cursos.id, params.id)).returning();
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  await db.update(cursos).set({ activo: false }).where(eq(cursos.id, params.id));
  return NextResponse.json({ ok: true });
}
