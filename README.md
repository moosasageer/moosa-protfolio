# Moosa Sageer — Portfolio + Admin CMS

A two-part product:

- **Public portfolio** (`/`) — a cinematic, dark, animated developer portfolio.
- **Admin CMS** (`/admin`) — a private dashboard for managing every piece of content
  on the public site without touching code.

Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion,
Prisma, and NextAuth.

---

## 1. Requirements

- Node.js 18.18+ (20.x recommended)
- npm 9+
- [Docker](https://www.docker.com/) (for local Postgres — no separate install needed)

---

## 2. Install

```bash
npm install
```

`npm install` runs `prisma generate` automatically via a `postinstall` hook —
this downloads Prisma's query engine binary, so it needs normal internet
access. If you're installing in a sandboxed/offline environment, run
`npm install --ignore-scripts` and then `npx prisma generate` once you have
network access.

---

## 3. Configure environment variables

Copy the example file:

```bash
cp .env.example .env
```

Then edit `.env`:

| Variable | What it's for |
|---|---|
| `DATABASE_URL` | Points at a local Postgres instance running in Docker by default. In production, swap this to your AWS RDS connection string (see §7 / `DEPLOYMENT.md`) — nothing else changes. |
| `NEXTAUTH_SECRET` | Generate one with `openssl rand -base64 32`. Required. |
| `NEXTAUTH_URL` | Your site's URL — `http://localhost:3000` locally. |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Used **once** by the seed script to create your first admin login. Change the password immediately after first login (there's no in-app "change password" screen yet — see §9 to add one, or re-run the seed script with a new password and it will need a manual `prisma studio` update since `upsert` won't overwrite an existing user's password). |

---

## 4. Set up the database

```bash
npm run db:up       # starts Postgres in Docker (first run pulls the image)
npm run db:push     # creates the tables from prisma/schema.prisma
npm run db:seed     # creates your admin user + sample profile/skills/projects
```

Postgres keeps running in the background (`npm run db:down` to stop it). Data
persists across restarts in a Docker volume, so you won't lose content
between `npm run dev` sessions.

`db:seed` prints your admin login to the terminal. Use it to sign in at
`/admin/login`.

---

## 5. Run locally

```bash
npm run dev
```

- Public site: http://localhost:3000
- Admin login: http://localhost:3000/admin/login

Browse to `/admin`, edit your profile, add real projects, and everything
updates on the public site immediately (no rebuild, no redeploy) — content is
read live from the database on every request.

---

## 6. Project structure

```
src/
  app/
    page.tsx                 → public homepage (reads everything from the DB)
    projects/[slug]/         → individual project pages (dynamic SEO metadata)
    sitemap.ts, robots.ts    → generated SEO files
    admin/
      login/                 → public admin login (outside auth wall)
      (dashboard)/           → everything behind middleware.ts auth
        page.tsx             → dashboard overview
        profile/, projects/, skills/, experience/, messages/, media/, settings/
    api/                     → REST-style API routes backing the admin UI
  components/
    site/                    → public-facing components (Hero, Nav, Skills, ...)
    admin/                   → admin UI primitives (Sidebar, Modal, forms, ...)
  lib/
    prisma.ts                → Prisma client singleton
    auth.ts                  → NextAuth config (credentials + bcrypt)
    require-admin.ts         → server-side auth guard used in every admin API route
    validation.ts            → Zod schemas — all writes are validated server-side
prisma/
  schema.prisma              → full data model
  seed.ts                    → creates admin user + starter content
```

---

## 7. Postgres everywhere (local Docker + production RDS)

There's a single `prisma/schema.prisma` with `provider = "postgresql"` —
used both locally and in production. No schema drift, no files to keep in
sync by hand.

- **Local**: `docker-compose.yml` runs Postgres 16 in a container
  (`npm run db:up`). Data persists in a Docker volume between restarts.
- **Production**: point `DATABASE_URL` at your AWS RDS Postgres instance —
  everything else (schema, migrations, seed script) is identical.

Moving to a new machine or deploying to prod is just: set `DATABASE_URL`,
run `npm run db:push`, run `npm run db:seed` once.

