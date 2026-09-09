# NEERVANA — Dataset provenance

This file states, unambiguously, **what data NEERVANA runs on and where it comes
from.** It exists so no one — teammate, judge, or government reviewer — mistakes
the demonstration data for measured data.

**One-line summary:** the dashboard currently runs on a **100% synthetic
demonstration dataset**. The only *real* data gathered so far (rainfall + one
outbreak's public facts) is **not yet wired into the app**. Everything else is a
**DATA GAP** requiring an RTI or a gated portal.

_Last updated: 2026-08-14._

---

## Tier map — what is real vs. what is not

| Data | In the app now? | Real / sourced? | Where it lives |
|---|---|---|---|
| 6-block surveillance table (cases, WQI, turbidity, stock) | ✅ yes — powers the dashboard | ❌ **synthetic** — authored, formula-generated | `server/src/domain/seedData.ts` → Postgres → `/api/blocks` |
| 12 ticker dispatches (EN + PA) | ✅ yes | ❌ authored | same |
| Simulated IoT sensor stream (pH/ORP/temp/level) | ❌ not wired in | ❌ **synthetic-simulated** (pipeline dev) | `data/neervana_sensor_simulated.csv` |
| Rainfall, Patiala, Apr–Sep 2025 (weekly) | ❌ not wired in | ✅ **real** | NASA POWER API (see below) |
| July 2025 Alipur Arian outbreak facts | ❌ not wired in | ✅ **real** | Tribune India (see below) |
| WQMIS turbidity / residual chlorine / FTK | ❌ | ⚠️ **DATA GAP** | RTI / JJM portal |
| IDSP block-wise weekly line-list | ❌ | ⚠️ **DATA GAP** | RTI, Civil Surgeon Patiala |
| CGWB chemical (nitrate/fluoride/uranium) | ❌ | ✅ real (context only) | CGWB / peer-reviewed |

> **Rule:** the app labels its data "Demonstration data" (DataProvenance note).
> Keep it that way. Never present the seed dataset as measured surveillance.

---

## 1. What the site runs on — the synthetic seed dataset

**Files (this export):**
- [`data/neervana_seed_blocks.csv`](data/neervana_seed_blocks.csv) — 18 rows (6 blocks × 3 time windows).
- [`data/neervana_seed_dispatches.csv`](data/neervana_seed_dispatches.csv) — 12 ticker messages (6 EN + 6 PA).
- Every row is tagged `provenance = synthetic-demo`.

**How it's generated (not measured):** [`server/src/domain/seedData.ts`](server/src/domain/seedData.ts)
authors one profile per block (`baseCases`, `wqi`, `turbidity`, `stock`), then
*derives* the three time windows by fixed formulas:
- `epi22.activeCases = baseCases`; `7d = ×0.6`; `24h = ×0.17`
- `newCases = ×0.42 / 0.28 / 0.09`; `recovered = ×1.55 / 0.92 / 0.20`
- `sForms`, `pForms` = formulas of `baseCases` + population
- `wqi` shifts `+0 / +4 / +7`; stock buffers `+0 / +9 / +17`

So the "trend over time" in the app is arithmetic on invented base numbers — it
carries **no real temporal signal**.

**Block base profiles (Epi-Week 22 values):**

| Block (PHC) | Population | WQI | Turbidity (NTU) | Active cases | ORS/Zinc/Antibiotic % |
|---|--:|--:|--:|--:|---|
| Sanaur (CHC Sanaur) | 38,420 | 38 | 14.2 | 142 | 32 / 28 / 41 |
| Samana (SDH Samana) | 51,230 | 47 | 9.8 | 96 | 48 / 52 / 60 |
| Patran (CHC Patran) | 33,760 | 51 | 8.1 | 71 | 54 / 49 / 62 |
| Rajpura (SDH Rajpura) | 88,210 | 58 | 6.4 | 64 | 66 / 71 / 58 |
| Nabha (Civil Hospital Nabha) | 67,800 | 72 | 3.1 | 38 | 82 / 78 / 74 |
| Ghanaur (PHC Ghanaur) | 28,900 | 78 | 2.4 | 22 | 88 / 84 / 90 |

### CSV column dictionary — `neervana_seed_blocks.csv`
| Column | Meaning |
|---|---|
| `provenance` | always `synthetic-demo` |
| `block_id`, `block_name_en`, `block_name_pa`, `phc` | block identity |
| `population` | authored block population |
| `time_window` | `24h` \| `7d` \| `epi22` (Epi-Week 22) |
| `active_cases`, `new_cases`, `recovered` | ADD / suspected water-borne case counts |
| `s_forms`, `p_forms` | IDSP S-form (sub-centre) / P-form (PHC) submissions |
| `wqi_0_100` | Water Quality Index (higher = cleaner) |
| `turbidity_ntu` | turbidity, NTU |
| `stock_ors_pct`, `stock_zinc_pct`, `stock_antibiotics_pct` | % of buffer stock |

---

## 2. Real data gathered (sourced, NOT yet in the app)

### Rainfall — Patiala, Apr–Sep 2025 (weekly, ISO)
Source: **NASA POWER** `PRECTOTCORR` daily, point 30.34 N / 76.39 E, retrieved
2026-08-14. Reproduce with the query in this repo's history.
- Onset week of the outbreak = ISO **W26 (Jun 23–29) = 101.6 mm**; ramp began W25 (45.7 mm) after a dry W24 (1.7 mm).
- **Only one day all season exceeded 50 mm** (Aug 25 = 55.1 mm) — *after* the July outbreak. A ">50 mm heavy-day" trigger would have **missed** the event.

### July 2025 outbreak — verified facts (Tribune India)
| Field | Value |
|---|---|
| Site / onset | Alipur Arian, Patiala city / **28 Jun 2025** |
| Cases | 107 (Jul 9) → **131** (Jul 11) |
| Deaths | **4** Alipur Arian + **1** Changera (near Banur) = **5 district-wide** |
| Proximate cause | sewage cross-connection (Alipur Arian); pipeline-install leak (Changera); 8→17 samples failed |

**Unresolved flags (do not "fix" without a source):**
- New Mohindra Colony was a **2022** event (2 children died) — *not* 2025; keep separate.
- Death count **5 vs 6** differs across reports → **reconcile via RTI**, not by guessing.

---

## 3. DATA GAPS — RTI / direct-portal required (to build anything real)
1. **IDSP PB/PAT/2025 weekly outbreak PDF** — retrieve from idsp.mohfw.gov.in directly.
2. **Block-wise weekly case line-list** — RTI, Civil Surgeon, Patiala.
3. **WQMIS station turbidity / residual chlorine / FTK, pre-onset** — JJM portal / RTI.
4. **DWSS source-level samples with collection dates** — RTI, DWSS Patiala.
5. **Patiala inhabited-village count** — LGD portal (lgdirectory.gov.in) directly.
6. **Death-count reconciliation (5 vs 6)** — RTI.

Until at least #1–#4 land across **2–3 outbreaks**, there is no dataset to train
or validate a predictive model on — only a transparent, rule-based index is
honest. See the conversation notes / `HANDOFF.md`.

---

## 4. Simulated hardware sensor stream (for pipeline development)

**File:** [`data/neervana_sensor_simulated.csv`](data/neervana_sensor_simulated.csv)
— 2,016 rows: **6 nodes × 336 hours** (hourly, 22 Jun–5 Jul 2025). Every row is
tagged `provenance = synthetic-simulated`.

> **This is a SIMULATOR, not measurements.** No NEERVANA hardware exists yet.
> These are physically-plausible values a deployed sensor node *would* emit, so
> the ingestion pipeline, alerting rules, and dashboard can be built and demoed
> before hardware arrives. **Never present these as real readings.**

**Sensor → column mapping (what each component measures):**
| Component | Column | Unit | Safe band (BIS/WHO drinking-water) |
|---|---|---|---|
| pH probe | `ph` | 0–14 | 6.5 – 8.5 |
| **ORP probe** | `orp_mv` | mV | **≥ 650 = disinfected**; 400–649 watch; < 400 critical |
| Temperature | `water_temp_c` | °C | informational (diurnal + seasonal) |
| **Ultrasonic** | `water_level_cm` | cm | tank/reservoir level (operational, not quality) |

**Why ORP is the point.** ORP measures oxidising (disinfection) capacity. A sewage
cross-connection — the actual cause of the July 2025 Alipur Arian deaths — **destroys
ORP** as organic load consumes the chlorine residual. Rainfall could *not* have flagged
that event (see §2); a source-side ORP probe **could**. That is the honest hardware value
proposition, and it is what this simulator demonstrates.

**Embedded scenario (honest demo, not a claim):** the `SNSR-SANAUR-01` node runs a
simulated contamination event — ORP collapses from ~600 mV to a floor of ~185 mV and
pH dips to ~6.3 — ramping up from Jun 27 06:00, i.e. **~24 h before the real Jun 28
onset**, then recovering after a simulated chlorination response by Jul 1. The other five
nodes stay in normal bands (baselines scaled to each block's WQI). ~1.5% of rows are
`sensor_health = dropout` (empty values) to mimic real hardware gaps.

**Reproduce:** deterministic, `random.seed(42)`; generator is in this repo's commit
history (search the session log). Node baselines are derived from the block WQI profiles
in §1, so the simulator is internally consistent with the demo dataset.

### CSV column dictionary — `neervana_sensor_simulated.csv`
| Column | Meaning |
|---|---|
| `timestamp_ist` | ISO hour, IST |
| `provenance` | always `synthetic-simulated` |
| `node_id`, `block_id`, `block_name` | sensor node ↔ block link |
| `ph`, `orp_mv`, `water_temp_c`, `water_level_cm` | sensor readings (empty on dropout) |
| `orp_status` | derived band: `safe` ≥650 / `watch` 400–649 / `critical` <400 |
| `sensor_health` | `ok` or `dropout` |
