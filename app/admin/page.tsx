"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  ShieldIcon, BookOpenIcon, UsersIcon, KeyIcon, PlusIcon,
  PencilIcon, Trash2Icon, XIcon, CheckIcon, CopyIcon, LayoutIcon,
  LayoutDashboardIcon, ArrowRightIcon
} from "lucide-react";
import type { Curso, Clienta } from "@shared/schema";

type Tab = "dashboard" | "cursos" | "clientas" | "codigos";

type CodigoRow = {
  id: string; codigo: string; usado: boolean; creadoEn: string;
  usadoEn: string | null; cursoId: string; titulo: string;
};

const emptyForm = { titulo: "", descripcion: "", imagen: "/figmaAssets/img.png", duracionDias: 180, precio: "0", nivel: "Nivel I" };

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("dashboard");

  const [cursos, setCursos] = useState<Curso[]>([]);
  const [clientas, setClientas] = useState<Omit<Clienta, "password">[]>([]);
  const [codigos, setCodigos] = useState<CodigoRow[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const [codeModal, setCodeModal] = useState<{ cursoId: string; titulo: string } | null>(null);
  const [codeQty, setCodeQty] = useState(1);
  const [genLoading, setGenLoading] = useState(false);
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) { router.push("/"); return; }
    loadAll();
  }, [user, authLoading, router]);

  const loadAll = async () => {
    const [c, cl, co] = await Promise.all([
      fetch("/api/cursos").then((r) => r.json()),
      fetch("/api/admin/clientas").then((r) => r.json()),
      fetch("/api/admin/codigos").then((r) => r.json()),
    ]);
    setCursos(c); setClientas(cl); setCodigos(co);
  };

  const openNew = () => { setForm(emptyForm); setEditingId(null); setShowForm(true); };
  const openEdit = (c: Curso) => {
    setForm({ titulo: c.titulo, descripcion: c.descripcion, imagen: c.imagen, duracionDias: c.duracionDias, precio: String(c.precio), nivel: c.nivel });
    setEditingId(c.id); setShowForm(true);
  };

  const save = async () => {
    setSaving(true);
    const url = editingId ? `/api/cursos/${editingId}` : "/api/cursos";
    const method = editingId ? "PUT" : "POST";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, duracionDias: Number(form.duracionDias) }) });
    setSaving(false); setShowForm(false);
    const updated = await fetch("/api/cursos").then((r) => r.json());
    setCursos(updated);
  };

  const deleteCurso = async (id: string) => {
    if (!confirm("¿Eliminar este curso?")) return;
    await fetch(`/api/cursos/${id}`, { method: "DELETE" });
    setCursos((prev) => prev.filter((c) => c.id !== id));
  };

  const deleteClienta = async (id: string) => {
    if (!confirm("¿Eliminar esta clienta? También se borrarán sus accesos y progreso.")) return;
    const res = await fetch(`/api/admin/clientas?id=${id}`, { method: "DELETE" });
    if (!res.ok) {
      let msg = "Error desconocido";
      try { const data = await res.json(); msg = data.error || msg; } catch { msg = `HTTP ${res.status}`; }
      alert(`Error al eliminar: ${msg}`);
      return;
    }
    setClientas((prev) => prev.filter((cl) => cl.id !== id));
  };

  const generateCodes = async () => {
    if (!codeModal) return;
    setGenLoading(true); setNewCodes([]);
    const res = await fetch("/api/admin/codigos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ cursoId: codeModal.cursoId, cantidad: codeQty }) });
    const data = await res.json();
    setNewCodes(data.map((c: { codigo: string }) => c.codigo));
    setGenLoading(false);
    const updatedCodes = await fetch("/api/admin/codigos").then((r) => r.json());
    setCodigos(updatedCodes);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(newCodes.join("\n"));
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  if (authLoading) return null;

  const tabs = [
    { id: "dashboard" as Tab, label: "Dashboard", Icon: LayoutDashboardIcon },
    { id: "cursos" as Tab, label: "Cursos", Icon: BookOpenIcon },
    { id: "clientas" as Tab, label: "Clientas", Icon: UsersIcon },
    { id: "codigos" as Tab, label: "Códigos", Icon: KeyIcon },
  ];

  const stats = [
    {
      label: "Cursos",
      value: cursos.length,
      icon: BookOpenIcon,
      color: "bg-blue-100 text-blue-600",
      action: () => setTab("cursos"),
    },
    {
      label: "Clientas",
      value: clientas.length,
      icon: UsersIcon,
      color: "bg-green-100 text-green-600",
      action: () => setTab("clientas"),
    },
    {
      label: "Códigos disponibles",
      value: codigos.filter((c) => !c.usado).length,
      icon: KeyIcon,
      color: "bg-amber-100 text-amber-600",
      action: () => setTab("codigos"),
    },
    {
      label: "Códigos usados",
      value: codigos.filter((c) => c.usado).length,
      icon: CheckIcon,
      color: "bg-purple-100 text-purple-600",
      action: () => setTab("codigos"),
    },
  ];

  return (
    <main className="min-h-screen bg-[#e9e8e8]">
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-6 py-10 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <ShieldIcon className="h-7 w-7 text-[#bb7375]" />
          <h1 className="text-3xl font-bold text-[#bb7375]">Panel de Administración</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex gap-2 rounded-2xl bg-white p-1.5 shadow-sm w-fit">
          {tabs.map(({ id, label, Icon }) => (
            <button key={id} onClick={() => setTab(id)} data-testid={`tab-${id}`}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-colors ${
                tab === id ? "bg-[#bb7375] text-white" : "text-[#bb7375] hover:bg-[#bb7375]/10"
              }`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* DASHBOARD TAB */}
        {tab === "dashboard" && (
          <div>
            {/* Stat Cards */}
            <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {stats.map((s) => (
                <button key={s.label} onClick={s.action}
                  className="flex flex-col gap-2 rounded-2xl bg-white p-5 shadow-sm text-left transition-all hover:shadow-md hover:-translate-y-0.5">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                    <s.icon className="h-5 w-5" />
                  </div>
                  <span className="text-2xl font-bold text-[#bb7375]">{s.value}</span>
                  <span className="text-xs text-[#bb7375]/60">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Courses */}
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-[#bb7375]">Últimos cursos</h2>
                  <button onClick={() => setTab("cursos")} className="flex items-center gap-1 text-xs text-[#bb7375]/60 hover:text-[#bb7375]">
                    Ver todos <ArrowRightIcon className="h-3 w-3" />
                  </button>
                </div>
                {cursos.length === 0 ? (
                  <p className="text-sm text-[#bb7375]/40">Todavía no hay cursos creados.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {cursos.map((c) => (
                      <div key={c.id} className="flex items-center gap-3 rounded-xl bg-[#e9e8e8]/50 p-3">
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                          <Image src={c.imagen === "/figmaAssets/img.png" ? "/figmaAssets/predeterminada.jpg" : c.imagen} alt={c.titulo} fill className="object-cover" />
                          <p className="text-xs text-[#bb7375]/50">{c.nivel} · {c.duracionDias} días</p>
                        </div>
                        <Badge className="rounded-full text-xs bg-white text-[#bb7375]">
                          {Number(c.precio) === 0 ? "Gratis" : `$${c.precio}`}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Codes */}
              <div className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-bold text-[#bb7375]">Últimos códigos</h2>
                  <button onClick={() => setTab("codigos")} className="flex items-center gap-1 text-xs text-[#bb7375]/60 hover:text-[#bb7375]">
                    Ver todos <ArrowRightIcon className="h-3 w-3" />
                  </button>
                </div>
                {codigos.length === 0 ? (
                  <p className="text-sm text-[#bb7375]/40">Todavía no se generaron códigos.</p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {codigos.slice(0, 5).map((c) => (
                      <div key={c.id} className="flex items-center justify-between rounded-xl bg-[#e9e8e8]/50 p-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <code className="rounded bg-white px-2 py-0.5 text-xs font-mono text-[#bb7375]">{c.codigo}</code>
                          <span className="truncate text-xs text-[#bb7375]/60">{c.titulo}</span>
                        </div>
                        <Badge className={`rounded-full text-xs shrink-0 ${c.usado ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                          {c.usado ? "Usado" : "Disponible"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* CURSOS TAB */}
        {tab === "cursos" && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-[#bb7375]/70">{cursos.length} cursos disponibles</p>
              <Button onClick={openNew} className="rounded-full bg-[#bb7375] text-white hover:bg-[#bb7375/90]" data-testid="btn-nuevo-curso">
                <PlusIcon className="mr-2 h-4 w-4" />Nuevo Curso
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cursos.map((c) => (
                <div key={c.id} className="flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm" data-testid={`admin-curso-${c.id}`}>
                  <div className="relative h-36 shrink-0">
                    <Image src={c.imagen === "/figmaAssets/img.png" ? "/figmaAssets/predeterminada.jpg" : c.imagen} alt={c.titulo} fill className="object-cover" />
                    <Badge className="absolute left-3 top-3 rounded-full bg-white px-2 py-0.5 text-xs text-[#bb7375]">{c.nivel}</Badge>
                    <span className="absolute right-3 top-3 text-sm font-bold text-white">
                      {Number(c.precio) === 0 ? "Gratis" : `$${c.precio}`}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-bold text-[#bb7375]">{c.titulo}</h3>
                    <p className="mt-1 line-clamp-1 text-xs text-[#bb7375]/60">{c.descripcion}</p>
                    <p className="mt-1 text-xs text-[#bb7375]/50">{c.duracionDias} días de acceso</p>
                    <div className="mt-auto flex gap-2 pt-3">
                      <Link href={`/admin/cursos/${c.id}`} className="flex-1">
                        <Button size="sm" variant="outline"
                          className="w-full rounded-full border-[#bb7375] text-[#bb7375]" data-testid={`btn-editar-${c.id}`}>
                          <LayoutIcon className="mr-1 h-3 w-3" />Editar curso
                        </Button>
                      </Link>
                      <Button size="sm" variant="outline"
                        onClick={() => { setCodeModal({ cursoId: c.id, titulo: c.titulo }); setNewCodes([]); setCodeQty(1); }}
                        className="flex-1 rounded-full border-[#bb7375] text-[#bb7375]" data-testid={`btn-codigos-${c.id}`}>
                        <KeyIcon className="mr-1 h-3 w-3" />Códigos
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => deleteCurso(c.id)}
                        className="rounded-full border-red-300 text-red-400 hover:bg-red-50" data-testid={`btn-eliminar-${c.id}`}>
                        <Trash2Icon className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENTAS TAB */}
        {tab === "clientas" && (
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#e9e8e8] px-6 py-4">
              <p className="text-sm font-medium text-[#bb7375]">{clientas.length} clientas registradas</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#e9e8e8]/50">
                  <tr>{["Nombre", "Apellido", "Mail", "Teléfono", "Estado", "Registrada", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#bb7375]/70">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#e9e8e8]">
                  {clientas.map((cl) => (
                    <tr key={cl.id} className="hover:bg-[#e9e8e8]/20" data-testid={`row-clienta-${cl.id}`}>
                      <td className="px-4 py-3 font-medium text-[#bb7375]">{cl.nombre}</td>
                      <td className="px-4 py-3 text-[#bb7375]/80">{cl.apellido}</td>
                      <td className="px-4 py-3 text-[#bb7375]/80">{cl.mail}</td>
                      <td className="px-4 py-3 text-[#bb7375]/80">{cl.telefono}</td>
                      <td className="px-4 py-3">
                        <Badge className={`rounded-full text-xs ${cl.activa ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                          {cl.activa ? "Activa" : "Inactiva"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#bb7375]/50">
                        {new Date(cl.creadaEn).toLocaleDateString("es-AR")}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => deleteClienta(cl.id)}
                          className="rounded-full p-1.5 text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Eliminar clienta">
                          <Trash2Icon className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CODIGOS TAB */}
        {tab === "codigos" && (
          <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
            <div className="border-b border-[#e9e8e8] px-6 py-4">
              <p className="text-sm font-medium text-[#bb7375]">{codigos.length} códigos generados · {codigos.filter(c => c.usado).length} usados</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#e9e8e8]/50">
                  <tr>{["Código", "Curso", "Estado", "Generado", "Usado"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-[#bb7375]/70">{h}</th>
                  ))}</tr>
                </thead>
                <tbody className="divide-y divide-[#e9e8e8]">
                  {codigos.map((c) => (
                    <tr key={c.id} className="hover:bg-[#e9e8e8]/20">
                      <td className="px-4 py-3">
                        <code className="rounded bg-[#e9e8e8] px-2 py-0.5 text-xs font-mono text-[#bb7375]">{c.codigo}</code>
                      </td>
                      <td className="px-4 py-3 text-[#bb7375]/80">{c.titulo}</td>
                      <td className="px-4 py-3">
                        <Badge className={`rounded-full text-xs ${c.usado ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                          {c.usado ? "Usado" : "Disponible"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#bb7375]/50">{new Date(c.creadoEn).toLocaleDateString("es-AR")}</td>
                      <td className="px-4 py-3 text-xs text-[#bb7375]/50">{c.usadoEn ? new Date(c.usadoEn).toLocaleDateString("es-AR") : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Course Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#bb7375]">{editingId ? "Editar" : "Nuevo"} Curso</h2>
              <button onClick={() => setShowForm(false)} className="text-[#bb7375]/50 hover:text-[#bb7375]"><XIcon className="h-5 w-5" /></button>
            </div>
            <div className="flex flex-col gap-4">
              {([{ key: "titulo", label: "Título" }, { key: "imagen", label: "URL de imagen" }] as { key: string; label: string }[]).map(({ key, label }) => (
                <div key={key}>
                  <Label className="text-sm text-[#bb7375]">{label}</Label>
                  <Input value={(form as Record<string, unknown>)[key] as string}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="mt-1 border-[#bb7375]/30" data-testid={`input-${key}`} />
                </div>
              ))}
              <div>
                <Label className="text-sm text-[#bb7375]">Descripción</Label>
                <textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={3} className="mt-1 w-full rounded-md border border-[#bb7375]/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#bb7375]"
                  data-testid="input-descripcion" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm text-[#bb7375]">Nivel</Label>
                  <select value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })}
                    className="mt-1 w-full rounded-md border border-[#bb7375]/30 px-3 py-2 text-sm">
                    {["Nivel I", "Nivel II", "Intermedio", "Avanzado", "Principiante"].map((n) => <option key={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-sm text-[#bb7375]">Precio ($)</Label>
                  <Input type="number" min="0" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    className="mt-1 border-[#bb7375]/30" />
                </div>
                <div>
                  <Label className="text-sm text-[#bb7375]">Días de acceso</Label>
                  <Input type="number" min="1" value={form.duracionDias} onChange={(e) => setForm({ ...form, duracionDias: Number(e.target.value) })}
                    className="mt-1 border-[#bb7375]/30" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-full border-[#bb7375] text-[#bb7375]">Cancelar</Button>
                <Button onClick={save} disabled={saving} className="flex-1 rounded-full bg-[#bb7375] text-white" data-testid="btn-guardar">
                  {saving ? "Guardando..." : <><CheckIcon className="mr-2 h-4 w-4" />Guardar</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Code Generation Modal */}
      {codeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#bb7375]">Generar Códigos</h2>
              <button onClick={() => setCodeModal(null)} className="text-[#bb7375]/50"><XIcon className="h-5 w-5" /></button>
            </div>
            <p className="mb-4 text-sm text-[#bb7375]/70">Curso: <span className="font-semibold text-[#bb7375]">{codeModal.titulo}</span></p>
            <div className="mb-4">
              <Label className="text-sm text-[#bb7375]">Cantidad de códigos</Label>
              <Input type="number" min={1} max={50} value={codeQty}
                onChange={(e) => setCodeQty(Number(e.target.value))} className="mt-1 border-[#bb7375]/30" />
            </div>
            <Button onClick={generateCodes} disabled={genLoading} className="w-full rounded-full bg-[#bb7375] text-white" data-testid="btn-generar">
              {genLoading ? "Generando..." : "Generar"}
            </Button>
            {newCodes.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-[#bb7375]">Códigos generados:</p>
                  <button onClick={copyAll} className="flex items-center gap-1 text-xs text-[#bb7375] hover:opacity-80">
                    {copied ? <CheckIcon className="h-3 w-3" /> : <CopyIcon className="h-3 w-3" />}
                    {copied ? "Copiado" : "Copiar todos"}
                  </button>
                </div>
                <div className="flex flex-col gap-1 rounded-xl bg-[#e9e8e8] p-3 max-h-40 overflow-y-auto">
                  {newCodes.map((c) => (
                    <code key={c} className="text-sm font-mono font-bold text-[#bb7375]">{c}</code>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
