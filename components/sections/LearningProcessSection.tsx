"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import type { Curso } from "@shared/schema";
import { ClockIcon } from "lucide-react";

export const LearningProcessSection = (): JSX.Element => {
  const { data: cursos = [], isLoading } = useQuery<Curso[]>({
    queryKey: ["/api/cursos"],
  });

  return (
    <section className="relative z-[2] w-full self-stretch bg-[#ffffff4c] px-0 py-20">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-start gap-16 px-8 py-0">
        <header className="flex w-full flex-col items-center gap-4">
          <div className="w-full text-center font-poppins text-4xl font-bold leading-10 tracking-[-0.50px] text-[#bb7375]">
            Cursos
          </div>
          <p className="font-poppins text-center text-lg font-normal leading-7 tracking-[-0.50px] text-[#bb7375]">
            Online y Presencial
          </p>
        </header>
        <div className="grid w-full grid-cols-1 items-start gap-8 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? [1, 2, 3].map((i) => (
                <div key={i} className="h-80 animate-pulse rounded-3xl bg-white/60" />
              ))
            : cursos.map((course) => (
                <Card
                  key={course.id}
                  className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]"
                >
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={course.imagen}
                        alt={course.titulo}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col gap-2 p-6">
                      <div className="flex items-center justify-between">
                        <Badge className="h-auto rounded-full bg-white px-3 py-1 font-poppins text-sm font-medium leading-5 tracking-[-0.50px] text-[#bb7375] shadow-sm border border-[#bb7375]/20">
                          {course.nivel}
                        </Badge>
                        {Number(course.precio) > 0 ? (
                          <div className="font-poppins text-lg font-bold leading-7 tracking-[-0.50px] text-[#bb7375]">
                            ${course.precio}
                          </div>
                        ) : (
                          <div className="font-poppins text-sm font-medium text-[#bb7375]/60">Gratis</div>
                        )}
                      </div>
                      <h3 className="self-stretch font-poppins text-xl font-bold leading-7 tracking-[-0.50px] text-[#bb7375]">
                        {course.titulo}
                      </h3>
                      <p className="self-stretch line-clamp-2 font-poppins text-sm font-normal leading-6 tracking-[-0.50px] text-[#bb7375]/70">
                        {course.descripcion}
                      </p>
                      <div className="flex items-center justify-between gap-4 mt-1">
                        <div className="inline-flex items-center gap-1 text-sm text-[#bb7375]/60">
                          <ClockIcon className="h-3.5 w-3.5" />
                          <span className="font-poppins text-sm font-normal leading-[normal] tracking-[-0.50px]">
                            {course.duracionDias} días de acceso
                          </span>
                        </div>
                        <Link href={`/cursos/${course.id}`} data-testid={`btn-ver-info-${course.id}`}>
                          <Button className="h-auto rounded-full border-0 bg-[#bb7375] px-4 py-2 font-poppins text-base font-normal leading-6 tracking-[-0.50px] text-white hover:bg-[#bb7375]/90">
                            Ver información
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
};