For the full AWS EC2 + RDS deployment walkthrough, see **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

If you're using Supabase specifically, you can also swap `NextAuth`'s
Credentials provider for **Supabase Auth** if you'd rather manage admin users
through Supabase's dashboard instead of the seed script — this project uses
its own bcrypt + JWT setup by default so it works with *any* Postgres
provider, not only Supabase.

---

## 8. Cloud file storage (recommended for production)

By default, uploaded images are written to `/public/uploads` on the server's
disk (see `src/app/api/upload/route.ts`). This works out of the box and for
a single always-on server, but is **not durable** on serverless hosts whose
filesystem resets on every deploy (Vercel, etc.).

To swap in Supabase Storage or S3, you only need to change one file:
`src/app/api/upload/route.ts`. Replace the `writeFile` call with an upload to
your bucket, and return the resulting public URL — every other part of the
app (projects, profile, media library) just stores and displays a URL, so
nothing else needs to change.

Example shape for Supabase Storage:

```ts
import { createClient } from "@supabase/supabase-js";
const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

const { data, error } = await supabase.storage
  .from(process.env.SUPABASE_STORAGE_BUCKET!)
  .upload(filename, optimizedBuffer, { contentType: "image/webp" });

const url = supabase.storage.from(bucket).getPublicUrl(filename).data.publicUrl;
```

---

## 9. Security notes

- Passwords are hashed with bcrypt (12 rounds) — never stored in plain text.
- `/admin/*` (except `/admin/login`) is protected server-side by
  `middleware.ts`, which verifies a signed NextAuth JWT on every request —
  not just a client-side redirect.
- Every admin API route additionally calls `requireAdmin()` itself, so
  directly hitting an API endpoint without a valid session also fails.
- All admin write endpoints validate input with Zod (`src/lib/validation.ts`)
  before touching the database.
- The contact form has a honeypot field and basic IP-based rate limiting
  (5 submissions / 10 minutes) to cut down on spam and abuse.
- Uploads are re-encoded (via `sharp`) and restricted to JPG/PNG/WEBP under
  8MB — this strips embedded scripts/metadata and prevents arbitrary file
  uploads.
- No secrets are ever sent to the browser — `DATABASE_URL`, `NEXTAUTH_SECRET`,
  and any storage credentials only exist in server-side code / env vars.

**Rate limiting in production:** the contact form's rate limiter is in-memory,
which is fine for a single server but resets per-instance on serverless
platforms with multiple concurrent instances. For stricter protection at
scale, swap it for a shared store like Upstash Redis.

**Adding a "change password" screen:** there isn't one yet. The fastest way
to rotate the admin password today is to run `npx prisma studio`, open the
`User` table, and replace `passwordHash` with a new bcrypt hash (you can
generate one with `node -e "console.log(require('bcryptjs').hashSync('new-password', 12))"`).

---

## 10. Deploying

Any Node.js host that supports Next.js works (Vercel, Railway, Render, a VPS
with `next start`, etc.). Typical flow for Vercel:

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Set the environment variables from `.env` in the Vercel project settings
   (use your production Postgres `DATABASE_URL`, a fresh `NEXTAUTH_SECRET`,
   and your real `NEXTAUTH_URL`).
4. Deploy. Then run `npx prisma migrate deploy` and `npm run db:seed` once
   (locally, pointed at the production `DATABASE_URL`, or via a one-off
   Vercel deployment hook) to initialize the database.
5. If you haven't swapped to cloud storage yet (§8), do that before relying
   on image uploads in production.

---

## 11. Customizing the design

The design system lives in two places:

- `tailwind.config.ts` — color tokens (`ink`, `mist`, `signal`), fonts, and
  animation keyframes.
- `src/app/globals.css` — glassmorphism (`.glass`), grain overlay, and glow
  utilities.

The accent color is also exposed as a normal field in `/admin/settings`, but
changing it there only updates the stored value for your own reference —
wiring it into the live theme would mean reading `SiteSettings.accentColor`
in `layout.tsx` and setting it as a CSS variable, which is a good next step
if you want the accent to be fully admin-controlled at runtime.
