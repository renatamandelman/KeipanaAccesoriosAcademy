import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accesos, clientas, cursos, notificaciones } from "@shared/schema";
import { eq, and, lt, sql, gte } from "drizzle-orm";
import { sendEmail, buildInactividadHtml } from "@/lib/email";

/**
 * GET /api/cron/verificar-accesos
 *
 * Recorre los accesos activos y envía mails de alerta a quienes no accedieron
 * hace 7, 15 o 30+ días (sin repetir la misma notificación).
 *
 * La lógica usa COALESCE(ultimo_acceso, fecha_inicio) para determinar
 * los días reales sin acceso desde la última actividad (o desde que empezó).
 *
 * Llamar desde un cron externo (cron-job.org, UptimeRobot, Vercel Cron).
 */

// Umbrales en días → tipo de notificación
const UMBRALES: { dias: number; tipo: string }[] = [
  { dias: 7, tipo: "inactividad-7d" },
  { dias: 15, tipo: "inactividad-15d" },
  { dias: 30, tipo: "inactividad-30d" },
];

export async function GET(req: NextRequest) {
  // Protección básica: requiere header secreto opcional
  // const auth = req.headers.get("Authorization");
  // if (auth !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const debug = req.nextUrl.searchParams.get("debug");
  const now = new Date();
  const enviados: string[] = [];

  for (const umbral of UMBRALES) {
    // Buscar accesos activos cuyo último acceso (o fecha de inicio si nunca accedió)
    // fue hace al menos {umbral.dias} días, y que NO tengan ya esa notificación.
    //
    // COALESCE(ultimo_acceso, fecha_inicio) resuelve el bug de NULL:
    // si nunca accedió, usa fecha_inicio como referencia.
    const accesosVencidos = await db
      .select({
        acceso: accesos,
        clienta: clientas,
        curso: cursos,
      })
      .from(accesos)
      .innerJoin(clientas, eq(accesos.clientaId, clientas.id))
      .innerJoin(cursos, eq(accesos.cursoId, cursos.id))
      .where(
        and(
          // Acceso activo (no vencido)
          sql`${accesos.fechaFin} > NOW()`,
          // No accedió en los últimos N días (usando COALESCE para evitar NULL)
          sql`COALESCE(${accesos.ultimoAcceso}, ${accesos.fechaInicio}) < NOW() - INTERVAL '${sql.raw(String(umbral.dias))} days'`,
          // No se le envió ya esta notificación específica
          sql`NOT EXISTS (
            SELECT 1 FROM ${notificaciones}
            WHERE ${notificaciones.accesoId} = ${accesos.id}
            AND ${notificaciones.tipo} = ${umbral.tipo}
          )`,
        ),
      );

    for (const row of accesosVencidos) {
      const { acceso, clienta: c, curso } = row;

      // Calcular días reales desde el último acceso (o desde que empezó el curso)
      const referencia = acceso.ultimoAcceso ?? acceso.fechaInicio;
      const diasSinAcceso = Math.floor(
        (now.getTime() - new Date(referencia).getTime()) / (1000 * 60 * 60 * 24),
      );

      const diasRestantes = Math.max(
        0,
        Math.ceil(
          (new Date(acceso.fechaFin).getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        ),
      );

      try {
        await sendEmail({
          to: c.mail,
          subject: `⏰ ${curso.titulo} — hacé ${diasSinAcceso} días que no entrás`,
          html: buildInactividadHtml({
            nombre: c.nombre,
            cursoTitulo: curso.titulo,
            diasSinAcceso,
            diasRestantes,
          }),
        });

        // Registrar notificación enviada para no repetir
        await db.insert(notificaciones).values({
          accesoId: acceso.id,
          tipo: umbral.tipo,
        });

        enviados.push(`${c.mail} - ${curso.titulo} (${umbral.tipo})`);
        console.log(`📧 Notificación enviada a ${c.mail} para "${curso.titulo}" (${umbral.tipo})`);
      } catch (err) {
        console.error(`❌ Error al enviar mail a ${c.mail}:`, err);
      }
    }
  }

  if (debug) {
    // Modo debug: muestra los accesos activos para un mail específico
    const [cl] = await db.select({ id: clientas.id }).from(clientas).where(eq(clientas.mail, debug)).limit(1);
    if (!cl) return NextResponse.json({ error: `Clienta no encontrada: ${debug}` }, { status: 404 });

    const accesosRows = await db.select({
      accesoId: accesos.id,
      cursoTitulo: cursos.titulo,
      fechaInicio: accesos.fechaInicio,
      fechaFin: accesos.fechaFin,
      ultimoAcceso: accesos.ultimoAcceso,
      notifs: sql`(SELECT json_agg(json_build_object('tipo', n.tipo, 'enviadoEn', n.enviado_en)) FROM ${notificaciones} n WHERE n.acceso_id = ${accesos.id})`,
    })
      .from(accesos)
      .innerJoin(cursos, eq(accesos.cursoId, cursos.id))
      .where(eq(accesos.clientaId, cl.id));

    return NextResponse.json({ mail: debug, activo: accesosRows.length > 0, accesos: accesosRows });
  }

  return NextResponse.json({
    ok: true,
    enviados: enviados.length,
    detalles: enviados,
  });
}
