# NEERVANA — Government Readiness (the non-software work)

These are the gaps a district/state government reviewer will raise that **cannot
be fixed in code**. They decide whether NEERVANA gets a budget line and survives
after the pilot. Software problems (integration UI, alert workflow, reports) are
handled in the app; this doc is everything else — organised as: *why government
cares → what to do → who to approach*.

Status legend: 🔴 blocker (do before any pilot) · 🟠 needed for a budget line · 🟢 strengthens the case.

---

## 1. Data governance & DPDP Act 2023 🔴
**Why:** villager symptom + location data is *sensitive personal data*. And today
NEERVANA's data sits on **Neon/Vercel (US infrastructure)** — a hard stop for a
government analyst.
**Do:**
- **Data residency in India** — move production DB + app to India-region hosting
  (or an Indian cloud / NIC) before any real data flows.
- **Data-sharing MoU** with the district in which **the government is the data
  owner / fiduciary** and NEERVANA is only the *processor*. Never "our data."
- **Consent + purpose limitation** for identifiable data; anonymise/aggregate for
  dashboards; **full audit trail** of who saw/did what.
- Appoint a **Data Protection point of contact**; align to DPDP Act 2023 duties.
**Who:** District IT / e-Governance cell; State Health Mission data unit.

## 2. Validation & evidence 🔴
**Why:** no department champions an unvalidated black box; no DHAP funds one.
Everything on screen is currently **seeded demo data**.
**Do (this is your action plan's Phase 0):**
- Retrospective study on **free data**: IDSP/IHIP × WQMIS/FTK × IMD rainfall,
  Patiala 2022–26. Report **sensitivity, PPV, false-alarms/village/year,
  lead-time distribution** — benchmarked against rainfall-only.
- **Validate against a government lab** — District Public Health Lab / Rajindra
  Hospital — for credibility with reviewers.
- **Cost-benefit / DALY-averted** baseline: status-quo outbreak cost (use real
  Rajindra per-case billing) vs. with NEERVANA.
- **Reconstruct the Aug-2025 outbreak (5 deaths)** as the flagship case study.
**Who:** Civil Surgeon (data + RRT reports via RTI); Govt Medical College PI.

## 3. Sustainability & institutional home 🟠
**Why:** govtech pilots die when the founder graduates. Reviewers have seen it.
**Do:**
- Name the **owning department** (Health for disease, DWSS for water — decide the
  lead) and a **named official** who owns it.
- Identify the **budget line**: JJM *Water Quality Monitoring & Surveillance*, or
  DHAP → State PIP (consolidated ~Jan–Feb for an April start — be in the room by
  November).
- **Maintenance plan**: calibration, connectivity, device replacement, data-entry
  ownership — who, paid how.
- **Training / capacity**: Punjabi manuals + sessions for ASHAs/ANMs/PHC staff.
**Who:** DWSS Executive Engineer / District Water & Sanitation Mission; Civil Surgeon.

## 4. Fund the ASHA incentive 🔴
**Why:** ASHAs are ~₹2,500/month, maintain 10+ registers, periodically on strike.
An unpaid "11th register" fails on day one.
**Do:** budget a **per-report incentive** explicitly (the IHIP S-form ROP line
already exists); never assume free ASHA labour.
**Who:** NHM / District Health Society.

## 5. Procurement & adoption path 🟠
**Why:** government can't "buy from a student" — it needs a route.
**Do:**
- **GeM** listing (find the right service category) and/or a **state rate
  contract**; check if empanelment is a prerequisite.
- **Empanel** with the State Health/Water Mission.
- Get into a **DHAP/PIP** submission or a signed **MoU** (your gate G4).
- Note: **you cannot sell to JJM** — it funds state governments; it's a budget
  line your *customer* draws on.
**Who:** State procurement cell; District Health Society.

## 6. Align to targets they're already accountable for 🟢
**Why:** framed as a *new burden* it dies; framed as helping them hit existing
targets it gets adopted.
**Do:** map NEERVANA to **JJM Har-Ghar-Jal water-quality surveillance targets,
NHM/IDSP indicators, and SDG 3 & 6**. Lead every pitch with *"this helps you hit
reporting you already owe, faster."*

## 7. Field & operational realism (non-code decisions) 🟠
- **SMS / IVR alert channel** — not every field worker has a smartphone; decide a
  low-tech fallback and its cost (telecom/SMS gateway, an operational choice).
- **Punjabi verified by a native speaker** before any official demo — one wrong
  Gurmukhi word in front of Punjab officials is fatal.
- **Connectivity policy** for villages with poor network (offline sync is in the
  software backlog, but the SLA/expectation is an operational decision).

## 8. Positioning & liability 🟢
- Say **"decision-support that strengthens IDSP & JJM"**, never *"AI predicts
  outbreaks."* Confirmation is always at an accredited lab; a human officer
  decides and acts.
- Add explicit **liability disclaimers**: NEERVANA flags and routes; it is not a
  diagnosis and not the decision-maker.

---

## The 30-second version for the pitch
Bring three things and you clear most reviewer objections at once:
1. The **Aug-2025 reconstruction** (evidence + emotion).
2. A one-page **data-governance + MoU outline** (govt owns data, India residency,
   decision-support only).
3. A named **budget line + department** you're targeting (JJM WQM&S or DHAP).

Software that supports the above lives in the app (see the **/integration** page
and the alert-workflow / report-export modules on the build backlog).
