import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "1. Elige y compra",
    description:
      "Elige el curso que mas te guste de nuestro catalogo y seras redireccionado a whatsapp para realizar la compra",
    iconSrc: "/figmaAssets/frame-7.svg",
    iconAlt: "Elige y compra",
  },
  {
    title: "2. Codigo recivido",
    description:
      "Una vez comprado, recibes un codigo de acceso unico para desbloquear el contenido del curso",
    iconSrc: "/figmaAssets/frame-2.svg",
    iconAlt: "Codigo recivido",
  },
  {
    title: "3. Start Learning",
    description:
      "Ingresa tu codigo y empeza a crear accesorios hermosos hechos por vos.",
    iconSrc: "/figmaAssets/frame-1.svg",
    iconAlt: "Start Learning",
  },
];

export const FooterBrandSection = (): JSX.Element => {
  return (
    <section className="relative z-[1] w-full self-stretch bg-white px-0 py-16 md:py-20">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-start gap-12 px-6 md:gap-16 md:px-8">
        <header className="flex w-full flex-col items-center gap-4 text-center">
          <h2 className="[font-family:'Poppins',Helvetica] text-3xl font-bold leading-9 tracking-[-0.50px] text-[#bb7375] md:text-4xl md:leading-10">
            Como funciona?
          </h2>
          <p className="[font-family:'Poppins',Helvetica] text-base font-normal leading-6 tracking-[-0.50px] text-[#bb7375] md:text-lg md:leading-7">
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
                <img
                  className="h-20 w-20"
                  alt={step.iconAlt}
                  src={step.iconSrc}
                />
                <h3 className="[font-family:'Poppins',Helvetica] text-xl font-bold leading-7 tracking-[-0.50px] text-[#bb7375]">
                  {step.title}
                </h3>
                <p className="[font-family:'Poppins',Helvetica] max-w-[320px] text-base font-normal leading-6 tracking-[-0.50px] text-[#bb7375]">
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
