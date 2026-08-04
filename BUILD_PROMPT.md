# NEERVANA — Build Instructions & Master Prompt

This document lets you (or an AI coding agent) recreate the **NEERVANA** app from
scratch. It has three parts:

1. **The Master Prompt** — copy‑paste this into an AI agent (Claude Code, Cursor, etc.) to build the whole app.
2. **The Spec** — the detailed reference the prompt is distilled from (product, design system, data model, features).
3. **Setup & Deploy** — exact commands to run it locally and ship it to Vercel + Neon.

---

## PART 1 — THE MASTER PROMPT

> Paste everything in this block into your AI coding agent. It is self‑contained.

```
Build a production-quality GovTech web app called NEERVANA — an "Integrated
Epidemiological Surveillance System" for water-borne disease + water-quality
monitoring in Patiala district, Punjab, India. Bilingual English / Punjabi
(Gurmukhi). Everything must be honest, accessible, and demo-ready.

TECH STACK (use exactly this):
- Frontend: React 19 + TypeScript + Vite, TailwindCSS v3, lucide-react icons,
  react-three-fiber + @react-three/drei for a 3D GIS map, framer-motion.
- Backend: Node + Express 5 (layered: routes → controllers → services →
  repositories → domain; middleware for auth, zod validation, error handling,
  pino request logging). Prisma 7 (prisma-client generator + @prisma/adapter-pg
  + pg) on PostgreSQL. Auth = JWT (jsonwebtoken) + bcryptjs. Validation = zod.
- One repo. In dev, Vite proxies /api to the Express server. In prod, the SPA is
  static and the Express app runs as ONE serverless function.

DESIGN SYSTEM (build this first, reuse everywhere — it must feel like one system):
- Palette (Tailwind theme.extend.colors): navy {DEFAULT #003366, dark #002347,
  light #0a4d8c, tint #e6eef5}; saffron {DEFAULT #FF9933, dark #e07e1d, tint
  #fff3e6}; india {green #138808, greenTint #e7f4e5}; critical {DEFAULT #DC2626,
  tint #fde8e8}; panel #F8F9FA; ink #1f2937; muted #6b7280. Font: Inter.
- Shared CSS component classes: `.gov-panel` (white card, subtle border+shadow),
  `.gov-eyebrow` (10px uppercase tracking muted label), `.gov-eyebrow-lg` (large
  variant), `.gov-focus` (2px navy focus-visible outline), `.gov-scroll` (thin
  official scrollbar). Box shadows: panel + float.
- Accessibility chrome on EVERY page: a top utility bar with A-/A/A+ text-size
  (scales html font-size 14/16/18px), a High-Contrast toggle (sets
  `data-contrast="true"` on <html>, with CSS overrides that darken borders and
  text), and an EN/PA language switch. All buttons use aria-pressed.
- STATUS SYSTEM (critical): three states safe / warning / critical with colors
  india-green / saffron / red. RULE: safe(green) and critical(red) have nearly
  identical luminance, so status must NEVER be encoded by color alone. Every
  status shows a DISTINCT ICON SHAPE (ShieldCheck / AlertTriangle / OctagonAlert)
  + a text LABEL. For advisory *text*, use saffron-dark #e07e1d (raw saffron
  fails WCAG AA on white). Status chips = tint background + dot + shape-icon + word.
- Charts are hand-rolled Tailwind/SVG (no chart library): thin bars with 4px
  rounded ends anchored to the baseline; single-hue navy for magnitude; 2px lines
  with recessive dashed threshold guides; direct value labels; per-mark titles.

DATA MODEL (Prisma, PostgreSQL):
- Block: id, name, namePa, phc, population, map position/area, sortOrder.
- Snapshot (per Block per reporting window '24h'|'7d'|'epi22'): activeCases,
  newCases, recovered, sForms (IDSP S-form), pForms (IDSP P-form), wqi (Water
  Quality Index 0–100, higher=cleaner), turbidity (NTU).
- Stock (per Block per window): ors, zinc, antibiotics (each % of buffer stock).
- User: username, passwordHash, displayName, role, lastLoginAt (auth).
- Dispatch: bilingual official notification messages.
Seed ~6 Patiala blocks with plausible values, a nodal.officer user, and dispatches.
Status logic: wqiStatus (≥70 safe, ≥45 warning, else critical); caseStatus
(≥120 critical, ≥50 warning, else safe); block status = worse of the two.
Stock status (≥70 safe, ≥40 warning, else critical).

API (Express, mounted at /api):
- GET /health, GET /ready (DB ping). GET /blocks and GET /dispatches are PUBLIC.
- POST /auth/login (returns JWT + user), GET /auth/me (auth required).
- POST /blocks/:id/reports and PATCH /blocks/:id/stock require a Bearer token.
- Centralised config with fail-loud required env vars in production; CORS; JSON
  404; error handler returning {error, message}.

FOUR SURFACES (SPA routes; plain <a href> navigation; deep links work):
1. "/" Command Centre (AUTH REQUIRED): full-bleed 3D GIS map of the blocks with
   status-colored markers; left panel = IDSP S/P form ledger table with status
   chips + district totals; right panel = PHC medicine-stock gauges; floating map
   legend; bottom reporting-window filter (24h / 7d / Epi-Week 22); a scrolling
   dispatches ticker; the top utility bar + a masthead header with sign-out.
2. "/asha" ASHA Field Dashboard (AUTH REQUIRED): scrollable 2D dashboard —
   metric tiles (active cases, new, recovered, avg WQI, medicine stock, S/P
   forms); a Block Status table; "Active Cases by Block" horizontal bars; a
   "Water Quality Trend" line across the 3 windows with dashed 70/45 guides; PHC
   medicine-stock meters; and a dispatches list. Reuses the reporting-window filter.
3. "/advisory" Villager Advisory (PUBLIC, low-literacy, bilingual): a big
   language switch (English / ਪੰਜਾਬੀ); a village picker (big tappable list, each
   showing its status shape-icon); then a BIG status card for the chosen village —
   giant shape-icon + big plain-language headline ("Water is safe" / "Take care" /
   "Do not drink tap water") + one-sentence guidance, plus a 3-step
   safe→advisory→critical position indicator (status shown by shape+position+color+
   word, never color alone). Below: status-prioritised guidance cards (boil water,
   use ORS, visit health centre, wash hands) and the village's PHC + "ask your ASHA
   worker" help. Uses the freshest ('24h') window.
4. "/verticals/milk-screening" Milk Adulteration Screening (PUBLIC): a product
   vertical page — hero (framed as SCREENING, not lab diagnosis), the problem,
   how it works (ESP32 device + sensing + traceability), a Patiala market section
   where EVERY figure carries a badge tagged "Verified" (published data) or
   "Estimate" (to confirm), TAM/SAM/SOM cards, a scale ladder, business model,
   impact KPIs (placeholder "pilot pending" values), and a roadmap.

DATA-INTEGRITY RULES (everywhere): never fabricate a statistic; visually
distinguish sourced facts from estimates; use placeholders, not invented numbers;
never overclaim (say "screening / early warning", not "diagnosis"). KPI values are
placeholders until real pilot data exists.

QUALITY BAR: fully responsive (mobile → desktop); WCAG AA contrast; works with the
high-contrast mode; every interactive element keyboard-focusable with gov-focus;
decorative SVGs aria-hidden; the strict build (`tsc -b && vite build`) and eslint
must pass. Verify the result in a real browser at 320/375/768/1280px and with the
high-contrast toggle before calling it done.
```

