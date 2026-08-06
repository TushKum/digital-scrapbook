# NEERVANA — Session Handoff / Continuation Prompt

Paste this into a fresh session to restore full context. It captures what exists,
where it lives, what's deployed, and the traps to avoid. Everything below is
current as of the last session.

---

## 0. What NEERVANA is + who I'm helping
NEERVANA = an **Integrated Epidemiological Surveillance System** for **Patiala
district, Punjab** — village-level **water-quality + water-borne-disease
early-warning**, bilingual **English / Punjabi (Gurmukhi)**. The user
(`tushit`) is a student founder about to **pitch it to the Community Welfare
Head and the SHO (police station chief) of Patiala**. Treat me (assistant) as an
expert **investment-banker + philanthropist** advisor when asked for strategy.

**Reality check (from the user's own action plan):** the core thesis — that
water-contamination signal *predicts* disease — is **NOT yet validated**. The
plan says: prove it on **free published data first** (IDSP/IHIP + WQMIS + IMD +
RTIs), **don't over-build the app**, the model is the product. All in-app data is
a **seeded demo dataset** (labelled as such via a DataProvenance note).

## 1. The three projects on disk
| Path | What | State |
|---|---|---|
| **`/Users/tushitkumar/digital-scrapbook`** | The real NEERVANA **web app + backend**. THE main project. | Deployed on Vercel, working |
| **`/Users/tushitkumar/neervana-fresh`** | A clean-room **frontend reproduction** built from BUILD_PROMPT.md (Vite, mock data, no backend). | Local only, runs with `npm run dev` |
| **`/Users/tushitkumar/neervana-expo`** | **Expo (React Native) mobile app** — a WebView wrapper around the deployed web app. | Builds; APK produced via EAS |

## 2. digital-scrapbook — the web app
- **Git branch: `feat/postgres-prisma-backend`** (mirrored to `main`; **Vercel's
  production branch is `feat/postgres-prisma-backend`**). Always push BOTH.
- **HEAD: `3071f1d`**. Recent: docs → PWA → credibility-fixes → glass-login →
  (revert api bundle) → build-from-source(reverted) → ASHA+villager dashboards.
- **Tech:** React 19 + Vite 8 (rolldown) + Tailwind 3.4 + TS 6, react-three-fiber
  (3D map), lucide-react. Backend: Express 5 + Prisma 7 (`prisma-client`
  generator + `@prisma/adapter-pg` + `pg`) + Neon Postgres, JWT + bcryptjs, zod,
  pino. Layered (routes→controllers→services→repositories→domain + middleware).
  `@` alias → `./src`.
- **Routes (pathname-based in `src/App.tsx`):**
  - `/` Command Centre — 3D GIS map + IDSP ledger + PHC stock (AUTH)
  - `/asha` ASHA Field Dashboard (AUTH)
  - `/advisory` Villager Advisory — public, low-literacy, bilingual
  - `/verticals/milk-screening` Milk Adulteration Screening — public
  - `/glass-login` WebGL "liquid glass" login demo — public
  - anything else → real **404** (NotFound + vercel.json 404 status)
- **Demo login:** `nodal.officer` / `neervana@2026`.
- **Design system (reuse exactly):** navy `#003366` (dark `#002347`, light
  `#0a4d8c`, tint `#e6eef5`), saffron `#FF9933` (dark `#e07e1d`, tint `#fff3e6`),
  india green `#138808` (tint `#e7f4e5`), critical `#DC2626`, panel `#F8F9FA`,
  ink `#1f2937`, muted `#6b7280`; Inter. Classes: `gov-panel`, `gov-eyebrow`,
  `gov-eyebrow-lg`, `gov-focus`, `gov-scroll`; high-contrast via `data-contrast`.
- **STATUS RULE (non-negotiable):** safe/warning/critical must use a **distinct
  icon shape + text label**, never colour alone — safe(green) and critical(red)
  are lightness-identical (contrast 1.05). Icons: ShieldCheck / AlertTriangle /
  OctagonAlert. Advisory *text* uses `#e07e1d` (raw saffron fails AA). Charts are
  hand-rolled Tailwind/SVG (no chart lib): single-hue navy magnitude bars, WQI
  line with dashed 45/70 guides.
- **Data:** 6 Patiala blocks, seeded; `GET /api/blocks` and `/api/dispatches` are
  **public** (power the dashboards without auth). `DataProvenance` note labels it
  "Demonstration data".
- **PWA:** installable — `public/manifest.webmanifest` (role shortcuts),
  `public/sw.js` (offline), navy droplet icons, `InstallPrompt`, SW registered in
  `main.tsx` (prod only).

## 3. Deployment (Vercel + Neon)
- **Live, working URL (main-branch alias):**
  `https://digital-scrapbook-git-main-tushkums-projects.vercel.app`
  — API + PWA + 404 + prerender all verified here.
- **Production domain `digital-scrapbook-lyart.vercel.app` is BROKEN** — pinned to
  an old **Instant Rollback** the user did days ago. Fix = user goes to Vercel →
  Deployments → cancel the rollback → **Promote** the latest deploy. Only they can
  click it. Until then, use the `-git-main-` alias.
- **Vercel env vars (Production + Preview):** `DATABASE_URL` (Neon **pooled**,
  `-pooler` host), `JWT_SECRET`. Do NOT set SERVE_WEB / PORT / DIRECT_URL / NODE_ENV.
- **Neon Postgres:** project created, migrated + seeded. Connection strings live
  in Vercel env + the Neon dashboard.
  ⚠️ **The Neon DB password was pasted in chat earlier → it is compromised.
  ROTATE it** (Neon → Roles → reset) and update `DATABASE_URL` in Vercel.

## 4. ⚠️ CRITICAL GOTCHAS — read before touching deploy
1. **`api/index.js` is a COMMITTED esbuild bundle** (~7 MB) of the Express app.
   After ANY change under `server/`, rebuild it: **`npm run build:api`** and
   commit. **Do NOT gitignore it / build it during the Vercel build** — that was
   tried and it breaks: `@vercel/node` doesn't pick up a build-generated function,
   so `/api/*` 404s. Keep it committed.
2. **`vercel.json` is the legacy `builds` + `routes` format** (@vercel/static-build
   + @vercel/node on `api/index.js`). Routes: `/api`→function, filesystem,
   known SPA routes→index.html, else→index.html **with status 404**.
3. **Push to BOTH `main` and `feat/postgres-prisma-backend`** (prod branch is feat).
4. `npm run build` (`tsc -b && vite build`) is strict — must pass; eslint too.
   The Vite `define` injects `__BUILD_TIME__`. A non-fatal `scripts/prerender.mjs`
   pre-renders the static public pages (milk, glass-login) — failure is swallowed.
5. **NEVER run npm/expo install for the Expo app while `cwd` is digital-scrapbook**
   — it once polluted digital-scrapbook's package.json with `expo`/react-downgrade.
   Always `cd /Users/tushitkumar/neervana-expo` first and verify.
6. **Stray files to delete** in digital-scrapbook root (cruft from that accident):
   untracked `app.json` and staged `eas.json` — they don't belong in the Vite app.

## 5. neervana-expo — the mobile app
- Expo **SDK 57** (react 19.2.3, react-native 0.86.2, react-native-webview 13.16.1,
  safe-area-context 5.7). `App.tsx` = full-screen WebView of the deployed URL
  (`APP_URL` const) + splash/loading + Android back-button + external-link
  handling + offline retry. Bundle id `in.neervana.app`.
- **EAS:** account `bdbzdb` / team **`bdbzdbs-team`**, project **`neervana`**,
  projectId **`a6261f4b-f0f6-4f5b-a66c-0593cea9fcf0`**. `.npmrc` has
  `legacy-peer-deps=true` (needed). Local git repo initialised.
- **Built APK (70 MB)**, direct download:
  `https://expo.dev/artifacts/eas/uKOeFdc4q-Dc42-5yu28si5p9wkylC2g49bD_SRTy68.apk`
- Run locally: `cd ~/neervana-expo && npx expo start`. Build APK:
  `eas build -p android --profile preview` (free-tier queue is slow, ~20+ min).
- Expo Go only runs the newest SDK — if it says "SDK 5x not available", bump the
  project (`npm install expo@latest && npx expo install --fix`, then clean
  reinstall if Metro `transformFile` errors appear).
- Local machine: **Java 11 only** (SDK 57 needs 17) + Android SDK present but
  `ANDROID_HOME` unset → **can't build APK locally**; use EAS cloud.

## 6. Distribution formats already produced
- **QR image / link** (best for pitch + villagers + iPhone): the URL above → open
  → Install app (Android) / Add to Home Screen (iPhone). No download.
- **APK** (Android only): the EAS artifact link above.

## 7. Docs written this session (in digital-scrapbook root)
- `BUILD_PROMPT.md` — master prompt + spec to rebuild the whole app.
- `MARKET_RESEARCH_BRIEF.md` — research scaffold (buyers, sizing in villages,
  competitors CSIR-CSIO/MeitY, data sources, all figures "verify").
- `DEPLOY.md` — Vercel/Neon + Render deploy steps.
- `HANDOFF.md` — this file.

## 8. Strategy notes (banker/philanthropist)
- **Pitch to SHO + Welfare Head:** lead with a **reconstruction of the Aug-2025
  Patiala outbreak (5 deaths)** as the hero, NOT the dashboard. Add a **District
  Risk Banner** (top) + **Recommended Response panel** (right) so the SHO sees the
  *action*; make ASHA tiles **people-first**. **Cut** glass-login + the milk
  vertical from this pitch (milk = dairy/Verka, different buyer). Buy **neervana.in**.
  Get a **native Punjabi speaker to proof the Gurmukhi**. Label demo data as demo.
- **Possible pivot (research):** Punjab's water crisis may be **chemical**
  (uranium/nitrate/fluoride) not microbial — arguably a bigger, cleaner market.

## 9. Govt-analyst gap review — status
Working through 7 gaps a government reviewer would raise (see chat).
- ✅ **#2 done in software:** `/integration` page (`src/components/IntegrationPage.tsx`)
  — "fusion layer, not a parallel system": IHIP/IDSP + WQMIS/FTK + IMD + CGWB →
  NEERVANA → existing PHC/DWSS response; source table with honest status badges
  (Pending MoU / Public data / Planned); reporting hierarchy; data-governance
  panel. Public route, prerendered, linked from LoginPage. **Uncommitted.**
- ✅ **Non-software gaps → `GOVERNMENT_READINESS.md`** (governance/DPDP + India
  residency, validation, sustainability/institutional home, ASHA incentive,
  procurement/GeM/DHAP, target alignment, field ops, positioning). **Uncommitted.**
- ⬜ **Remaining SOFTWARE backlog** (build next, in order):
  1. **Alert → Acknowledge → Assign → Act → Verify → Close** workflow w/ SLA +
     accountability chain (the #1 gap — makes it read as a real govt system).
  2. **Official report export** — weekly IDSP situation report / DHAP input as a
     letterheaded PDF.
  3. **Role-based access** by ANM→ASHA→MO→BMO→CS→State + audit log.
  4. **Case line-list / RRT module**; multi-year seasonal view.
  5. **Chemical hazard layer** (uranium/nitrate/fluoride) alongside microbial.

## 10. Pending (user actions / housekeeping)
- [ ] User: cancel the Vercel rollback + Promote → fixes the `-lyart` production domain.
- [ ] User: rotate the exposed Neon DB password + update Vercel env.
- [ ] Commit: integration page + GOVERNMENT_READINESS.md + BUILD_PROMPT/MARKET_RESEARCH/HANDOFF; delete stray `app.json`/`eas.json` in repo root.
- [ ] (Offered) Aug-2025 outbreak timeline hero screen for the pitch.
