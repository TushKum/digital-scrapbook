# NEERVANA — Market Research Brief

A working scaffold for market research. Status: **pre-validation** — the core
thesis (water contamination signal predicts disease) has *not* yet been proven
on real data. Treat every number below as **"reported — verify"**, not fact.
The point of this document is to tell you *what to research and where*.

---

## 1. What NEERVANA is (one paragraph)

A water-and-disease **early-warning + traceability layer** for rural Punjab.
It fuses existing free/public signals — water-quality tests (FTK/lab), rainfall,
groundwater level, and IDSP/IHIP disease reports — to flag which villages are at
elevated risk of a water-borne outbreak (acute diarrhoeal disease, cholera,
typhoid, hepatitis), so authorities can chlorinate / treat *before* cases spike.
**Software-first:** score all villages from free data; low-cost sensors are an
**upsell for only the top ~5–10% of villages the model flags**, not a blanket
hardware rollout.

Beachhead: **Patiala district**. A separate vertical (Milk Adulteration
Screening for dairy cooperatives / Verka) exists but is a *different market* —
keep it out of health-sector research.

---

## 2. The problem (and the anchor story)

- Punjab's contamination season is **July–September** (monsoon). A **Patiala
  outbreak in August 2025 reportedly killed 5 people**, with **>50% of water
  samples failing**. This reconstruction is the single strongest piece of
  evidence — build the desk study around it.
- Today's gap: society/village water is checked (or not) for basic parameters
  and disease is reported *after the fact* via IDSP/IHIP. **Nobody is fusing the
  water signal with the disease signal to get ahead of it.** That fusion is the
  wedge.
- **Honesty flag for research:** it is not yet established that cheap water
  signals *predict* disease with usable precision. That is Research Question #1.

---

## 3. The two possible markets (research both)

**Market A — Microbial early warning (the current thesis).**
Acute, seasonal, outbreak-driven. Buyer = health + water departments. Risk: the
predictive signal may be weak or no better than "rainfall + season."

**Market B — Chemical exposure mapping (the pivot).**
Punjab's water crisis is arguably **chemical and chronic**, not microbial:
reported **uranium above the 30 µg/L BIS limit in ~73% of samples** in one Malwa
study; **nitrate up to ~2,553 mg/L** in two Patiala villages; plus fluoride and
heavy metals → cancer, kidney and developmental harm. **Nobody is doing
village-level chemical-exposure mapping + household risk communication.** It has
a clearer, better-documented burden and is the water story Punjab's public and
politicians already care about. **Research whether B is the bigger, cleaner
business than A.**

---

## 4. Who pays (buyers & budget lines to size)

| Buyer | What they own | Money to research |
|---|---|---|
| **DWSS / SWSM** (Dept. of Water Supply & Sanitation / State Water & Sanitation Mission) | Pipes, chlorination, water-quality monitoring | The **Water Quality Monitoring & Surveillance** line inside Punjab's **JJM Annual Action Plan** — who signs it, how big |
| **Civil Surgeon / District Health** | Disease response, RRTs, IDSP/IHIP | **District Health Action Plan (DHAP) → State PIP** budget cycle (consolidated ~Jan–Feb for April start) |
| **Gram Panchayats** | Village-level spend | **15th Finance Commission tied grants** — 50% earmarked for water & sanitation; the only genuinely village-level discretionary money, no departmental approval |
| **Federations (milk vertical only)** | Bulk procurement | Milkfed / Verka union budgets |

Note: **JJM itself is not a customer you can sell to** — it funds state
governments; it's a budget line your *customer* draws on. Procurement likely
runs through **GeM** (research: what category a software/analytics contract
needs, and whether a state rate contract is required first).

---

## 5. Market sizing — do it in ONE unit: villages / GPs

- Punjab: **~12,581 villages / ~13,241 gram panchayats** (verify against Census +
  Punjab LGD).
- Patiala district: **~900 villages** (verify). This is a **proof beachhead, not
  the market** — size the first union/district, then the scale ladder.
- Milkfed scale (milk vertical, separate): **~6,300 village societies · ~3.5 lakh
  members · 11 district unions**; Patiala Verka plant **~1 lakh litres/day**.
