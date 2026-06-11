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

export default function LoginPage() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { refresh } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mail, password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Error al iniciar sesión"); setLoading(false); return; }
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
          <h1 className="mt-4 text-2xl font-bold text-[#bb7375]">Iniciar sesión</h1>
          <p className="mt-1 text-sm text-[#bb7375]/70">Accedé a tus cursos de bijouterie</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow-md">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="mail" className="text-sm font-medium text-[#bb7375]">Email</Label>
              <Input id="mail" type="email" value={mail} onChange={(e) => setMail(e.target.value)}
                placeholder="tu@email.com" required className="border-[#bb7375]/30 focus-visible:ring-[#bb7375]"
                data-testid="input-mail" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-[#bb7375]">Contraseña</Label>
              <div className="relative">
                <Input id="password" type={showPass ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                  className="border-[#bb7375]/30 pr-10 focus-visible:ring-[#bb7375]" data-testid="input-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#bb7375]/50">
                  {showPass ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={loading} data-testid="btn-login"
              className="h-11 w-full rounded-full bg-[#bb7375] text-white hover:bg-[#bb7375/90]">
              {loading ? "Ingresando..." : "Ingresar"}
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-[#bb7375]/70">
            ¿No tenés cuenta?{" "}
            <Link href="/auth/registro" className="font-semibold text-[#bb7375] hover:underline">
              Registrate
            </Link>
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-[#bb7375]/50">
          Admin demo: admin@keipana.com / admin123
        </p>
      </div>
    </main>
  );
}
