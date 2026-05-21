import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cursos, insertCursoSchema } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { seed } from "@/lib/seed";

export async function GET() {
  await seed();
  const all = await db.select().from(cursos).where(eq(cursos.activo, true));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const body = await req.json();
  const parsed = insertCursoSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });

  const [curso] = await db.insert(cursos).values(parsed.data).returning();
  return NextResponse.json(curso, { status: 201 });
}