---

## PART 2 — THE SPEC (reference detail)

### Product
NEERVANA is a district-scale public-health command system. The officer sees a 3D
GIS command centre; ASHA field workers get a focused data dashboard; villagers get
a dead-simple bilingual advisory; and a product-vertical page pitches a connected
"Milk Adulteration Screening" device for dairy cooperatives. One design system,
one backend, four audiences.

### Repository shape
```
prisma/schema.prisma          # Block, Snapshot, Stock, User, Dispatch
prisma.config.ts              # datasource url = DIRECT_URL ?? DATABASE_URL (CLI)
server/src/
  index.ts                    # app.listen bootstrap (Render/local)
  vercel-entry.ts             # exports the Express app (bundled for Vercel)
  app.ts                      # createApp(): middleware + /api router (+ optional static)
  config.ts                   # validated env (fail-loud in prod / on Vercel)
  routes/ controllers/ services/ repositories/ domain/ middleware/ schemas/ db/
  generated/prisma/           # gitignored — `prisma generate` output
src/
  main.tsx App.tsx            # App owns lang/contrast/text-scale + routing
  components/
    Scene.tsx three/          # react-three-fiber 3D GIS map
    ui/                       # Header, TopUtilityBar, LoginPage, Ticker,
                              # SurveillancePanel, ResourcePanel, MapLegend, ...
    dashboards/               # AshaDashboard, VillagerAdvisory, shared, marks
    verticals/                # MilkScreeningPage
  hooks/ (useAuth, useBootstrap, usePublicChrome)
  lib/ (api, i18n, metrics, dashboardStrings, utils)
  data/ (blocks types, milkVertical content)
api/index.js                  # esbuild bundle of vercel-entry.ts (see deploy)
vercel.json                   # builds + routes
```

