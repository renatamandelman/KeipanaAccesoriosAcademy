import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const courses = [
  {
    level: "Nivel I",
    levelClassName: "bg-white text-[#bb7375]",
    title: "Principiante",
    subtitle: "4 Clases - 2hrs semanales",
    access: "6 meses de acceso",
    price: "",
    imageClassName:
      "[background:url(..//figmaAssets/img-1.png)_50%_50%_/_cover]",
  },
  {
    level: "Nivel II",
    levelClassName: "bg-pink-300 text-white",
    title: "Avanzado",
    subtitle: "8 Clases - 2hrs Semanales",
    access: "12 meses de acceso",
    price: "",
    imageClassName:
      "[background:url(..//figmaAssets/img-2.png)_50%_50%_/_cover]",
  },
  {
    level: "Intermedio",
    levelClassName: "bg-white text-[#bb7375]",
    title: "Tejido Medieval",
    subtitle: "4 clases - 2hrs semanales",
    access: "9 meses de acceso",
    price: "$199",
    imageClassName:
      "[background:url(..//figmaAssets/img-3.png)_50%_50%_/_cover]",
  },
];

export const LearningProcessSection = (): JSX.Element => {
  return (
    <section className="relative z-[2] w-full self-stretch bg-[#ffffff4c] px-0 py-20">
      <div className="mx-auto flex w-full max-w-screen-xl flex-col items-start gap-16 px-8 py-0">
        <header className="flex w-full flex-col items-center gap-4">
          <div className="w-full text-center [font-family:'Poppins',Helvetica] text-4xl font-bold leading-10 tracking-[-0.50px] text-[#bb7375]">
            Cursos
          </div>
          <p className="[font-family:'Poppins',Helvetica] text-center text-lg font-normal leading-7 tracking-[-0.50px] text-[#bb7375]">
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
                <div className="h-48 w-full overflow-hidden">
                  <div
                    className={`h-48 w-full ${course.imageClassName}`}
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-2 p-6">
                  <div className="flex items-center justify-between">
                    <Badge
                      className={`h-auto rounded-full px-3 py-1 [font-family:'Poppins',Helvetica] text-sm font-medium leading-5 tracking-[-0.50px] shadow-none ${course.levelClassName}`}
                    >
                      {course.level}
                    </Badge>
                    {course.price ? (
                      <div className="[font-family:'Poppins',Helvetica] text-lg font-bold leading-7 tracking-[-0.50px] text-[#bb7375]">
                        {course.price}
                      </div>
                    ) : (
                      <div aria-hidden="true" className="h-[31px]" />
                    )}
                  </div>
                  <h3 className="self-stretch [font-family:'Poppins',Helvetica] text-xl font-bold leading-7 tracking-[-0.50px] text-[#bb7375]">
                    {course.title}
                  </h3>
                  <p className="self-stretch [font-family:'Poppins',Helvetica] text-base font-normal leading-6 tracking-[-0.50px] text-[#bb7375]">
                    {course.subtitle}
                  </p>
                  <div className="flex items-center justify-between gap-4">
                    <div className="inline-flex items-start gap-1">
                      <span className="[font-family:'Poppins',Helvetica] text-sm font-normal leading-[normal] tracking-[-0.50px] text-[#bb7375]">
                        {course.access}
                      </span>
                      <img
                        className="relative w-3.5"
                        alt="Frame"
                        src="/figmaAssets/frame-3.svg"
                      />
                    </div>
                    <Button className="h-auto rounded-full border-0 bg-[#bb7375] px-4 py-2 [font-family:'Poppins',Helvetica] text-base font-normal leading-6 tracking-[-0.50px] text-white hover:bg-[#bb7375]/90">
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
