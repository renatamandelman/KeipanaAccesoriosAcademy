import { db } from "./db";
import { cursos, lecciones, clientas, codigos } from "@shared/schema";
import bcrypt from "bcryptjs";

export async function seed() {
  const existingCursos = await db.select().from(cursos).limit(1);
  if (existingCursos.length > 0) return;

  // Seed courses
  const [c1] = await db.insert(cursos).values({
    titulo: "Bijouterie Nivel I",
    descripcion: "Aprende desde cero las técnicas fundamentales de la bijouterie. Curso ideal para principiantes que quieren crear sus propios accesorios artesanales con materiales básicos y herramientas simples.",
    imagen: "/figmaAssets/img-1.png",
    duracionDias: 180,
    precio: "0",
    nivel: "Nivel I",
  }).returning();

  const [c2] = await db.insert(cursos).values({
    titulo: "Bijouterie Nivel II",
    descripcion: "Profundiza tus habilidades con técnicas avanzadas de bijouterie. Para quienes ya conocen los fundamentos y quieren llevar sus creaciones al siguiente nivel.",
    imagen: "/figmaAssets/img-2.png",
    duracionDias: 365,
    precio: "149",
    nivel: "Nivel II",
  }).returning();

  const [c3] = await db.insert(cursos).values({
    titulo: "Bijouterie Medieval",
    descripcion: "Descubrí el arte del tejido medieval aplicado a la bijouterie. Técnicas históricas adaptadas para crear piezas únicas con una estética especial.",
    imagen: "/figmaAssets/img-3.png",
    duracionDias: 270,
    precio: "199",
    nivel: "Intermedio",
  }).returning();

  const [c4] = await db.insert(cursos).values({
    titulo: "Cálculo de Costos",
    descripcion: "Aprendé a calcular correctamente los costos de tus creaciones para poder venderlas de manera rentable. Incluye hoja de cálculo y ejemplos prácticos.",
    imagen: "/figmaAssets/img.png",
    duracionDias: 90,
    precio: "79",
    nivel: "Principiante",
  }).returning();

  // Seed lessons
  for (const curso of [c1, c2, c3, c4]) {
    await db.insert(lecciones).values([
      { cursoId: curso.id, titulo: "Introducción al curso", descripcion: "Bienvenida y materiales necesarios", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", orden: 1, duracionMinutos: 10 },
      { cursoId: curso.id, titulo: "Clase 1 - Conceptos básicos", descripcion: "Primera lección del curso", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", orden: 2, duracionMinutos: 45 },
      { cursoId: curso.id, titulo: "Clase 2 - Técnicas principales", descripcion: "Segunda lección del curso", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", orden: 3, duracionMinutos: 50 },
      { cursoId: curso.id, titulo: "Clase 3 - Práctica guiada", descripcion: "Practica junto a la tutora", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", orden: 4, duracionMinutos: 60 },
    ]);
  }

  // Seed admin user
  const hash = await bcrypt.hash("admin123", 10);
  await db.insert(clientas).values({
    nombre: "Admin",
    apellido: "Keipana",
    mail: "admin@keipana.com",
    telefono: "1100000000",
    password: hash,
    isAdmin: true,
  }).onConflictDoNothing();

  // Seed access codes
  await db.insert(codigos).values([
    { cursoId: c1.id, codigo: "NIVEL1-DEMO" },
    { cursoId: c2.id, codigo: "NIVEL2-DEMO" },
    { cursoId: c3.id, codigo: "MEDIEVAL-DEMO" },
    { cursoId: c4.id, codigo: "COSTOS-DEMO" },
  ]).onConflictDoNothing();

  console.log("Seed data inserted successfully");
}