### Routing model
`App.tsx` reads `window.location.pathname` (trailing slash normalised). Public
routes (`/advisory`, `/verticals/milk-screening`) render before the auth gate;
`/asha` renders after auth using the shell's data + accessibility state; `/` is
the command centre. Navigation is full-page `<a href>` links; the SPA fallback
serves `index.html` for any path so deep links work.

### The status/color decision (why it matters)
Computed luminance-contrast: safe↔critical ≈ **1.05** (basically identical
lightness). So a green/red status is invisible to red-green color-blind users and
in grayscale. Mitigation used throughout: **distinct icon shape per status +
text label + (on the villager card) position** — color is never the only signal.
Advisory text uses `#e07e1d` because raw saffron `#FF9933` is only 2.13:1 on white.

---

## PART 3 — SETUP & DEPLOY

### Local development
```bash
npm install                     # postinstall runs `prisma generate`
docker compose up -d            # local Postgres (or point DATABASE_URL at Neon)
npm run db:deploy               # apply migrations
npm run db:seed                 # seed blocks / user / dispatches
npm run dev                     # web (Vite :5173) + API (Express :8787) together
# Login: nodal.officer / neervana@2026
```

### Deploy to Vercel + Neon (single-origin: SPA on the CDN + Express as one function)
1. **Neon**: create a project; copy the **pooled** URL (host has `-pooler`) →
   `DATABASE_URL`, and the **direct** URL (no `-pooler`) → `DIRECT_URL`.
2. **Migrate + seed** from your machine against the DIRECT url (never on Vercel):
   ```bash
   DIRECT_URL='<neon direct>' npm run db:deploy
   DATABASE_URL='<neon direct>' SEED_OFFICER_PASSWORD='<pick>' npm run db:seed
   ```
3. **The serverless function**: the Express graph is ESM TypeScript that Vercel's
   Node builder won't bundle reliably, so it is **pre-bundled** with esbuild into a
   single self-contained CommonJS file:
   ```bash
   npm run build:api            # esbuild server/src/vercel-entry.ts -> api/index.js
   ```
   `api/index.js` is committed and served via `@vercel/node`. Rebuild it whenever
   you change server code. (`api/package.json` = `{"type":"commonjs"}` so Node
   treats the CJS bundle correctly despite the repo being ESM.)
4. **vercel.json**: `@vercel/static-build` runs `vercel-build` (`prisma generate &&
   vite build` → `dist/`); `@vercel/node` serves `api/index.js`; routes send
   `/api(/.*)?` to the function, then filesystem, then everything else to
   `/index.html` (SPA fallback).
5. **Vercel env vars** (Production + Preview): `DATABASE_URL` = Neon **pooled**
   url; `JWT_SECRET` = `openssl rand -hex 32`. Do NOT set `DIRECT_URL`, `SERVE_WEB`,
   `PORT`, or `NODE_ENV` on Vercel.
6. **Deploy**: push to the production branch → Vercel builds. Env-var changes
   need a redeploy. If the production domain is frozen by an Instant Rollback,
   cancel the rollback, then Promote the newest deployment.

### Deploy caveat learned the hard way
Generating `api/index.js` during the Vercel build (gitignored) is unreliable on
this project — the Node builder may not pick up a build-generated function and
`/api/*` then falls through to the SPA (health returns HTML, login 405). Keep the
bundle **committed**; rebuild with `npm run build:api` after server changes.
