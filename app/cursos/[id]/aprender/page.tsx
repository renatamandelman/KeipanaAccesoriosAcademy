"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { PlayCircleIcon, CheckCircleIcon, LockIcon, ArrowLeftIcon, ClockIcon } from "lucide-react";
import type { Leccion, Curso } from "@shared/schema";

export default function AprenderPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [curso, setCurso] = useState<Curso | null>(null);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [current, setCurrent] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }

    fetch(`/api/cursos/${id}`)
      .then((r) => r.json())
      .then((d) => setCurso(d));

    fetch(`/api/cursos/${id}/lecciones`)
      .then((r) => { if (r.status === 403) { setForbidden(true); setLoading(false); return null; } return r.json(); })
      .then((d) => { if (d) { setLecciones(d); setLoading(false); } });
  }, [id, user, authLoading, router]);

  const toggleCompleted = (lid: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      next.has(lid) ? next.delete(lid) : next.add(lid);
      return next;
    });
  };

  if (authLoading || loading) return (
    <main className="min-h-screen bg-[#e9e8e8]"><Navbar />
      <div className="mx-auto max-w-screen-xl p-8">
        <div className="h-96 animate-pulse rounded-2xl bg-white/60" />
      </div>
    </main>
  );

  if (forbidden) return (
    <main className="min-h-screen bg-[#e9e8e8]"><Navbar />
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-center">
        <LockIcon className="h-16 w-16 text-[#bb7375]/40" />
        <h2 className="text-2xl font-bold text-[#bb7375]">Sin acceso</h2>
        <p className="text-[#bb7375]/70">No tenés acceso activo a este curso.</p>
        <Link href={`/cursos/${id}`} className="mt-2 rounded-full bg-[#bb7375] px-6 py-2 text-white hover:bg-[#bb7375/90]">
          Activar código de acceso
        </Link>
      </div>
    </main>
  );

  const leccion = lecciones[current];
  const progress = lecciones.length > 0 ? Math.round((completed.size / lecciones.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-[#e9e8e8]">
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-4 py-6 lg:px-8">
        <div className="mb-4 flex items-center justify-between">
          <Link href={`/cursos/${id}`} className="inline-flex items-center gap-2 text-sm text-[#bb7375] hover:opacity-80">
            <ArrowLeftIcon className="h-4 w-4" /> Volver al curso
          </Link>
          <div className="flex items-center gap-2 text-sm text-[#bb7375]">
            <span>{completed.size}/{lecciones.length} completadas</span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-[#bb7375] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 flex flex-col gap-4">
            {leccion ? (
              <>
                <div className="overflow-hidden rounded-2xl bg-black shadow-lg" style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={leccion.videoUrl}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={leccion.titulo}
                  />
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest text-[#bb7375]/50">Clase {leccion.orden}</p>
                      <h2 className="mt-1 text-xl font-bold text-[#bb7375]">{leccion.titulo}</h2>
                      {leccion.descripcion && <p className="mt-2 text-sm text-[#bb7375]/70">{leccion.descripcion}</p>}
                    </div>
                    <button
                      onClick={() => toggleCompleted(leccion.id)}
                      className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        completed.has(leccion.id) ? "bg-green-100 text-green-700" : "bg-[#e9e8e8] text-[#bb7375]"
                      }`}
                      data-testid="btn-marcar-completada"
                    >
                      <CheckCircleIcon className="h-4 w-4" />
                      {completed.has(leccion.id) ? "Completada" : "Marcar completada"}
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <button
                    disabled={current === 0}
                    onClick={() => setCurrent(current - 1)}
                    className="rounded-full border border-[#bb7375] px-5 py-2 text-sm text-[#bb7375] disabled:opacity-30 hover:bg-[#bb7375]/10"
                    data-testid="btn-anterior"
                  >← Anterior</button>
                  <button
                    disabled={current === lecciones.length - 1}
                    onClick={() => { toggleCompleted(leccion.id); setCurrent(current + 1); }}
                    className="rounded-full bg-[#bb7375] px-5 py-2 text-sm text-white disabled:opacity-30 hover:bg-[#bb7375/90]"
                    data-testid="btn-siguiente"
                  >Siguiente →</button>
                </div>
              </>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-2xl bg-white text-[#bb7375]/50">
                No hay lecciones disponibles.
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
              <div className="border-b border-[#e9e8e8] p-4">
                <h3 className="font-bold text-[#bb7375]">{curso?.titulo}</h3>
                <p className="text-xs text-[#bb7375]/50 mt-1">{lecciones.length} clases</p>
              </div>
              <div className="flex flex-col divide-y divide-[#e9e8e8] max-h-[60vh] overflow-y-auto">
                {lecciones.map((l, i) => (
                  <button
                    key={l.id}
                    onClick={() => setCurrent(i)}
                    data-testid={`btn-leccion-${i}`}
                    className={`flex items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-[#e9e8e8]/50 ${
                      i === current ? "bg-[#bb7375]/10" : ""
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {completed.has(l.id) ? (
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      ) : i === current ? (
                        <PlayCircleIcon className="h-4 w-4 text-[#bb7375]" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-[#bb7375]/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${i === current ? "text-[#bb7375]" : "text-[#bb7375]/70"}`}>
                        {l.titulo}
                      </p>
                      {l.duracionMinutos ? (
                        <p className="text-xs text-[#bb7375]/40 flex items-center gap-1 mt-0.5">
                          <ClockIcon className="h-3 w-3" />{l.duracionMinutos} min
                        </p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
