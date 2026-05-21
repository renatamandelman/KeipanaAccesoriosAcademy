import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const links = ["Cursos", "Sobre mi", "Contacto", "Home"];
const helpLinks = ["Contacto"];

export const FooterLinksSection = (): JSX.Element => {
  return (
    <footer className="relative z-0 w-full bg-[#bb7375] px-0 py-16">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col gap-12 px-8">
        <div className="grid w-full grid-cols-1 gap-10 md:grid-cols-[minmax(0,1.6fr)_minmax(220px,280px)_minmax(180px,1fr)] md:gap-8">
          <section className="flex min-w-0 flex-col items-start gap-6">
            <Image
              style={{ width: "100%", maxWidth: 280, height: "auto" }}
              alt="Keipana Accesorios"
              src="/figmaAssets/frame-4.svg"
              width={280}
              height={80}
            />
            <p className="font-poppins text-base font-normal leading-6 tracking-[-0.50px] text-white">
              Master the art of jewelry making with our comprehensive online
              courses.
              <br />
              Create beautiful pieces and turn your passion into skill.
            </p>
            <Image
              className="h-auto w-full max-w-[180px]"
              alt="Decorative footer graphic"
              src="/figmaAssets/frame.svg"
              width={180}
              height={35}
            />
          </section>
          <Card className="border-0 bg-transparent p-0 shadow-none">
            <CardContent className="flex flex-col items-start gap-4 p-0">
              <h2 className="self-stretch font-poppins text-lg font-semibold leading-7 tracking-[-0.50px] text-white">
                Links
              </h2>
              <nav aria-label="Footer links" className="w-full">
                <ul className="flex flex-col items-start gap-2">
                  {links.map((item) => (
                    <li key={item} className="w-full">
                      <button
                        type="button"
                        className="font-poppins h-auto text-left text-base font-normal leading-6 tracking-[-0.50px] text-white transition-opacity hover:opacity-80 focus:outline-none focus:ring-0"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>
          <Card className="border-0 bg-transparent p-0 shadow-none">
            <CardContent className="flex flex-col items-start gap-4 p-0">
              <h2 className="self-stretch font-poppins text-lg font-semibold leading-7 tracking-[-0.50px] text-white">
                Ayuda
              </h2>
              <nav aria-label="Footer help links" className="w-full">
                <ul className="flex flex-col items-start gap-2">
                  {helpLinks.map((item) => (
                    <li key={item} className="w-full">
                      <button
                        type="button"
                        className="font-poppins h-auto text-left text-base font-normal leading-6 tracking-[-0.50px] text-white transition-opacity hover:opacity-80 focus:outline-none focus:ring-0"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </CardContent>
          </Card>
        </div>
        <div className="border-t border-white/10 pt-8">
          <p className="font-poppins text-center text-base font-normal leading-6 tracking-[-0.50px] text-white">
            © 2026 Keipana Accesorios. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
