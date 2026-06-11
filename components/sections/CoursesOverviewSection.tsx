"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

const content = {
  titleLines: ["Aprende a crear", "tus propias", "creaciones"],
  description:
    "Dominá el arte de crear accesorios únicos con nuestros cursos online y presenciales. Desde técnicas básicas hasta diseños avanzados.",
  buttonLabel: "Ver Cursos",
  buttonIcon: "/figmaAssets/frame-8.svg",
  image: "/figmaAssets/header.jpeg",
};

export const CoursesOverviewSection = (): JSX.Element => {
  return (
    <section className="relative z-[3] w-full bg-[#e9e8e8] px-6 py-16 sm:px-10 md:px-16 lg:px-20 lg:py-[96px]">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8">
        <header className="flex w-full max-w-[584px] flex-col items-start gap-6">
          <h2 className="self-stretch font-poppins text-[44px] font-bold leading-[0.95] tracking-[-0.30px] text-[#bb7375] sm:text-[52px] lg:text-6xl lg:leading-[60px]">
            {content.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h2>
          <p className="max-w-[540px] font-poppins text-base font-normal leading-[1.7] tracking-[-0.50px] text-[#bb7375] sm:text-lg lg:text-xl lg:leading-[33px]">
            {content.description}
          </p>
          <Link href="/cursos">
            <Button
              type="button"
              className="h-auto rounded-full bg-[#bb7375] px-8 py-4 font-poppins text-lg font-semibold tracking-[-0.50px] text-white shadow-none hover:opacity-90 hover:bg-[#bb7375]"
              data-testid="btn-ver-cursos-hero"
            >
              <span>{content.buttonLabel}</span>
              <Image
                style={{ width: 24, height: "24px" }}
                alt="Arrow"
                src={content.buttonIcon}
                width={24}
                height={24}
              />
            </Button>
          </Link>
        </header>
        <Card className="w-full max-w-[400px] rounded-[24px] border border-solid border-[#bb7375]/20 bg-[#fad0cd]/20 shadow-none">
          <CardContent className="p-4 sm:p-5">
            <div className="relative overflow-hidden rounded-2xl bg-white/40">
              <Image
                className="block h-auto w-full rounded-2xl object-cover"
                alt="Jewelry course preview"
                src={content.image}
                width={400}
                height={300}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
