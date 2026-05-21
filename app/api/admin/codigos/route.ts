import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { codigos, cursos } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

export async function GET() {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const all = await db.select({
    id: codigos.id,
    codigo: codigos.codigo,
    usado: codigos.usado,
    creadoEn: codigos.creadoEn,
    usadoEn: codigos.usadoEn,
    cursoId: codigos.cursoId,
    titulo: cursos.titulo,
  }).from(codigos).innerJoin(cursos, eq(codigos.cursoId, cursos.id));

  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { cursoId, cantidad = 1 } = await req.json();
  if (!cursoId) return NextResponse.json({ error: "cursoId requerido" }, { status: 400 });

  const generated = [];
  for (let i = 0; i < Math.min(cantidad, 50); i++) {
    const code = randomBytes(4).toString("hex").toUpperCase();
    const [c] = await db.insert(codigos).values({ cursoId, codigo: code }).returning();
    generated.push(c);
  }

  return NextResponse.json(generated, { status: 201 });
}
