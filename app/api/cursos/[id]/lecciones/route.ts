import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lecciones, insertLeccionSchema, accesos } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq, and, gt } from "drizzle-orm";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const now = new Date();
  const [acceso] = await db.select().from(accesos)
    .where(and(eq(accesos.clientaId, session.id), eq(accesos.cursoId, params.id), gt(accesos.fechaFin, now)))
    .limit(1);

  if (!acceso && !session.isAdmin) {
    return NextResponse.json({ error: "Sin acceso" }, { status: 403 });
  }

  const lessons = await db.select().from(lecciones).where(eq(lecciones.cursoId, params.id)).orderBy(lecciones.orden);
  return NextResponse.json(lessons);
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const parsed = insertLeccionSchema.safeParse({ ...body, cursoId: params.id });
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const [leccion] = await db.insert(lecciones).values(parsed.data).returning();
  return NextResponse.json(leccion, { status: 201 });
}
