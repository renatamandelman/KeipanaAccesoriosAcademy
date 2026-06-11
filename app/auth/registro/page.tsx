"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import { EyeIcon, EyeOffIcon } from "lucide-react";

export default function RegistroPage() {
  const [form, setForm] = useState({ nombre: "", apellido: "", mail: "", telefono: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al registrarse"); setLoading(false); return; }
    await refresh();
    router.push("/mis-cursos");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#e9e8e8] px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/">
            <Image src="/figmaAssets/logo.png" alt="Keipana" width={86} height={58} className="mx-auto h-14 w-auto" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-[#bb7375]">Crear cuenta</h1>
          <p className="mt-1 text-sm text-[#bb7375]/70">Registrate para acceder a los cursos</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-md">
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-[#bb7375]">Nombre</Label>
                <Input value={form.nombre} onChange={set("nombre")} placeholder="María" required
                  className="border-[#bb7375]/30" data-testid="input-nombre" />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label className="text-sm font-medium text-[#bb7375]">Apellido</Label>
                <Input value={form.apellido} onChange={set("apellido")} placeholder="García" required
                  className="border-[#bb7375]/30" data-testid="input-apellido" />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#bb7375]">Email</Label>
              <Input type="email" value={form.mail} onChange={set("mail")} placeholder="tu@email.com" required
                className="border-[#bb7375]/30" data-testid="input-mail" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#bb7375]">Número de contacto</Label>
              <Input type="tel" value={form.telefono} onChange={set("telefono")} placeholder="11 1234-5678" required
                className="border-[#bb7375]/30" data-testid="input-telefono" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="text-sm font-medium text-[#bb7375]">Contraseña</Label>
              <div className="relative">
                <Input type={showPass ? "text" : "password"} value={form.password} onChange={set("password")}
                  placeholder="Mínimo 6 caracteres" required minLength={6}
                  className="border-[#bb7375]/30 pr-10" data-testid="input-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bb7375]/50">
                  {showPass ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} data-testid="btn-registro"
              className="h-11 w-full rounded-full bg-[#bb7375] text-white hover:bg-[#bb7375/90]">
              {loading ? "Registrando..." : "Crear cuenta"}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-[#bb7375]/70">
            ¿Ya tenés cuenta?{" "}
            <Link href="/auth/login" className="font-semibold text-[#bb7375] hover:underline">Iniciar sesión</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
