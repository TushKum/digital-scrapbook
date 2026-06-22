# NEERVANA | Integrated Epidemiological Surveillance System

A production-ready, **light-mode GovTech** command dashboard for public-health &
water-quality surveillance across **Patiala District (Punjab)**. The 3D GIS map
is the main viewport; official data panels frame it like a State/Smart-City
command portal.

Built with **React 19 · Vite · TypeScript · Tailwind CSS · Three.js (React
Three Fiber + Drei) · lucide-react**.

## Run it

First-time setup (needs Docker for Postgres):

```bash
npm install
cp .env.example .env          # defaults match docker-compose
npm run setup                 # db up + migrate deploy + generate + seed
```

Then day-to-day:

```bash
npm run dev      # web (Vite :5173) + API (Express :8787) together
npm run build    # type-check (tsc -b) + production frontend bundle → dist/
npm test         # backend domain + schema unit tests
```

Helper scripts: `dev:web` (frontend only) · `server` / `start:server` (API) ·
`typecheck:server` · `db:up` / `db:down` · `db:migrate` · `db:seed` ·
`db:reset` · `db:generate`.

## Backend

A layered **Express + TypeScript** service (`server/src/`) backed by
**PostgreSQL via Prisma 7** (driver-adapter `@prisma/adapter-pg`). Requests flow
`routes → controllers → services → repositories → Prisma`, with pure domain
logic (`domain/`) for status/aggregation/serialization. Cross-cutting concerns:
zod validation, centralized error handling, structured logging (pino), env
config, health/readiness probes and graceful shutdown.

In dev, Vite proxies `/api/*` to the API (port `8787`, override `API_PORT`), so
the client uses same-origin requests with no CORS. For a split deploy, build the
frontend with `VITE_API_URL=https://<api-host>`.

| Method  | Route                          | Description                                  |
| ------- | ------------------------------ | -------------------------------------------- |
| GET     | `/api/health`                  | Liveness                                     |
| GET     | `/api/ready`                   | Readiness (DB reachable)                     |
| GET     | `/api/blocks`                  | All blocks (snapshots + stock)               |
| GET     | `/api/blocks/:id`              | One block (404 if unknown)                   |
| GET     | `/api/aggregate?window=epi22`  | District KPI aggregate for a window          |
| GET     | `/api/dispatches?lang=EN`      | Official ticker dispatches                   |
| POST    | `/api/blocks/:id/reports`      | Submit an IDSP report (increments counters)  |
| PATCH   | `/api/blocks/:id/stock`        | Update a PHC's stock levels                  |
| POST    | `/api/dispatches`              | Add an official dispatch                     |

Models live in [prisma/schema.prisma](prisma/schema.prisma) (`Block`,
`Snapshot`, `Stock`, `Dispatch`); the seed is in
[server/src/db/seed.ts](server/src/db/seed.ts). The frontend fetches
`/api/blocks` + `/api/dispatches` on load via
[`useBootstrap`](src/hooks/useBootstrap.ts), showing a branded loading/error
gate ([BootStatus](src/components/ui/BootStatus.tsx)) until the data arrives.

## Features

- **Official top navigation** — government identity strip, state-emblem
  placeholder + portal title, and a live clock with the *District Nodal Officer*
  login.
- **Statutory accessibility controls** — text-size `A- A A+` (scales the rem
  base), a **High Contrast** mode, and a real **EN / PA** (English / Punjabi-
  Gurmukhi) language toggle covering the entire UI chrome.
- **Public notification ticker** — a scrolling marquee of official dispatches
  (boil-water advisories, stock replenishments, RRT deployments…), bilingual.
- **3D GIS map (clay-model)** — a bright-daylight architectural terrain with a
  topographic survey grid, a canal branch, and six proportional block markers
  whose pin height ∝ active caseload and colour = official status (green / saffron
  / red). Smooth OrbitControls (pan/rotate/zoom); hover pops a crisp white metric
  tooltip; click pins a block (cross-highlighted in the panels).
- **Left panel — Surveillance Metrics** — IDSP **S-Form** & **P-Form** ledger
  with thin borders, alternating rows, status chips and a district-total footer.
- **Right panel — Resource Allocation** — PHC-wise **ORS / Zinc / Antibiotic**
  stockpile gauges with a district summary and a stock-status legend.
- **Reporting-window filter** — a segmented control:
  `Last 24 Hours · Last 7 Days · Epi-Week 22`, which re-drives the 3D map and
  both panels.

## Architecture

```
prisma/
  schema.prisma           Block / Snapshot / Stock / Dispatch models + migrations
server/src/
  index.ts                bootstrap: listen + graceful shutdown
  app.ts                  Express app factory (cors, json, router, errors)
  config.ts · logger.ts   env config · pino logger
  routes/                 /api routers
  controllers/            thin HTTP handlers
  services/               business logic (block, dispatch)
  repositories/           Prisma data access
  domain/                 pure logic: status · aggregate · serialize · seedData
  db/                     prisma client (pg adapter) + seed
  schemas/                zod request validation
  middleware/             validate · asyncHandler · errorHandler · notFound · logger
server/tests/             node:test domain + schema tests
src/
  data/blocks.ts          shared client types + map constants
  lib/api.ts              typed API client (fetch + VITE_API_URL)
  lib/metrics.ts          status classification, colours, KPI aggregation
  lib/i18n.ts             EN/PA chrome dictionary
  hooks/useBootstrap.ts   loads dataset from the API (loading/error/retry)
  components/
    Scene.tsx             daylight <Canvas> + sun + OrbitControls
    three/MapTerrain.tsx      clay plinth, survey grid, canal
    three/BlockMarker.tsx     plate + proportional pin + hover tooltip
    ui/TopUtilityBar.tsx · Header.tsx · Ticker.tsx · BootStatus.tsx
    ui/SurveillancePanel.tsx · ResourcePanel.tsx · TimeFilter.tsx · MapLegend.tsx
  App.tsx                 state, data loading, accessibility, overlay layout
```

> **Deployment note:** GitHub Pages is static-only — it can host the frontend but
> not the API or Postgres. Host the API on a Node platform (Render, Railway,
> Fly.io, a VM…) with a managed Postgres (set `DATABASE_URL`), run
> `prisma migrate deploy && npm run db:seed`, then build the frontend with
> `VITE_API_URL=https://<api-host>`. For a single origin, serve `dist/` from the
> same Node server or put both behind one reverse proxy.

Palette: white `#FFFFFF`, off-white panels `#F8F9FA`, official navy `#003366`,
saffron `#FF9933`, India green `#138808`, critical red `#DC2626`.

The seed dataset is synthetic but realistic; it lives in Postgres and is served
to the frontend over the REST API.
