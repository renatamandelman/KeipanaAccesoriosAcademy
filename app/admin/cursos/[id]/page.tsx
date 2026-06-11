"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import {
  ArrowLeftIcon, PlusIcon, PencilIcon, Trash2Icon,
  CheckIcon, XIcon, GripVerticalIcon, PlayCircleIcon,
  ImageIcon, SaveIcon
} from "lucide-react";
import type { Curso, Leccion } from "@shared/schema";

type CursoDetail = Curso & { lecciones: Leccion[] };

const emptyLeccion = { titulo: "", videoUrl: "", descripcion: "", duracionMinutos: 0, orden: 1 };

export default function AdminCursoPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [curso, setCurso] = useState<CursoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const [form, setForm] = useState({
    titulo: "", descripcion: "", imagen: "", duracionDias: 180, precio: "0", nivel: "Nivel I"
  });

  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [showLeccionForm, setShowLeccionForm] = useState(false);
  const [editingLeccion, setEditingLeccion] = useState<string | null>(null);
  const [leccionForm, setLeccionForm] = useState(emptyLeccion);
  const [savingLeccion, setSavingLeccion] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.isAdmin) { router.push("/"); return; }
    load();
  }, [user, authLoading, id]);

  const load = async () => {
    setLoading(true);
    const data: CursoDetail = await fetch(`/api/cursos/${id}`).then(r => r.json());
    setCurso(data);
    setForm({
      titulo: data.titulo,
      descripcion: data.descripcion,
      imagen: data.imagen,
      duracionDias: data.duracionDias,
      precio: String(data.precio),
      nivel: data.nivel,
    });
    setLecciones(data.lecciones || []);
    setLoading(false);
  };

  const saveCurso = async () => {
    setSaving(true);
    await fetch(`/api/cursos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, duracionDias: Number(form.duracionDias) }),
    });
    setSaving(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const openNewLeccion = () => {
    setLeccionForm({ ...emptyLeccion, orden: lecciones.length + 1 });
    setEditingLeccion(null);
    setShowLeccionForm(true);
  };

  const openEditLeccion = (l: Leccion) => {
    setLeccionForm({
      titulo: l.titulo,
      videoUrl: l.videoUrl,
      descripcion: l.descripcion ?? "",
      duracionMinutos: l.duracionMinutos ?? 0,
      orden: l.orden,
    });
    setEditingLeccion(l.id);
    setShowLeccionForm(true);
  };

  const saveLeccion = async () => {
    setSavingLeccion(true);
    if (editingLeccion) {
      const updated: Leccion = await fetch(`/api/lecciones/${editingLeccion}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leccionForm),
      }).then(r => r.json());
      setLecciones(prev => prev.map(l => l.id === editingLeccion ? updated : l));
    } else {
      const created: Leccion = await fetch(`/api/cursos/${id}/lecciones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...leccionForm, cursoId: id }),
      }).then(r => r.json());
      setLecciones(prev => [...prev, created]);
    }
    setSavingLeccion(false);
    setShowLeccionForm(false);
  };

  const deleteLeccion = async (leccionId: string) => {
    if (!confirm("¿Eliminar esta lección?")) return;
    await fetch(`/api/lecciones/${leccionId}`, { method: "DELETE" });
    setLecciones(prev => prev.filter(l => l.id !== leccionId));
  };

  const getVideoEmbed = (url: string) => {
    if (!url) return null;
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    return url;
  };

  if (authLoading || loading) return (
    <main className="min-h-screen bg-[#e9e8e8]"><Navbar />
      <div className="mx-auto max-w-screen-xl px-6 py-12">
        <div className="h-96 animate-pulse rounded-3xl bg-white/60" />
      </div>
    </main>
  );

  if (!curso) return null;

  return (
    <main className="min-h-screen bg-[#e9e8e8]">
      <Navbar />
      <div className="mx-auto max-w-screen-xl px-6 py-10 lg:px-8">
        <Link href="/admin" className="mb-6 inline-flex items-center gap-2 text-sm text-[#bb7375] hover:opacity-80">
          <ArrowLeftIcon className="h-4 w-4" /> Volver al panel
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">

          {/* ── Datos del curso ── */}
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-[#bb7375]">Información del curso</h2>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-sm text-[#bb7375]">Título</Label>
                <Input value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })}
                  className="mt-1 border-[#bb7375]/30" data-testid="input-titulo" />
              </div>
              <div>
                <Label className="text-sm text-[#bb7375]">Descripción</Label>
                <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                  rows={4} className="mt-1 w-full rounded-md border border-[#bb7375]/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#bb7375]"
                  data-testid="input-descripcion" />
              </div>
              <div>
                <Label className="text-sm text-[#bb7375]">URL de imagen de portada</Label>
                <Input value={form.imagen} onChange={e => setForm({ ...form, imagen: e.target.value })}
                  placeholder="https://... o /figmaAssets/img.png"
                  className="mt-1 border-[#bb7375]/30" data-testid="input-imagen" />
                {form.imagen && (
                  <div className="mt-2 relative h-32 w-full overflow-hidden rounded-xl">
                    <Image src={form.imagen} alt="Preview" fill className="object-cover" />
                  </div>
                )}
                <p className="mt-1 text-xs text-[#bb7375]/50">
                  Podés usar links de Google Drive, Cloudinary, o cualquier URL de imagen pública.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-sm text-[#bb7375]">Nivel</Label>
                  <select value={form.nivel} onChange={e => setForm({ ...form, nivel: e.target.value })}
                    className="mt-1 w-full rounded-md border border-[#bb7375]/30 px-3 py-2 text-sm focus:outline-none">
                    {["Nivel I", "Nivel II", "Intermedio", "Avanzado", "Principiante"].map(n => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-sm text-[#bb7375]">Precio ($)</Label>
                  <Input type="number" min="0" value={form.precio}
                    onChange={e => setForm({ ...form, precio: e.target.value })}
                    className="mt-1 border-[#bb7375]/30" />
                </div>
                <div>
                  <Label className="text-sm text-[#bb7375]">Días de acceso</Label>
                  <Input type="number" min="1" value={form.duracionDias}
                    onChange={e => setForm({ ...form, duracionDias: Number(e.target.value) })}
                    className="mt-1 border-[#bb7375]/30" />
                </div>
              </div>
              <Button onClick={saveCurso} disabled={saving}
                className="mt-2 w-full rounded-full bg-[#bb7375] text-white hover:bg-[#bb7375/90]" data-testid="btn-guardar-curso">
                {saving ? "Guardando..." : savedMsg ? (
                  <><CheckIcon className="mr-2 h-4 w-4" />Guardado</>
                ) : (
                  <><SaveIcon className="mr-2 h-4 w-4" />Guardar cambios</>
                )}
              </Button>
            </div>
          </div>

          {/* ── Lecciones ── */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#bb7375]">
                  Lecciones <span className="text-sm font-normal text-[#bb7375]/50">({lecciones.length})</span>
                </h2>
                <Button onClick={openNewLeccion} size="sm"
                  className="rounded-full bg-[#bb7375] text-white hover:bg-[#bb7375/90]" data-testid="btn-nueva-leccion">
                  <PlusIcon className="mr-1 h-4 w-4" />Nueva lección
                </Button>
              </div>

              {lecciones.length === 0 ? (
                <div className="rounded-xl bg-[#e9e8e8] py-10 text-center">
                  <PlayCircleIcon className="mx-auto mb-2 h-10 w-10 text-[#bb7375]/30" />
                  <p className="text-sm text-[#bb7375]/50">No hay lecciones todavía.<br />Agregá la primera con el botón de arriba.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {lecciones
                    .sort((a, b) => a.orden - b.orden)
                    .map((l) => (
                      <div key={l.id} className="flex items-center gap-3 rounded-xl border border-[#bb7375]/10 bg-[#e9e8e8]/50 px-4 py-3">
                        <GripVerticalIcon className="h-4 w-4 shrink-0 text-[#bb7375]/30" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#bb7375] truncate">{l.titulo}</p>
                          <p className="text-xs text-[#bb7375]/50 truncate">{l.videoUrl || "Sin URL de video"}</p>
                          {l.duracionMinutos ? (
                            <p className="text-xs text-[#bb7375]/40">{l.duracionMinutos} min</p>
                          ) : null}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => openEditLeccion(l)}
                            className="rounded-lg p-1.5 text-[#bb7375] hover:bg-[#bb7375]/10" data-testid={`btn-editar-leccion-${l.id}`}>
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button onClick={() => deleteLeccion(l.id)}
                            className="rounded-lg p-1.5 text-red-400 hover:bg-red-50" data-testid={`btn-eliminar-leccion-${l.id}`}>
                            <Trash2Icon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Tip para videos */}
            <div className="rounded-2xl bg-[#bb7375]/5 border border-[#bb7375]/15 p-4">
              <p className="text-sm font-semibold text-[#bb7375] mb-1">💡 ¿Cómo subir videos?</p>
              <ul className="text-xs text-[#bb7375]/70 space-y-1">
                <li>• <strong>YouTube:</strong> subí el video y pegá la URL (ej: youtube.com/watch?v=...)</li>
                <li>• <strong>Vimeo:</strong> igual, pegá la URL de Vimeo</li>
                <li>• <strong>Google Drive:</strong> compartí el video y pegá el link</li>
                <li>• <strong>Imágenes:</strong> podés usar Cloudinary (gratis) o cualquier link público</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Form Modal */}
      {showLeccionForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#bb7375]">
                {editingLeccion ? "Editar lección" : "Nueva lección"}
              </h2>
              <button onClick={() => setShowLeccionForm(false)} className="text-[#bb7375]/50 hover:text-[#bb7375]">
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-sm text-[#bb7375]">Título de la lección</Label>
                <Input value={leccionForm.titulo}
                  onChange={e => setLeccionForm({ ...leccionForm, titulo: e.target.value })}
                  placeholder="Ej: Introducción a la bijouterie"
                  className="mt-1 border-[#bb7375]/30" data-testid="input-leccion-titulo" />
              </div>
              <div>
                <Label className="text-sm text-[#bb7375]">URL del video</Label>
                <Input value={leccionForm.videoUrl}
                  onChange={e => setLeccionForm({ ...leccionForm, videoUrl: e.target.value })}
                  placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
                  className="mt-1 border-[#bb7375]/30" data-testid="input-leccion-video" />
                {leccionForm.videoUrl && getVideoEmbed(leccionForm.videoUrl) && (
                  <div className="mt-2 rounded-xl overflow-hidden aspect-video bg-black">
                    <iframe
                      src={getVideoEmbed(leccionForm.videoUrl)!}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
                <p className="mt-1 text-xs text-[#bb7375]/50">
                  Pegá una URL de YouTube, Vimeo o video directo. Se muestra preview automático.
                </p>
              </div>
              <div>
                <Label className="text-sm text-[#bb7375]">Descripción (opcional)</Label>
                <textarea value={leccionForm.descripcion}
                  onChange={e => setLeccionForm({ ...leccionForm, descripcion: e.target.value })}
                  rows={2} placeholder="Breve descripción de la lección..."
                  className="mt-1 w-full rounded-md border border-[#bb7375]/30 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#bb7375]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm text-[#bb7375]">Duración (minutos)</Label>
                  <Input type="number" min="0" value={leccionForm.duracionMinutos}
                    onChange={e => setLeccionForm({ ...leccionForm, duracionMinutos: Number(e.target.value) })}
                    className="mt-1 border-[#bb7375]/30" />
                </div>
                <div>
                  <Label className="text-sm text-[#bb7375]">Orden</Label>
                  <Input type="number" min="1" value={leccionForm.orden}
                    onChange={e => setLeccionForm({ ...leccionForm, orden: Number(e.target.value) })}
                    className="mt-1 border-[#bb7375]/30" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowLeccionForm(false)}
                  className="flex-1 rounded-full border-[#bb7375] text-[#bb7375]">
                  Cancelar
                </Button>
                <Button onClick={saveLeccion} disabled={savingLeccion || !leccionForm.titulo || !leccionForm.videoUrl}
                  className="flex-1 rounded-full bg-[#bb7375] text-white" data-testid="btn-guardar-leccion">
                  {savingLeccion ? "Guardando..." : <><CheckIcon className="mr-2 h-4 w-4" />Guardar</>}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
