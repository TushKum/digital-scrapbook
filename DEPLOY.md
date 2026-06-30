# Deploying NEERVANA

NEERVANA deploys as **one full-stack service**: a Node/Express process that
serves the built React SPA (`dist/`) and the `/api` routes from the same origin,
backed by a managed PostgreSQL database. No CORS, no second deploy, one URL.

The repo ships a [`render.yaml`](render.yaml) Blueprint for **Render**, which is
the fastest path. A manual recipe (works on Railway, Fly, a VPS, etc.) follows.

---

## Option A — Render (Blueprint, recommended)

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

## Option B — Any Node host (manual)

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
