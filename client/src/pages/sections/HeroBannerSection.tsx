import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = ["Home", "Cursos", "Sobre Mi", "Contacto"];

export const HeroBannerSection = (): JSX.Element => {
  return (
    <header className="relative z-[4] w-full border-b border-[#bb7375] bg-[#ffffffe6] backdrop-blur-[6px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(6px)_brightness(100%)]">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[82px] w-full items-center justify-between gap-4 py-2.5">
          <a href="#" className="shrink-0">
            <img
              className="h-[58px] w-[85.66px] object-cover"
              alt="Keipara"
              src="/figmaAssets/logo.png"
            />
          </a>
          <nav aria-label="Main navigation" className="hidden md:flex">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item}>
                  <button
                    type="button"
                    className="whitespace-nowrap [font-family:'Poppins',Helvetica] text-base font-normal leading-6 tracking-[-0.50px] text-[#bb7375] transition-opacity hover:opacity-80"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full p-0 text-[#bb7375] hover:bg-transparent hover:text-[#bb7375]/80"
              aria-label="Buscar"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              className="h-auto rounded-full bg-[#bb7375] px-4 py-2 [font-family:'Poppins',Helvetica] text-base font-normal leading-6 tracking-[-0.50px] text-white hover:bg-[#a86466]"
            >
              Login
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
