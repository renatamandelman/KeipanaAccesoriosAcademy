"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import { ClockIcon, LockIcon, PlayCircleIcon, CheckCircleIcon, ArrowLeftIcon, MessageCircleIcon } from "lucide-react";
import type { Curso, Leccion } from "@shared/schema";

type CursoDetail = Curso & { lecciones: Leccion[] };

export default function CursoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [curso, setCurso] = useState<CursoDetail | null>(null);
  const [tieneAcceso, setTieneAcceso] = useState(false);
  const [diasRestantes, setDiasRestantes] = useState(0);
  const [codigo, setCodigo] = useState("");
  const [loadingCodigo, setLoadingCodigo] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch(`/api/cursos/${id}`)
      .then((r) => r.json())
      .then((d) => { setCurso(d); setLoading(false); });
  }, [id]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/mis-cursos")
      .then((r) => r.json())
      .then((data: { cursoId?: string; activo: boolean; diasRestantes: number; acceso: { cursoId: string } }[]) => {
        const found = data.find((a) => a.acceso.cursoId === id);
        if (found) { setTieneAcceso(found.activo); setDiasRestantes(found.diasRestantes); }
      });
  }, [user, id, success]);

  // Cargar progreso de lecciones completadas
  useEffect(() => {
    if (!user) return;
    fetch(`/api/progreso?cursoId=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.completadas) setCompletedLessons(new Set(data.completadas));
      })
      .catch(() => {});
  }, [user, id]);

  const handleCodigo = async () => {
    if (!user) { router.push("/auth/login"); return; }
    setLoadingCodigo(true); setError(""); setSuccess("");
    const res = await fetch("/api/acceso/codigo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codigo }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al activar el código"); }
    else { 
      setSuccess("¡Código activado correctamente! Ya podés acceder al curso.");
      setCodigo("");
      if (data.email && !data.email.ok) {
        console.warn("Mail de nuevo curso no enviado:", data.email.error);
      }
    }
    setLoadingCodigo(false);
  };

  if (loading) return (
    <main className="min-h-screen bg-[#e9e8e8]"><Navbar />
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="h-96 animate-pulse rounded-3xl bg-white/60" />
      </div>
    </main>
  );

  if (!curso) return (
    <main className="min-h-screen bg-[#e9e8e8]"><Navbar />
      <div className="py-32 text-center text-[#bb7375]">Curso no encontrado.</div>
    </main>
  );

  return (
    <main className="min-h-screen bg-[#e9e8e8]">
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-6 py-10 lg:px-8">
        <Link href="/cursos" className="mb-6 inline-flex items-center gap-2 text-sm text-[#bb7375] hover:opacity-80">
          <ArrowLeftIcon className="h-4 w-4" /> Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="relative h-64 overflow-hidden rounded-2xl md:h-80">
              <Image src={curso.imagen === "/figmaAssets/img.png" ? "/figmaAssets/predeterminada.jpg" : curso.imagen} alt={curso.titulo} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <Badge className="absolute left-4 top-4 bg-white px-3 py-1 text-[#bb7375]">{curso.nivel}</Badge>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-[#bb7375] md:text-4xl">{curso.titulo}</h1>
              <p className="mt-4 text-base leading-relaxed text-[#bb7375]/80">{curso.descripcion}</p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-[#bb7375]">Contenido del curso</h2>

              <div className="mb-6 flex flex-col gap-2 border-b border-[#e9e8e8] pb-4">
                <div className="flex items-center gap-2 text-sm text-[#bb7375]/70">
                  <CheckCircleIcon className="h-4 w-4 text-[#bb7375]" />
                  {curso.lecciones.length} lecciones incluidas
                </div>
                <div className="flex items-center gap-2 text-sm text-[#bb7375]/70">
                  <CheckCircleIcon className="h-4 w-4 text-[#bb7375]" />
                  Acceso por {curso.duracionDias} días
                </div>
                <div className="flex items-center gap-2 text-sm text-[#bb7375]/70">
                  <CheckCircleIcon className="h-4 w-4 text-[#bb7375]" />
                  Videos en alta calidad
                </div>
                <div className="flex items-center gap-2 text-sm text-[#bb7375]/70">
                  <CheckCircleIcon className="h-4 w-4 text-[#bb7375]" />
                  Guías en PDF
                </div>
                <div className="flex items-center gap-2 text-sm text-[#bb7375]/70">
                  <CheckCircleIcon className="h-4 w-4 text-[#bb7375]" />
                  Presencial, Online sincrónico o asincrónico
                </div>
                <div className="flex items-center gap-2 text-sm text-[#bb7375]/70">
                  <CheckCircleIcon className="h-4 w-4 text-[#bb7375]" />
                  Opcional: te enviamos los materiales
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {curso.lecciones.map((leccion, i) => {
                  const completada = completedLessons.has(leccion.id);
                  return (
                    <div key={leccion.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                      completada ? "bg-green-50" : "bg-[#e9e8e8]"
                    }`}>
                      {completada ? (
                        <CheckCircleIcon className="h-5 w-5 shrink-0 text-green-500" />
                      ) : tieneAcceso ? (
                        <PlayCircleIcon className="h-5 w-5 shrink-0 text-[#bb7375]" />
                      ) : i === 0 ? (
                        <PlayCircleIcon className="h-5 w-5 shrink-0 text-[#bb7375]" />
                      ) : (
                        <LockIcon className="h-5 w-5 shrink-0 text-[#bb7375]/40" />
                      )}
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${completada ? "text-green-700" : !tieneAcceso && i > 0 ? "text-[#bb7375]/40" : "text-[#bb7375]"}`}>
                          {leccion.titulo}
                          {completada && <span className="ml-2 text-xs text-green-500">✓ Completada</span>}
                        </p>
                        {leccion.duracionMinutos ? <p className="text-xs text-[#bb7375]/50">{leccion.duracionMinutos} min</p> : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="sticky top-6 rounded-2xl bg-white p-6 shadow-md">
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <span className="text-3xl font-bold text-[#bb7375]">
                    {Number(curso.precio) === 0 ? "Gratis" : `$${curso.precio}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-[#e9e8e8] px-3 py-1 text-sm text-[#bb7375]">
                  <ClockIcon className="h-4 w-4" />
                  {curso.duracionDias} días
                </div>
              </div>

              {tieneAcceso ? (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-green-700">
                    <CheckCircleIcon className="h-5 w-5" />
                    <span className="text-sm font-medium">Acceso activo · {diasRestantes} días restantes</span>
                  </div>
                  <Link href={`/cursos/${curso.id}/aprender`}>
                    <Button className="w-full rounded-full bg-[#bb7375] py-3 text-white hover:bg-[#bb7375/90]">
                      <PlayCircleIcon className="mr-2 h-5 w-5" />
                      Comenzar Curso
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="rounded-xl bg-[#bb7375]/10 border border-[#bb7375]/20 p-4 text-center">
                    <p className="text-sm font-semibold text-[#bb7375] mb-1">¿Querés adquirir este curso?</p>
                    <p className="text-xs text-[#bb7375]/70 mb-3">
                      Contactanos por WhatsApp para completar tu compra. Te enviaremos tu código de acceso al instante.
                    </p>
                    <a
                      href={`https://wa.me/5491172483852?text=Hola!%20Me%20interesa%20comprar%20el%20curso%20*${encodeURIComponent(curso.titulo)}*%20%F0%9F%92%AB`}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-testid="btn-comprar-whatsapp"
                    >
                      <Button className="w-full rounded-full bg-[#25D366] hover:bg-[#1ebe5d] text-white font-semibold gap-2">
                        <MessageCircleIcon className="h-5 w-5" />
                        Comprar por WhatsApp
                      </Button>
                    </a>
                  </div>

                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 border-t border-[#bb7375]/20" />
                    <span className="text-xs text-[#bb7375]/50">ya tengo mi código</span>
                    <div className="flex-1 border-t border-[#bb7375]/20" />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-[#bb7375]">¿Tenés un código de acceso?</label>
                    <div className="flex gap-2">
                      <Input
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value.toUpperCase())}
                        placeholder="Ej: NIVEL1-DEMO"
                        className="flex-1 border-[#bb7375]/30 uppercase placeholder:normal-case"
                        data-testid="input-codigo"
                        onKeyDown={(e) => e.key === "Enter" && handleCodigo()}
                      />
                      <Button
                        onClick={handleCodigo}
                        disabled={loadingCodigo || !codigo}
                        className="rounded-full bg-[#bb7375] px-4 text-white hover:bg-[#bb7375/90]"
                        data-testid="btn-activar-codigo"
                      >
                        {loadingCodigo ? "..." : "Activar"}
                      </Button>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {success && <p className="text-sm text-green-600">{success}</p>}
                  </div>

                  <div className="relative flex items-center gap-3">
                    <div className="flex-1 border-t border-[#bb7375]/20" />
                    <span className="text-xs text-[#bb7375]/50">o</span>
                    <div className="flex-1 border-t border-[#bb7375]/20" />
                  </div>

                  {!user && (
                    <Link href="/auth/login">
                      <Button variant="outline" className="w-full rounded-full border-[#bb7375] text-[#bb7375]">
                        Iniciar sesión para acceder
                      </Button>
                    </Link>
                  )}

                  <div className="rounded-xl bg-[#e9e8e8] p-4 text-center">
                    <LockIcon className="mx-auto mb-2 h-6 w-6 text-[#bb7375]/50" />
                    <p className="text-sm text-[#bb7375]/70">El contenido se desbloquea al activar tu código de acceso</p>
                  </div>
                </div>
              )}

            
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
