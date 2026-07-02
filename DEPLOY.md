# Deploying NEERVANA

NEERVANA can deploy two ways, both single-origin (SPA and `/api` on one domain,
no CORS):

- **Vercel (serverless)** — the Vite SPA on Vercel's CDN + the Express app as one
  serverless function, backed by a **Neon** Postgres. See **Option A** below.
- **Render / any Node host (long-running)** — one Node/Express process serves
  `dist/` + `/api`, backed by a managed Postgres. The repo ships a
  [`render.yaml`](render.yaml) Blueprint. See **Option B / C**.

---

## Option A — Vercel (serverless + Neon Postgres)

Vercel can't run a long-lived server or host Postgres, so the app is adapted:
the SPA is served by Vercel's CDN and the Express app runs as a single function
([`api/index.ts`](api/index.ts), configured by [`vercel.json`](vercel.json)),
with an external **Neon** Postgres. Migrations run from your machine, never on
Vercel.

**1. Create the database on [Neon](https://neon.tech).** Copy TWO connection
strings from the project's Connection Details (both end with `?sslmode=require`):
- **Pooled** — host contains `-pooler` (PgBouncer). This is `DATABASE_URL` (app runtime).
- **Direct** — same host *without* `-pooler`. This is `DIRECT_URL` (migrations only).

**2. Migrate + seed from your machine** (once, before the first deploy — never on
Vercel):
```bash
npm ci
DIRECT_URL='<Neon DIRECT url>' npm run db:deploy          # prisma migrate deploy
DATABASE_URL='<Neon DIRECT url>' SEED_OFFICER_PASSWORD='<strong>' npm run db:seed
```

**3. Import the repo on Vercel** → *Add New… → Project*. Framework preset **Vite**
is auto-detected; leave Build/Output as-is (`vercel.json` sets
`buildCommand: prisma generate && vite build`, `outputDirectory: dist`). Keep the
**Root Directory** at the repo root (where `vercel.json` and `api/` live).

**4. Set Environment Variables** (Project → Settings → Environment Variables, for
**Production _and_ Preview**):
- `DATABASE_URL` = the Neon **pooled** (`-pooler`) string
- `JWT_SECRET` = a strong random value (`openssl rand -hex 32`)
- optional: `JWT_EXPIRES_IN=8h`, `CORS_ORIGIN=*`, `LOG_LEVEL=info`
- **Do NOT set** `SERVE_WEB`, `PORT`, `API_PORT`, `DIRECT_URL`, or `NODE_ENV` on
  Vercel — the function is API-only and Vercel manages `NODE_ENV`.

**5. Deploy**, then open the URL and log in as `nodal.officer` with the
`SEED_OFFICER_PASSWORD` you seeded. For later schema changes: re-run
`npm run db:deploy` against `DIRECT_URL` from your machine, then redeploy.

> **Post-deploy check (Prisma):** this uses Prisma 7's WASM query compiler,
> pinned into the function bundle via `vercel.json` `includeFiles`. After the
> first deploy, confirm a real query works (log in). If it 500s with a missing
> `query_compiler_fast_bg.postgresql*` module, check the Function logs — the
> `includeFiles` glob is what bundles that ~5 MB runtime asset.

---

## Option B — Render (Blueprint)

**Prerequisites:** a free [Render](https://render.com) account and this repo on
GitHub with the deploy changes on `main` (already pushed).

1. Render dashboard → **New +** → **Blueprint**.
2. Connect this GitHub repo and select it. Render reads `render.yaml` and shows
   a plan: one web service **`neervana`** + one Postgres **`neervana-db`**.
3. Before (or right after) the first deploy, set the one secret Render can't
   generate — the seeded operator's login password:
   - Service **neervana** → **Environment** → add `SEED_OFFICER_PASSWORD` =
     a password of your choice.
   - `DATABASE_URL` and `JWT_SECRET` are wired/generated automatically.
4. Click **Apply**. The build runs:
   `npm ci --include=dev → prisma generate → vite/tsc build → prisma migrate deploy → seed`,
   then starts with `npm run start:server`.
5. When it goes live, open the service URL. Log in with:
   - **Username:** `nodal.officer`
   - **Password:** whatever you set for `SEED_OFFICER_PASSWORD`
     (defaults to `neervana@2026` if you skip step 3).

Health check is `GET /api/health`. Subsequent pushes to `main` auto-deploy.

### Free-tier caveats
- The web service **cold-starts** after ~15 min idle (first request is slow).
- A **free Postgres** instance is deleted by Render after 30 days — upgrade the
  database to a paid plan for anything you want to keep.
- The build runs the **seed on every deploy**. It is idempotent (upserts), but
  it resets the `dispatches` table to the demo set. To seed only once, drop
  `&& npm run db:seed` from `buildCommand` in `render.yaml` and run it manually
  once from the Render **Shell** tab: `npm run db:seed`.

---

## Option C — Any Node host (manual)

Provision a PostgreSQL database, then run the service with these env vars set
(see [`.env.example`](.env.example)):

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | your Postgres connection string |
| `NODE_ENV` | `production` (enables serving `dist/`) |
| `JWT_SECRET` | a long random string |
| `SEED_OFFICER_PASSWORD` | the login password |
| `PORT` | injected by the host, or set explicitly |

Build and start:

```bash
npm ci --include=dev          # build tools are devDependencies
npm run db:generate           # prisma client
npm run build                 # tsc -b && vite build  -> dist/
npm run db:deploy             # apply migrations
npm run db:seed               # idempotent demo data (optional after first run)
npm run start:server          # serves dist/ + /api on $PORT
```

`SERVE_WEB=true` forces SPA serving even when `NODE_ENV` isn't `production`.

### Split frontend / backend (alternative)
If you'd rather host the SPA separately (e.g. a static host/CDN) from the API,
build the frontend with `VITE_API_URL=https://your-api-host` so the client calls
the remote API, and set `CORS_ORIGIN` on the API to the SPA's origin. For a
GitHub Pages **project** site, also build with `VITE_BASE=/<repo>/`.

---

## Not included in this deploy

The **ML service** (`ml/`, FastAPI + scikit-learn) is a separate Python service
and is still WIP — it is not part of this Node deploy. When ready it deploys as
its own service (e.g. a second Render web service with a Python runtime), and the
API/frontend point at it via its own env var.
