# NEERVANA — What You'll Experience

*A user's-eye walkthrough of the Integrated Epidemiological Surveillance System for Patiala District.*

> NEERVANA is a light-mode, "GovTech" command portal. The 3D district map is the
> centrepiece; official data panels frame it like a State / Smart-City command
> centre. Everything below is what a **District Nodal Officer** actually sees and
> does, step by step.

---

## 1. Opening the site → the Login screen

The moment the page loads, you're met with a clean **Officer Login** card on a soft
navy-tinted background:

- A shield emblem + **"INTEGRATED EPIDEMIOLOGICAL SURVEILLANCE SYSTEM"** eyebrow and a bold **Officer Login** heading.
- Two fields — **Username** (officer ID) and **Password** — each with an icon and a clear placeholder.
- A navy **Sign In** button.
- A demo-access hint so you can get in immediately:
  > **Officer ID:** `nodal.officer` · **Password:** `neervana@2026`

**What happens when you sign in:**

| You do… | You see… |
| --- | --- |
| Enter **wrong** credentials | A red inline message: *"Invalid officer ID or password."* |
| Leave a field **blank** | A validation message asking for both fields |
| Press Sign In | The button shows a spinner + *"Signing in…"* while it authenticates |
| Enter **correct** credentials | You're signed in and the full dashboard loads |

Behind the scenes this is **real authentication** — your password is checked
(bcrypt-hashed) against the database and you receive a secure session token. If you
refresh the page, **you stay signed in** (the session is restored automatically).

---

## 2. The command dashboard

Once authenticated, the screen fills edge-to-edge with the live command centre.
While the data is being fetched you briefly see a *"Connecting to Surveillance
Gateway…"* card; then everything populates.

### Top of screen (always visible)

1. **Government utility strip** (thin navy bar)
   - Left: *"Government of Punjab · Department of Health & Family Welfare"*
   - Right: **accessibility controls** (see §6)
2. **Masthead** — the **NEERVANA** title + *"Integrated Epidemiological Surveillance
   System"*, a live IST clock with "last synced" date, a badge showing
   **"Signed in as · District Nodal Officer"**, and a **Sign Out** button.
3. **Official Dispatches ticker** — a saffron scrolling marquee of live bulletins
   (boil-water advisories, ORS replenishments, Rapid Response Team deployments…).
   Hover it and the scrolling **pauses** so you can read.

### The centre — 3D GIS map

A bright-daylight, "clay-model" 3D terrain of the district with a survey grid and a
canal branch. Six block markers sit on it (Sanaur, Samana, Patran, Rajpura, Nabha,
Ghanaur), each a **pin whose height grows with the active caseload** and whose colour
shows status:

- 🟢 **Green** = Safe   🟠 **Saffron** = Advisory   🔴 **Red** = Critical

**You can:**
- **Drag** to rotate, **scroll** to zoom, **right-drag** to pan the map.
- **Hover a marker** → a crisp white tooltip pops up with the block's **Active Cases**,
  **Water Quality Index**, **Turbidity** and **health facility**.
- **Click a marker** → it's "pinned" and highlighted, and the matching row lights up in
  the side panels (and vice-versa — clicking a panel row highlights the map).

A small floating **Map Legend + compass** sits at the top-centre showing how many
blocks are Critical / Advisory / Safe right now.

### Left panel — Surveillance Metrics

An official **IDSP ledger** table: one row per block with **S-Form** and **P-Form**
counts, **Cases**, **WQI** (colour-coded), and a **Status** chip — thin borders,
alternating rows, and a navy **District Total** footer. Rows are clickable and
cross-highlight with the map.

### Right panel — Resource Allocation

**PHC-wise essential-medicine stockpile** gauges. A district summary up top
(ORS / Zinc / Antibiotics %), then a card per health facility with three colour-coded
bars (green ≥70%, saffron 40–69%, red <40%).

### Bottom — Reporting Window

A segmented control: **Last 24 Hours · Last 7 Days · Epi-Week 22**. Switching it
**re-drives the entire dashboard** — the map pins grow/shrink and recolour, and both
panels and the legend update to that window's numbers.

---

## 3. Everything is live from a real backend

Nothing on screen is hard-coded in the browser. On load, the dashboard fetches the
district dataset and the dispatch feed from a **PostgreSQL-backed REST API**. If the
backend is unreachable you get a friendly *"Surveillance API Unreachable"* card with a
**Retry** button rather than a blank screen.

Authorised actions (submitting IDSP reports, updating stock) require your login token,
so the data can't be modified by anyone who isn't signed in.

---

## 4. Accessibility & language (statutory controls)

From the top utility strip you can, at any time:

- **Text size** — `A-` / `A` / `A+` rescales the whole interface.
- **High Contrast** — boosts borders and text contrast for low-vision use.
- **Language — EN / PA** — instantly switches the **entire interface between English
  and Punjabi (Gurmukhi)**: masthead, ledger, block names, statuses, the dispatch
  ticker, filters, legend and the login screen.

---

## 5. Signing out

Click **Sign Out** in the masthead and you're returned to the Login screen; your
session token is cleared, so a refresh won't let you back in without signing in again.

---

## 6. Coming next — ESP32 sensor upload (in progress)

A feature currently being wired up: an officer will be able to **upload a CSV exported
from an ESP32 water-sensor node** (turbidity, TDS, pH, temperature). A **machine-
learning service** (Python + scikit-learn) then predicts, for each reading:

- the **water-quality status** (Safe / Advisory / Critical), and
- a **Water Quality Index (0–100)**, with a confidence score,

and shows a results panel with a per-row breakdown and an overall summary. *(This is
read-only — it analyses your upload without altering the live dashboard data.)*

---

### Quick reference

| Thing | Where |
| --- | --- |
| **Demo login** | `nodal.officer` / `neervana@2026` |
| Rotate / zoom / pan map | Drag / scroll / right-drag in the centre |
| Block details | Hover (tooltip) or click (pin) a marker |
| Change time window | Bottom segmented control |
| Bigger text / contrast / language | Top utility strip |
| Sign out | Masthead, top-right |
