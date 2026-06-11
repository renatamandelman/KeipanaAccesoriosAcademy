import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Clientas (Users) ───────────────────────────────────────────────────────
export const clientas = pgTable("clientas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nombre: text("nombre").notNull(),
  apellido: text("apellido").notNull(),
  mail: text("mail").notNull().unique(),
  telefono: text("telefono").notNull(),
  password: text("password").notNull(),
  activa: boolean("activa").default(true).notNull(),
  isAdmin: boolean("is_admin").default(false).notNull(),
  creadaEn: timestamp("creada_en").defaultNow().notNull(),
});

export const insertClientaSchema = createInsertSchema(clientas).omit({ id: true, creadaEn: true, activa: true, isAdmin: true });
export type InsertClienta = z.infer<typeof insertClientaSchema>;
export type Clienta = typeof clientas.$inferSelect;

// ─── Cursos ──────────────────────────────────────────────────────────────────
export const cursos = pgTable("cursos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").notNull(),
  imagen: text("imagen").notNull().default("/figmaAssets/predeterminada.jpg"),
  duracionDias: integer("duracion_dias").notNull().default(180),
  precio: decimal("precio", { precision: 10, scale: 2 }).notNull().default("0"),
  nivel: text("nivel").notNull().default("Principiante"),
  activo: boolean("activo").default(true).notNull(),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
});

export const insertCursoSchema = createInsertSchema(cursos).omit({ id: true, creadoEn: true, activo: true });
export type InsertCurso = z.infer<typeof insertCursoSchema>;
export type Curso = typeof cursos.$inferSelect;

// ─── Lecciones ────────────────────────────────────────────────────────────────
export const lecciones = pgTable("lecciones", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cursoId: varchar("curso_id").notNull().references(() => cursos.id, { onDelete: "cascade" }),
  titulo: text("titulo").notNull(),
  descripcion: text("descripcion").default(""),
  videoUrl: text("video_url").notNull(),
  orden: integer("orden").notNull().default(1),
  duracionMinutos: integer("duracion_minutos").default(0),
});

export const insertLeccionSchema = createInsertSchema(lecciones).omit({ id: true });
export type InsertLeccion = z.infer<typeof insertLeccionSchema>;
export type Leccion = typeof lecciones.$inferSelect;

// ─── Codigos de Acceso ───────────────────────────────────────────────────────
export const codigos = pgTable("codigos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  cursoId: varchar("curso_id").notNull().references(() => cursos.id, { onDelete: "cascade" }),
  codigo: text("codigo").notNull().unique(),
  usado: boolean("usado").default(false).notNull(),
  usadoPor: varchar("usado_por").references(() => clientas.id),
  creadoEn: timestamp("creado_en").defaultNow().notNull(),
  usadoEn: timestamp("usado_en"),
});

export const insertCodigoSchema = createInsertSchema(codigos).omit({ id: true, creadoEn: true, usado: true });
export type InsertCodigo = z.infer<typeof insertCodigoSchema>;
export type Codigo = typeof codigos.$inferSelect;

// ─── Accesos (User ↔ Course) ──────────────────────────────────────────────────
export const accesos = pgTable("accesos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  clientaId: varchar("clienta_id").notNull().references(() => clientas.id, { onDelete: "cascade" }),
  cursoId: varchar("curso_id").notNull().references(() => cursos.id, { onDelete: "cascade" }),
  codigoId: varchar("codigo_id").references(() => codigos.id),
  fechaInicio: timestamp("fecha_inicio").defaultNow().notNull(),
  fechaFin: timestamp("fecha_fin").notNull(),
});

export const insertAccesoSchema = createInsertSchema(accesos).omit({ id: true });
export type InsertAcceso = z.infer<typeof insertAccesoSchema>;
export type Acceso = typeof accesos.$inferSelect;
