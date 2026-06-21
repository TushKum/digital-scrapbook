# NEERVANA | Integrated Epidemiological Surveillance System

A production-ready, **light-mode GovTech** command dashboard for public-health &
water-quality surveillance across **Patiala District (Punjab)**. The 3D GIS map
is the main viewport; official data panels frame it like a State/Smart-City
command portal.

Built with **React 19 · Vite · TypeScript · Tailwind CSS · Three.js (React
Three Fiber + Drei) · lucide-react**.

## Run it

```bash
npm install      # already installed in this workspace
npm run dev      # http://localhost:5173
npm run build    # type-check (tsc -b) + production bundle → dist/
npm run preview  # serve the production build
```

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
src/
  data/blocks.ts          6 Patiala blocks × 3 reporting windows (IDSP, WQI, stock)
  lib/metrics.ts          status classification, colours, KPI aggregation
  lib/i18n.ts             EN/PA dictionary + official dispatches
  components/
    Scene.tsx             daylight <Canvas> + sun + OrbitControls
    three/MapTerrain.tsx      clay plinth, survey grid, canal
    three/BlockMarker.tsx     plate + proportional pin + hover tooltip
    ui/TopUtilityBar.tsx · Header.tsx · Ticker.tsx
    ui/SurveillancePanel.tsx · ResourcePanel.tsx · TimeFilter.tsx · MapLegend.tsx
  App.tsx                 state, accessibility wiring, overlay layout
```

Palette: white `#FFFFFF`, off-white panels `#F8F9FA`, official navy `#003366`,
saffron `#FF9933`, India green `#138808`, critical red `#DC2626`.

All data is synthetic and materialised at module load, so the dashboard is
fully populated on first paint.
