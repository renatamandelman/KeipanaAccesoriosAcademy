import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { clientas } from "@shared/schema";
import { getSession } from "@/lib/auth";
import { eq } from "drizzle-orm";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session?.isAdmin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  await db.delete(clientas).where(eq(clientas.id, params.id));
  return NextResponse.json({ ok: true });
}
