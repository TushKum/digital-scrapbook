# NEERVANA — Financial Model

> **Read this first (honesty banner).** This is an **assumption-driven planning
> model**, not audited or validated numbers. Figures tagged **🔵 grounded** rest
> on a public/real fact; **🟠 assumption** are planning estimates to pressure-test;
> **⚠️ verify** must be confirmed before any pitch claim. NEERVANA is **B2G**
> (selling to district/state government) — expect **long sales cycles (6–18 mo)**,
> grant-led early funding, and the core water→disease thesis is **still
> unvalidated** (see `DATASET.md`). Currency: ₹ (INR). All ₹ are illustrative.

---

## 1. Business model in one line
Sell an **integrated water-health surveillance service** to districts: a per-district
**software subscription** + **field sensor nodes** (hardware) + **install / integration /
training** + **annual maintenance & calibration**. Decision-support layer over IDSP/JJM —
not a replacement (see `docs/DATA_ARCHITECTURE.md`).

## 2. Revenue streams
| Stream | Type | Illustrative price | Tag |
|---|---|---|---|
| Software subscription / district | recurring (annual) | ₹6–12 L (tiered by population & blocks); base **₹8 L** | 🟠 assumption |
| Sensor node (pH + ORP + temp + ultrasonic + MCU + connectivity) | one-time hardware | **₹35 k / node** + ₹5 k install | 🟠 assumption |
| Nodes per district (phase 1: critical PHC sources) | one-time | ~**20 nodes** | 🟠 assumption |
| Setup · data integration · Punjabi training | one-time | ₹3–5 L (use **₹4 L**) | 🟠 assumption |
| AMC + calibration | recurring (annual) | **18 % of hardware value** | 🟠 assumption |

## 3. Unit economics — one district
| Item | Year 1 (deploy) | Recurring / yr |
|---|--:|--:|
| Software subscription | ₹8.0 L | ₹8.0 L |
| Hardware (20 × ₹35 k) + install (20 × ₹5 k) | ₹8.0 L | — |
| Setup + integration + training | ₹4.0 L | — |
| AMC + calibration (18 % × ₹7 L HW) | — | ₹1.3 L |
| **Contract value** | **₹20.0 L** | **₹9.3 L** |
| Est. delivery cost (see §4) | ~₹11.5 L | ~₹3.3 L |
| **Gross margin** | **~42 %** 🟠 | **~65 %** 🟠 |

Recurring, high-margin SaaS+AMC is the compounding engine; hardware is lower-margin
and mostly a Year-1 enabler.

## 4. Cost structure
| Cost | Basis | Illustrative | Tag |
|---|---|---|---|
| Sensor node COGS | bill of materials | ~₹22 k / node | 🟠 |
| Cloud hosting (**India region**, DPDP) | shared, scales sub-linearly | ₹2–4 L / yr at small scale | 🟠 |
| Field ops / calibration / data QA | per district | ₹2–3 L / yr | 🟠 |
| Core team (3–5, lean) | salaries | ₹35–60 L / yr | 🟠 |
| **Validation study** (free-data + govt-lab) | one-time, Phase 0 | ₹5–10 L | 🟠 |
| **STQC / CERT-In security audit** | pre-go-live, mandatory | ₹3–6 L one-time | ⚠️ verify |
| GeM / empanelment / compliance | one-time + annual | ₹1–3 L | ⚠️ verify |

## 5. Market sizing (bottom-up, not top-down hand-waving)
| Layer | Count | Note | Tag |
|---|--:|---|---|
| Districts in India | ~**766** | Census/LGD | 🔵 grounded (verify exact) |
| Districts in Punjab (beachhead) | **23** | LGD | 🔵 grounded |
| Malwa "priority" districts (chemical + outbreak load) | ~10 | cancer-belt + WQ hot-spots | 🔵 grounded |
| **SOM** (realistic 3-yr reach) | **1 → 8 → ~30** | Y1 pilot → Punjab → multi-state | 🟠 assumption |

**TAM is a direction, not a promise:** ~766 districts × ~₹9–20 L ≈ *order of ₹700–1,500 Cr*
lifetime opportunity — **illustrative only**, gated by B2G adoption, budgets, and validation.
The real near-term market is the **budget line your customer already draws on** (JJM
Water-Quality Monitoring & Surveillance; NHM/DHAP) — see `GOVERNMENT_READINESS.md`. ⚠️ verify
current scheme allocations before quoting any number.

## 6. Three-year projection (illustrative)
| | Year 1 (pilot) | Year 2 (Punjab) | Year 3 (multi-state) |
|---|--:|--:|--:|
| Districts (cumulative) | 1–2 | 6–8 | ~30 |
| Revenue | ₹20–40 L | ₹1.2–1.6 Cr | ₹4–6 Cr |
| of which recurring | low | ~₹60–75 L | ~₹2.5–3 Cr |
| Costs | ₹60–90 L | ₹1.4–1.8 Cr | ₹3–4 Cr |
| Funded primarily by | **grants** | grants + revenue | revenue |
| Net | negative (grant-covered) | ~break-even | positive |

🟠 All figures assumption-level; sensitivity in §8.

## 7. Funding strategy (non-dilutive first — correct for GovTech)
| Source | Typical size | Why it fits | Tag |
|---|--:|---|---|
| BIRAC BIG / grand challenges | ~₹50 L | health-tech, non-dilutive | ⚠️ verify current |
| Startup India Seed Fund (SISFS, via incubator) | up to ₹50 L | prototype→pilot | ⚠️ verify |
| DST-NIDHI (PRAYAS / EIR / iHub-TIH) | ₹10–50 L | deep-tech / sensors | ⚠️ verify |
| Punjab State startup / innovation scheme | varies | local govt goodwill + market access | ⚠️ verify |
| CSR (health / water) + hospital tie-ins | varies | funds the pilot + validation | 🟠 |
| Revenue (pilot contracts) | ₹20 L+ | proof + cash | 🟠 |

Avoid early VC: B2G timelines don't fit a 5-yr fund clock. Blend **grants + pilot revenue**
until multi-state traction. Fund the **ASHA incentive** explicitly (see `GOVERNMENT_READINESS.md`).

## 8. Break-even & sensitivity
- **Break-even** ≈ when **recurring** (SaaS+AMC) covers fixed team+infra — roughly **~8–12
  active districts** at the base price 🟠.
- **Most sensitive levers:** (1) price/district, (2) nodes/district (hardware margin drag),
  (3) sales-cycle length (cash runway), (4) grant timing. A ±25 % move in price/district or
  sales cycle swings break-even by ~1 year.

## 9. Key risks (financial)
- **Long/uncertain B2G procurement** → grant runway is the lifeline.
- **Unvalidated thesis** → a failed validation study kills willingness-to-pay; de-risk cheaply first.
- **Hardware margin + field maintenance** at scale (calibration, replacement).
- **Single-scheme dependency** → diversify (health *and* water dept, chemical-hazard vertical).

---

*Pair with `MARKET_RESEARCH_BRIEF.md` (buyers/competitors) and `GOVERNMENT_READINESS.md`
(procurement path). Nothing here is a committed forecast — it is a model to argue from and
to stress-test in front of judges/investors.*
