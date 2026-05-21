---
name: DB migration approach
description: How to push schema changes and seed data for the Keipana platform
---

## Schema push
`npx drizzle-kit push` is **interactive** — it prompts for table rename decisions. It cannot be piped non-interactively in this environment.

**Use instead**: `npx tsx scripts/migrate.ts`
This script runs raw `CREATE TABLE IF NOT EXISTS` SQL, which is always safe to re-run.

**Why**: The drizzle-kit interactive prompt blocks the shell command and cannot be answered via stdin in the Replit bash tool.

**How to apply**: When the schema in `shared/schema.ts` changes, update `scripts/migrate.ts` with matching `ALTER TABLE` or `CREATE TABLE` statements and run it with tsx.

## Seed data
- Seed runs automatically on the **first** GET `/api/cursos` call (checks if any course exists)
- Source: `lib/seed.ts`
- Seeds: 4 courses (Nivel I, Nivel II, Medieval, Costos), 4 lessons each, admin user, 4 demo codes
- Admin credentials: `admin@keipana.com` / `admin123`
- Demo access codes: `NIVEL1-DEMO`, `NIVEL2-DEMO`, `MEDIEVAL-DEMO`, `COSTOS-DEMO`
- Uses `.onConflictDoNothing()` so it's safe to call multiple times