- **Do not** mix units (wards vs villages vs GPs) — pick villages/GPs and stick
  to it. Size TAM/SAM/SOM as: all Punjab villages → adoptable subset → pilot
  footprint.

---

## 6. Competitive & adjacent landscape (map these)

- **Government-lab hardware:** **CSIR-CSIO (Chandigarh)** licensed a rural IoT
  water monitor (~July 2025). Position NEERVANA as the **analytics/fusion layer
  their hardware reports into**, not the 15th competing sensor.
- **MeitY grand-challenge water-sensor vendors** (four vendors) — same: be
  sensor-agnostic and sit above them.
- **Incumbent systems** you must integrate with, not replace: **IDSP/IHIP**
  (disease), **WQMIS / FTK / JJM water-quality portal** (water). Research their
  data granularity and APIs.
- **Generic water-sensor & IoT vendors** (national/global) — commodity hardware;
  the moat is distribution/trust with cooperatives & departments + compounding
  data, not the sensor.
- **Research question:** who, if anyone, already sells *analytics/decision* (not
  just sensors) to Indian state water/health departments?

---

## 7. Policy / regulatory context to research

- **JJM / Har Ghar Jal** — Punjab is ~100% tap-connected, so "source testing" is
  partly obsolete; **69% of stored *household* water in rural India is reportedly
  E. coli positive** → research the household (point-of-consumption) angle.
- **DPDP Act 2023** — ASHA-collected symptom data on identifiable villagers is
  **sensitive personal data**; research consent-manager / data-fiduciary duties.
- **Procurement cycle** — DHAP → State PIP timing; GeM listing requirements.
- **ASHA economics** — ~**₹2,500/month** honorarium in Punjab, ~**1.6 ASHAs per
  village** (not 10), already maintaining 10+ registers and periodically on
  strike. Any data-collection ask must be *paid*. Research the IHIP S-form ROP
  incentive line.

---

## 8. The research agenda (the actual to-do)

**Tier 1 — kill-or-continue questions:**
1. Does a contaminated water test in a Patiala block **precede** ADD/cholera/
   typhoid case spikes — with what **lead time, sensitivity, and false-alarms
   per village per year**? (Use IDSP + WQMIS + IMD; benchmark vs rainfall-only.)
2. Is **Market B (chemical)** larger and cleaner than Market A (microbial)?
3. Is there a **named budget line and official** who would actually pay?

**Tier 2 — sizing & GTM:**
4. Real TAM/SAM/SOM in villages, and defensible per-village willingness-to-pay.
5. Competitor pricing for water analytics/monitoring to Indian govt buyers.
6. Procurement path (GeM category, rate contract, DHAP inclusion deadline).
7. Cost-per-case (outpatient ~₹700 vs admission ~₹9,650, real hospitalisation
   rate) — get actual figures from **Rajindra Hospital, Patiala**.

---

## 9. Where to look (free data & sources)

- **IDSP / IHIP weekly outbreak reports** — `idsp.mohfw.gov.in` (district/block
  disease, cases, deaths, onset vs reporting dates).
- **Water quality (WQMIS / JJM)** — `ejalshakti.gov.in/WQMIS` (FTK + lab, try for
  block/GP/date granularity).
- **Rainfall** — IMD / open gridded datasets (strongest single predictor).
- **Groundwater** — CGWB / India-WRIS.
- **RTI (₹10 each, 30-day binding response)** — DWSS Patiala (source-level water
  results 2023–26) and Civil Surgeon Patiala (block-wise IHIP counts + Aug-2025
  RRT reports). RTIs get data no portal exposes.
- **Chemical burden** — published Malwa uranium/nitrate/fluoride studies, PGIMER
  / Punjab pollution board reports.
- **Sizing/policy** — Census + Punjab LGD (village/GP counts), Punjab JJM AAP,
  Finance Commission grant guidelines, DPDP Act 2023 text.

---

## 10. Positioning one-liner (for the research framing)

> "The fusion + decision layer that turns Punjab's *already-collected* water and
> disease data into a village-level early-warning and response system — proven
> first on the free record of the August 2025 Patiala outbreak, before a rupee
> of hardware."

Everything in this brief is **to be verified** — the value of the next few weeks
is replacing "reported" with "sourced."
