import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: EmailOptions) {
  return resend.emails.send({
    from: "onboarding@resend.dev",
    to,
    subject,
    html,
  });
}

/**
 * Template para el mail de inactividad.
 * Le decimos a la alumna cuántos días sin acceder lleva y cuántos le quedan.
 */
export function buildInactividadHtml({
  nombre,
  cursoTitulo,
  diasSinAcceso,
  diasRestantes,
}: {
  nombre: string;
  cursoTitulo: string;
  diasSinAcceso: number;
  diasRestantes: number;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background:#bb7375;padding:24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:20px;">✨ Keipana Accesorios</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px 24px;">
              <p style="font-size:16px;color:#333;margin:0 0 16px 0;">Hola <strong>${nombre}</strong>,</p>
              <p style="font-size:14px;color:#555;margin:0 0 12px 0;">
                Hace <strong style="color:#bb7375;">${diasSinAcceso} días</strong> que no accedés al curso
                <strong>"${cursoTitulo}"</strong>.
              </p>
              <p style="font-size:14px;color:#555;margin:0 0 12px 0;">
                Te quedan <strong style="color:#bb7375;">${diasRestantes} días</strong> de acceso desde hoy.
                ¡Aprovechá el tiempo que te queda!
              </p>
              <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td align="center" style="background:#bb7375;border-radius:9999px;padding:12px 32px;">
                    <a href="https://keipana-accesorios-academy.vercel.app/mis-cursos" 
                       style="color:#ffffff;text-decoration:none;font-size:14px;font-weight:bold;display:block;">
                      Seguir aprendiendo →
                    </a>
                  </td>
                </tr>
              </table>
              <p style="font-size:12px;color:#999;margin:24px 0 0 0;">
                Si ya estás al día, ignorá este mensaje.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
