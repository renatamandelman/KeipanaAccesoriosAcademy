---
name: Platform architecture
description: Stack, file layout, and key conventions for the Keipana Accesorios course platform
---

## Stack
- **Framework**: Next.js 14 App Router (`app/` directory)
- **Styling**: Tailwind CSS v3, shadcn/ui components
- **DB**: Drizzle ORM + PostgreSQL via `pg` Pool; schema at `shared/schema.ts`
- **Auth**: `jose` JWT stored in `session` httpOnly cookie (7d expiry); `lib/auth.ts` for sign/verify; `lib/auth-context.tsx` for client state
- **Fonts**: Poppins from `next/font/google`

## Key files
- `app/layout.tsx` — root layout with `<Providers>` (QueryClient + AuthProvider)
- `components/Providers.tsx` — global QueryClient + AuthProvider wrapper ("use client")
- `components/Navbar.tsx` — auth-aware navbar with admin shield icon
- `lib/db.ts` — Drizzle DB instance
- `lib/auth.ts` — `signToken`, `verifyToken`, `getSession` (server-side)
- `lib/auth-context.tsx` — `useAuth()` hook (client-side)
- `lib/seed.ts` — seeds DB on first run (called by GET /api/cursos)
- `scripts/migrate.ts` — raw SQL migration script (use instead of drizzle-kit push)

## Route structure
- `/` — landing page (server component, imports Navbar + section components)
- `/cursos` — catalog (TanStack Query, filters by nivel)
- `/cursos/[id]` — detail + access code entry
- `/cursos/[id]/aprender` — video player (requires active acceso)
- `/auth/login`, `/auth/registro` — auth forms
- `/mis-cursos` — user dashboard
- `/admin` — admin panel (redirects non-admins to /)

## Important conventions
- `package.json` has `"type": "commonjs"` → `next.config.js` uses `module.exports`
- tsconfig paths: `@/*` → root, `@shared/*` → `./shared/*`
- DO NOT use `@radix-ui/react-icons` — use `lucide-react` for all icons
- Old Express `server/` files still exist but are completely unused
