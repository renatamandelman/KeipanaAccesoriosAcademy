"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type Curso } from "@shared/schema";
import { ClockIcon, FilterIcon } from "lucide-react";

const niveles = ["Todos", "Nivel I", "Nivel II", "Intermedio", "Principiante", "Avanzado"];

export default function CursosPage() {
  const [filtro, setFiltro] = useState("Todos");

  const { data: cursos = [], isLoading } = useQuery<Curso[]>({
    queryKey: ["/api/cursos"],
  });

  const filtered = filtro === "Todos" ? cursos : cursos.filter((c) => c.nivel === filtro);

  return (
    <main className="min-h-screen bg-[#e9e8e8]">
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-6 py-12 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="font-sans text-4xl font-bold tracking-[-0.5px] text-[#bb7375] lg:text-5xl">Nuestros Cursos</h1>
          <p className="mt-3 text-lg text-[#bb7375]/80">Online y Presencial · Todos los niveles</p>
        </header>

        <div className="mb-8 flex flex-wrap items-center gap-2">
          <FilterIcon className="h-4 w-4 text-[#bb7375]" />
          {niveles.map((n) => (
            <button
              key={n}
              onClick={() => setFiltro(n)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filtro === n
                  ? "bg-[#bb7375] text-white"
                  : "bg-white text-[#bb7375] hover:bg-[#bb7375]/10"
              }`}
              data-testid={`filter-${n}`}
            >
              {n}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-white/60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-[#bb7375]">No hay cursos disponibles para este nivel.</div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((curso) => (
              <CourseCard key={curso.id} curso={curso} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function CourseCard({ curso }: { curso: Curso }) {
  return (
    <div data-testid={`card-curso-${curso.id}`} className="group overflow-hidden rounded-3xl bg-white shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a] transition-transform hover:-translate-y-1">
      <div className="relative h-52 w-full overflow-hidden">
        <Image src={curso.imagen} alt={curso.titulo} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        <Badge className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-sm font-medium text-[#bb7375] shadow-sm">
          {curso.nivel}
        </Badge>
        {Number(curso.precio) > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-[#bb7375] px-3 py-1 text-sm font-bold text-white">
            ${curso.precio}
          </span>
        )}
      </div>
      <div className="flex flex-col gap-3 p-6">
        <h3 className="text-xl font-bold leading-tight text-[#bb7375]">{curso.titulo}</h3>
        <p className="line-clamp-2 text-sm text-[#bb7375]/70">{curso.descripcion}</p>
        <div className="flex items-center gap-1 text-sm text-[#bb7375]/60">
          <ClockIcon className="h-4 w-4" />
          <span>{curso.duracionDias} días de acceso</span>
        </div>
        <Link href={`/cursos/${curso.id}`} data-testid={`btn-ver-curso-${curso.id}`}>
          <Button className="mt-2 w-full rounded-full bg-[#bb7375] text-white hover:bg-[#a86466]">
            Ver Curso
          </Button>
        </Link>
      </div>
    </div>
  );
}
