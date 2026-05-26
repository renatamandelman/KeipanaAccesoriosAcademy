import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { lecciones, insertLeccionSchema } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const parsed = insertLeccionSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const [updated] = await db.update(lecciones).set(parsed.data).where(eq(lecciones.id, params.id)).returning();
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  await db.delete(lecciones).where(eq(lecciones.id, params.id));
  return NextResponse.json({ ok: true });
}
