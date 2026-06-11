import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { accesos, clientas, cursos, notificaciones } from "@shared/schema";
import { eq, and, lt, sql, isNull, or } from "drizzle-orm";
import { sendEmail, buildInactividadHtml } from "@/lib/email";

/**
 * GET /api/cron/verificar-accesos
 *
 * Recorre los accesos activos y envía mails de alerta a quienes no accedieron
 * hace 7, 15 o 30+ días (sin repetir la misma notificación).
 *
 * Llamar desde un cron externo (cron-job.org, UptimeRobot, Vercel Cron).
 */

// Umbrales en días → tipo de notificación
const UMBRALES: { dias: number; tipo: string }[] = [
  { dias: 7, tipo: "inactividad-7d" },
  { dias: 15, tipo: "inactividad-15d" },
  { dias: 30, tipo: "inactividad-30d" },
];

export async function GET() {
  // Protección básica: requiere header secreto opcional
  // const auth = req.headers.get("Authorization");
  // if (auth !== `Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const now = new Date();
  const enviados: string[] = [];

  for (const umbral of UMBRALES) {
    // Accesos activos que no accedieron hace {dias} días o más
    // y que NO tengan ya una notificación de este tipo
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
          // Último acceso es NULL (nunca accedió) O fue hace más de N días
          or(
            isNull(accesos.ultimoAcceso),
            lt(accesos.ultimoAcceso, sql`NOW() - INTERVAL '${sql.raw(String(umbral.dias))} days'`),
          ),
          // No se le envió ya esta notificación
          sql`NOT EXISTS (
            SELECT 1 FROM ${notificaciones}
            WHERE ${notificaciones.accesoId} = ${accesos.id}
            AND ${notificaciones.tipo} = ${umbral.tipo}
          )`,
        ),
      );

    for (const row of accesosVencidos) {
      const { acceso, clienta: c, curso } = row;

      const diasSinAcceso = acceso.ultimoAcceso
        ? Math.floor((now.getTime() - new Date(acceso.ultimoAcceso).getTime()) / (1000 * 60 * 60 * 24))
        : Math.floor((now.getTime() - new Date(acceso.fechaInicio).getTime()) / (1000 * 60 * 60 * 24));

      const diasRestantes = Math.max(0, Math.ceil((new Date(acceso.fechaFin).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

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

  return NextResponse.json({
    ok: true,
    enviados: enviados.length,
    detalles: enviados,
  });
}
