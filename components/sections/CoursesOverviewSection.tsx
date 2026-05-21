"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const content = {
  titleLines: ["Aprende a crear", "tus propias", "creaciones"],
  description:
    "Master the craft of creating stunning jewelry pieces with our comprehensive online courses. From beginner basics to advanced techniques.",
  buttonLabel: "Explore Courses",
  buttonIcon: "/figmaAssets/frame-8.svg",
  image: "/figmaAssets/img.png",
};

export const CoursesOverviewSection = (): JSX.Element => {
  return (
    <section className="relative z-[3] w-full bg-[#e9e8e8] px-6 py-16 sm:px-10 md:px-16 lg:px-20 lg:py-[96px]">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-8">
        <header className="flex w-full max-w-[584px] flex-col items-start gap-6">
          <h2 className="self-stretch font-poppins text-[44px] font-bold leading-[0.95] tracking-[-0.30px] sm:text-[52px] lg:text-6xl lg:leading-[60px]">
            {content.titleLines.slice(0, 1).map((line) => (
              <span key={line} className="block text-[#bb7375]">
                {line}
              </span>
            ))}
            {content.titleLines.slice(1).map((line) => (
              <span key={line} className="block text-[#ff8279]">
                {line}
              </span>
            ))}
          </h2>
          <p className="max-w-[540px] font-poppins text-base font-normal leading-[1.7] tracking-[-0.50px] text-[#bb7375] sm:text-lg lg:text-xl lg:leading-[33px]">
            {content.description}
          </p>
          <Button
            type="button"
            className="h-auto rounded-full bg-[#bb7375] px-8 py-4 font-poppins text-lg font-semibold tracking-[-0.50px] text-white shadow-none hover:opacity-90 hover:bg-[#bb7375]"
          >
            <span>{content.buttonLabel}</span>
            <Image
              style={{ width: 16, height: "auto" }}
              alt="Arrow"
              src={content.buttonIcon}
              width={16}
              height={16}
            />
          </Button>
        </header>
        <Card className="w-full max-w-[603px] rounded-[24px] border border-solid border-[#bb73752e] bg-[#ffffff40] shadow-none">
          <CardContent className="p-5 sm:p-6 lg:p-8">
            <div className="relative overflow-hidden rounded-2xl bg-white/40">
              <Image
                className="block h-auto w-full rounded-2xl object-cover"
                alt="Jewelry course preview"
                src={content.image}
                width={534}
                height={347}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
