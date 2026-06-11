"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SearchIcon, MenuIcon, XIcon, UserIcon, LogOutIcon, ShieldIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { label: "Inicio", href: "/" },
  { label: "Cursos", href: "/cursos" },
  { label: "Cómo funciona", href: "/#como-funciona" },
  { label: "Contacto", href: "/#contacto" },
];

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <header className="relative z-[4] w-full border-b border-[#bb7375] bg-white/90 backdrop-blur-[6px]">
      <div className="mx-auto flex w-full max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[82px] w-full items-center justify-between gap-4 py-2.5">
          <Link href="/" className="shrink-0">
            <Image src="/figmaAssets/logo.png" alt="Keipana Accesorios" width={86} height={58} className="h-[58px] w-auto object-cover" />
          </Link>

          <nav className="hidden md:flex">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="whitespace-nowrap font-sans text-base font-normal leading-6 tracking-[-0.50px] text-[#bb7375] transition-opacity hover:opacity-80">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full p-0 text-[#bb7375] hover:bg-transparent" aria-label="Buscar">
              <SearchIcon className="h-4 w-4" />
            </Button>
            {user ? (
              <div className="flex items-center gap-2">
                <Link href={user.isAdmin ? "/admin" : "/mis-cursos"}>
                  <Button variant="ghost" className="h-auto rounded-full border border-[#bb7375] px-4 py-2 text-sm text-[#bb7375] hover:bg-[#bb7375]/10">
                    <UserIcon className="mr-1 h-4 w-4" />
                    {user.nombre}
                  </Button>
                </Link>
                {user.isAdmin && (
                  <Link href="/admin">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-[#bb7375]">
                      <ShieldIcon className="h-4 w-4" />
                    </Button>
                  </Link>
                )}
                <Button variant="ghost" size="icon" onClick={handleLogout} className="h-8 w-8 text-[#bb7375]" aria-label="Cerrar sesión">
                  <LogOutIcon className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button className="h-auto rounded-full bg-[#bb7375] px-4 py-2 text-base text-white hover:bg-[#bb7375/90]">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <button className="md:hidden text-[#bb7375]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            {menuOpen ? <XIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#bb7375]/20 bg-white px-6 pb-4 md:hidden">
          <ul className="flex flex-col gap-3 pt-3">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="block text-[#bb7375]" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              </li>
            ))}
            {user ? (
              <>
                <li><Link href="/mis-cursos" className="block text-[#bb7375]" onClick={() => setMenuOpen(false)}>Mis Cursos</Link></li>
                {user.isAdmin && <li><Link href="/admin" className="block text-[#bb7375]" onClick={() => setMenuOpen(false)}>Admin</Link></li>}
                <li><button onClick={handleLogout} className="text-[#bb7375]">Cerrar Sesión</button></li>
              </>
            ) : (
              <li><Link href="/auth/login" className="block text-[#bb7375]" onClick={() => setMenuOpen(false)}>Login</Link></li>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
