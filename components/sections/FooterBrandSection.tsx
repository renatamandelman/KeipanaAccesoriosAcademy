import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const steps = [
  {
    title: "1. Elegí y comprá",
    description:
      "Elegí el curso que más te guste de nuestro catálogo y serás redirigido a WhatsApp para realizar la compra",
    iconSrc: "/figmaAssets/frame-7.svg",
    iconAlt: "Elegí y comprá",
  },
  {
    title: "2. Código recibido",
    description:
      "Una vez comprado, recibís un código de acceso único. Creá tu cuenta o iniciá sesión para canjearlo y desbloquear el contenido del curso.",
    iconSrc: "/figmaAssets/frame-2.svg",
    iconAlt: "Código recibido",
  },
  {
    title: "3. Empezá a aprender",
    description:
      "Ingresá tu código y empezá a crear accesorios únicos hechos por vos.",
    iconSrc: "/figmaAssets/frame-1.svg",
    iconAlt: "Empezá a aprender",
  },
];

export const FooterBrandSection = (): JSX.Element => {
  return (
    <section className="relative z-[1] w-full self-stretch bg-white px-0 py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-start gap-12 px-6 md:gap-16 md:px-8">
        <header className="flex w-full flex-col items-center gap-4 text-center">
          <h2 className="font-poppins text-3xl font-bold leading-9 tracking-[-0.50px] text-[#bb7375] md:text-4xl md:leading-10">
            ¿Cómo funciona?
          </h2>
          <p className="font-poppins text-base font-normal leading-6 tracking-[-0.50px] text-[#bb7375] md:text-lg md:leading-7">
            Simples pasos para empezar a crear tus propios accesorios
          </p>
        </header>
        <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <Card
              key={step.title}
              className="border-0 bg-transparent shadow-none"
            >
              <CardContent className="flex h-full flex-col items-center gap-6 px-0 pb-0 pt-0 text-center">
                <Image
                  className="h-20 w-20"
                  alt={step.iconAlt}
                  src={step.iconSrc}
                  width={80}
                  height={80}
                />
                <h3 className="font-poppins text-xl font-bold leading-7 tracking-[-0.50px] text-[#bb7375]">
                  {step.title}
                </h3>
                <p className="font-poppins max-w-[320px] text-base font-normal leading-6 tracking-[-0.50px] text-[#bb7375]">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
