"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlayCircleIcon, ClockIcon, KeyIcon, CheckCircleIcon, BookOpenIcon } from "lucide-react";
import type { Curso, Acceso } from "@shared/schema";

type MiCurso = { acceso: Acceso; curso: Curso; activo: boolean; diasRestantes: number; totalLecciones: number; leccionesCompletadas: number };

export default function MisCursosPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [misCursos, setMisCursos] = useState<MiCurso[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push("/auth/login"); return; }
    fetch("/api/mis-cursos")
      .then((r) => r.json())
      .then((d) => { setMisCursos(d); setLoading(false); });
  }, [user, authLoading, router]);

  return (
    <main className="min-h-screen bg-[#e9e8e8]">
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#bb7375]">Mis Cursos</h1>
          <p className="mt-2 text-[#bb7375]/70">Todos tus accesos activos y vencidos</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2].map((i) => <div key={i} className="h-64 animate-pulse rounded-2xl bg-white/60" />)}
          </div>
        ) : misCursos.length === 0 ? (
          <div className="flex flex-col items-center gap-6 py-24 text-center">
            <KeyIcon className="h-16 w-16 text-[#bb7375]/30" />
            <h2 className="text-xl font-bold text-[#bb7375]">Todavía no tenés cursos</h2>
            <p className="max-w-sm text-sm text-[#bb7375]/70">
              Explorá el catálogo e ingresá un código de acceso para desbloquear tu primer curso.
            </p>
            <Link href="/cursos">
              <Button className="rounded-full bg-[#bb7375] text-white hover:bg-[#a86466]">
                Ver Cursos
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {misCursos.map(({ acceso, curso, activo, diasRestantes, totalLecciones, leccionesCompletadas }) => (
              <div key={acceso.id} data-testid={`card-mi-curso-${curso.id}`}
                className="overflow-hidden rounded-2xl bg-white shadow-sm">
                <div className="relative h-44">
                  <Image src={curso.imagen} alt={curso.titulo} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <Badge className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${
                    activo ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                  }`}>
                    {activo ? "Activo" : "Vencido"}
                  </Badge>
                </div>
                <div className="flex flex-col gap-3 p-5">
                  <div>
                    <Badge className="mb-2 rounded-full bg-[#e9e8e8] px-3 py-1 text-xs text-[#bb7375]">{curso.nivel}</Badge>
                    <h3 className="font-bold text-[#bb7375]">{curso.titulo}</h3>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#bb7375]/60">
                    <ClockIcon className="h-4 w-4" />
                    {activo
                      ? <span className="text-green-600 font-medium">{diasRestantes} días restantes</span>
                      : <span className="text-red-500">Acceso vencido</span>
                    }
                  </div>
                  {totalLecciones > 0 && (
                    <div className="flex items-center gap-2 text-sm text-[#bb7375]/70">
                      <BookOpenIcon className="h-4 w-4" />
                      <span>
                        {leccionesCompletadas}/{totalLecciones} clases
                        {leccionesCompletadas === totalLecciones && (
                          <span className="ml-1 text-green-600 font-medium">✓ Completado</span>
                        )}
                      </span>
                    </div>
                  )}
                  <Link href={activo ? `/cursos/${curso.id}/aprender` : `/cursos/${curso.id}`}>
                    <Button className={`w-full rounded-full ${activo
                      ? "bg-[#bb7375] text-white hover:bg-[#a86466]"
                      : "border border-[#bb7375] bg-white text-[#bb7375] hover:bg-[#bb7375]/10"
                    }`} data-testid={`btn-ir-curso-${curso.id}`}>
                      {activo ? <><PlayCircleIcon className="mr-2 h-4 w-4" />Continuar</> : "Ver detalles"}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
