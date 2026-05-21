import { Pool } from "pg";

async function migrate() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    CREATE TABLE IF NOT EXISTS clientas (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      nombre TEXT NOT NULL,
      apellido TEXT NOT NULL,
      mail TEXT NOT NULL UNIQUE,
      telefono TEXT NOT NULL,
      password TEXT NOT NULL,
      activa BOOLEAN NOT NULL DEFAULT true,
      is_admin BOOLEAN NOT NULL DEFAULT false,
      creada_en TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS cursos (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      titulo TEXT NOT NULL,
      descripcion TEXT NOT NULL,
      imagen TEXT NOT NULL DEFAULT '/figmaAssets/img.png',
      duracion_dias INTEGER NOT NULL DEFAULT 180,
      precio DECIMAL(10,2) NOT NULL DEFAULT 0,
      nivel TEXT NOT NULL DEFAULT 'Principiante',
      activo BOOLEAN NOT NULL DEFAULT true,
      creado_en TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS lecciones (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      curso_id VARCHAR NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
      titulo TEXT NOT NULL,
      descripcion TEXT DEFAULT '',
      video_url TEXT NOT NULL,
      orden INTEGER NOT NULL DEFAULT 1,
      duracion_minutos INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS codigos (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      curso_id VARCHAR NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
      codigo TEXT NOT NULL UNIQUE,
      usado BOOLEAN NOT NULL DEFAULT false,
      usado_por VARCHAR REFERENCES clientas(id),
      creado_en TIMESTAMP NOT NULL DEFAULT NOW(),
      usado_en TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS accesos (
      id VARCHAR PRIMARY KEY DEFAULT gen_random_uuid(),
      clienta_id VARCHAR NOT NULL REFERENCES clientas(id) ON DELETE CASCADE,
      curso_id VARCHAR NOT NULL REFERENCES cursos(id) ON DELETE CASCADE,
      codigo_id VARCHAR REFERENCES codigos(id),
      fecha_inicio TIMESTAMP NOT NULL DEFAULT NOW(),
      fecha_fin TIMESTAMP NOT NULL
    );
  `);

  console.log("Tables created successfully");
  await pool.end();
}

migrate().catch(console.error);
