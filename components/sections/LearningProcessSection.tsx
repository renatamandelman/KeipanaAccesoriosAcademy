"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const courses = [
  {
    level: "Nivel I",
    levelClassName: "bg-white text-[#bb7375]",
    title: "Principiante",
    subtitle: "4 Clases - 2hrs semanales",
    access: "6 meses de acceso",
    price: "",
    image: "/figmaAssets/img-1.png",
  },
  {
    level: "Nivel II",
    levelClassName: "bg-pink-300 text-white",
    title: "Avanzado",
    subtitle: "8 Clases - 2hrs Semanales",
    access: "12 meses de acceso",
    price: "",
    image: "/figmaAssets/img-2.png",
  },
  {
    level: "Intermedio",
    levelClassName: "bg-white text-[#bb7375]",
    title: "Tejido Medieval",
    subtitle: "4 clases - 2hrs semanales",
    access: "9 meses de acceso",
    price: "$199",
    image: "/figmaAssets/img-3.png",
  },
];

export const LearningProcessSection = (): JSX.Element => {
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
          {courses.map((course, index) => (
            <Card
              key={`${course.level}-${index}`}
              className="overflow-hidden rounded-3xl border-0 bg-white shadow-[0px_10px_15px_#0000001a,0px_4px_6px_#0000001a]"
            >
              <CardContent className="p-0">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={course.image}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col gap-2 p-6">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`h-auto rounded-full px-3 py-1 font-poppins text-sm font-medium leading-5 tracking-[-0.50px] shadow-none ${course.levelClassName}`}
                    >
                      {course.level}
                    </Badge>
                    {course.price ? (
                      <div className="font-poppins text-lg font-bold leading-7 tracking-[-0.50px] text-[#bb7375]">
                        {course.price}
                      </div>
                    ) : (
                      <div aria-hidden="true" className="h-[31px]" />
                    )}
                  </div>
                  <h3 className="self-stretch font-poppins text-xl font-bold leading-7 tracking-[-0.50px] text-[#bb7375]">
                    {course.title}
                  </h3>
                  <p className="self-stretch font-poppins text-base font-normal leading-6 tracking-[-0.50px] text-[#bb7375]">
                    {course.subtitle}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-center gap-1">
                      <span className="font-poppins text-sm font-normal leading-[normal] tracking-[-0.50px] text-[#bb7375]">
                        {course.access}
                      </span>
                      <Image
                        className="w-3.5"
                        alt="Frame"
                        src="/figmaAssets/frame-3.svg"
                        width={14}
                        height={14}
                      />
                    </div>
                    <Button className="h-auto rounded-full border-0 bg-[#bb7375] px-4 py-2 font-poppins text-base font-normal leading-6 tracking-[-0.50px] text-white hover:bg-[#bb7375]/90">
                      Ver información
                    </Button>
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
