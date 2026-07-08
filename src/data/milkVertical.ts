// ──────────────────────────────────────────────────────────────────────────
// Content model for the "Milk Adulteration Screening" product vertical page.
// DATA-INTEGRITY RULE: every figure is tagged as either 'verified' (published
// Verka/Milkfed data) or 'estimate' (assumption to be confirmed with Verka).
// Nothing on the page may render a number that is not in this file, and no
// value here may be presented as more certain than its tag.
// ──────────────────────────────────────────────────────────────────────────

export type SourceTag = 'verified' | 'estimate';

export const SOURCE_LABEL: Record<SourceTag, string> = {
  verified: 'Verified — Verka/Milkfed published data',
  estimate: 'Estimate — to be confirmed with Verka',
};

export const HERO = {
  eyebrow: 'Product Vertical · Dairy Cooperatives',
  title: 'Milk Adulteration Screening',
  oneLiner:
    'Low-cost, connected milk-adulteration screening for dairy cooperatives — an early-warning and traceability layer at the village collection point.',
  disclaimer:
    'This is a screening / early-warning tool. It is not a lab-grade diagnostic and not a pathogen or disease detector. Flagged samples are referred for proper laboratory testing.',
};

// Hero stat strip — every figure is 'verified' (Verka/Milkfed published data).
export const HERO_STATS: { value: string; label: string; source: SourceTag }[] = [
  { value: '1 lakh L/day', label: 'Patiala plant handling capacity', source: 'verified' },
  { value: '~6,300', label: 'Village societies statewide (Milkfed)', source: 'verified' },
  { value: '11', label: 'District unions across Punjab', source: 'verified' },
  { value: '0', label: 'Adulterant tests at society level today', source: 'verified' },
];

// Marquee strip content — short forms of the verified facts only.
export const TICKER_FACTS: string[] = [
  'Buyer: Patiala District Cooperative Milk Producers’ Union Ltd (Verka Patiala Dairy)',
  'Patiala plant: 1 lakh litres/day · milkshed Patiala & Fatehgarh Sahib',
  'Chilling centre at Samana: 8,000 LPD',
  'Milkfed statewide: ~6,300 societies · ~3.5 lakh members · 11 unions · 10 plants',
  'Society testing today: Fat, SNF and taste — no adulterant test',
  'Screening & early warning — flagged samples referred to accredited labs',
];

export const PROBLEM = {
  intro:
    'Milk adulteration is a documented, economically painful problem for Indian dairy cooperatives. Common adulterants dilute or fake compositional quality, hurting both the union and honest farmers.',
  adulterants: [
    { name: 'Added water', note: 'Dilutes milk solids and volume-based payment' },
    { name: 'Urea', note: 'Fakes SNF / nitrogen content' },
    { name: 'Detergent', note: 'Emulsifies added fat to mimic richness' },
    { name: 'Starch', note: 'Thickens diluted milk' },
    { name: 'Synthetic milk', note: 'Manufactured imitation of milk chemistry' },
    { name: 'Fat manipulation', note: 'Skimming or substituting fat content' },
  ],
  wedge: {
    text: 'Society-level testing today checks Fat, SNF and taste — but not adulterants. That gap is the wedge this vertical addresses.',
    source: 'verified' as SourceTag,
  },
};

export const SOLUTION = {
  intro:
    'An ESP32-based device at the collection point digitises, timestamps and (optionally) GPS-tags each test result, and pushes it to a cooperative dashboard. The differentiator is the data + traceability layer — not reinventing milk chemistry.',
  steps: [
    {
      title: 'Sense at the collection point',
      detail:
        'Density with temperature correction for added water; pH and conductivity/TDS for common chemical adulterants; proven FSSAI-style chemical test strips for specific adulterants.',
    },
    {
      title: 'Digitise & trace',
      detail:
        'Each test is timestamped, tied to the society and (optionally) GPS-tagged — building a tamper-resistant record per collection point.',
    },
    {
      title: 'Union dashboard',
      detail:
        'Results stream to a cooperative dashboard: trends per society, repeat-offence patterns, and early-warning flags for the union’s quality team.',
    },
  ],
  sensing: [
    { parameter: 'Density + temperature', method: 'Load-cell / float sensor with temp correction', screensFor: 'Added water' },
    { parameter: 'pH', method: 'Electrode probe', screensFor: 'Neutralisers, spoilage-masking chemicals' },
    { parameter: 'Conductivity / TDS', method: 'Conductivity cell', screensFor: 'Salts, urea and ionic adulterants' },
    { parameter: 'Chemical strips', method: 'FSSAI-style rapid test strips', screensFor: 'Specific adulterants (urea, detergent, starch)' },
  ],
  honesty:
    'Cheap sensors give screening — “this sample looks off, send it for proper testing” — not legal-grade proof. Confirmation always happens at an accredited laboratory.',
};

// ── Market: Patiala beachhead ──────────────────────────────────────────────
export interface MarketFact {
  label: string;
  value: string;
  source: SourceTag;
}

export const MARKET_FACTS: MarketFact[] = [
  {
    label: 'Buyer',
    value: 'Patiala District Cooperative Milk Producers’ Union Ltd (Verka Patiala Dairy)',
    source: 'verified',
  },
  {
    label: 'Patiala plant handling capacity',
    value: '1 lakh litres/day · milkshed: Patiala & Fatehgarh Sahib · one chilling centre at Samana (8,000 LPD)',
    source: 'verified',
  },
  {
    label: 'Statewide Milkfed network',
    value: '~6,300 village cooperative societies · ~3.5 lakh members · 11 district unions · 10 plants',
    source: 'verified',
  },
  {
    label: 'Procurement testing today',
    value: 'Milk procured after testing for Fat, SNF and taste — no adulteration test at the society level',
    source: 'verified',
  },
  {
    label: 'Collection points in the Patiala milkshed',
    value: '~400–600 (midpoint 500 used for sizing)',
    source: 'estimate',
  },
  {
    label: 'Pricing assumption',
    value: '₹4,000 one-time per device · ₹1,200 per device per year service',
    source: 'estimate',
  },
];

export interface MarketTier {
  key: 'TAM' | 'SAM' | 'SOM';
  scope: string;
  hardware: string;
  recurring: string;
  /** Relative bar width (TAM = 100). Derived from hardware ₹ so bars stay honest. */
  barPct: number;
}

// All three tiers derive from the ESTIMATE assumptions above (500 points,
// ₹4,000 device, ₹1,200/yr) — the whole block is tagged 'estimate'.
export const MARKET_TIERS: MarketTier[] = [
  {
    key: 'TAM',
    scope: 'Patiala milkshed, ~500 collection points',
    hardware: '~₹20 lakh hardware',
    recurring: '~₹6 lakh/yr recurring',
    barPct: 100,
  },
  {
    key: 'SAM',
    scope: '~250 points (~50% early-adoptable)',
    hardware: '~₹10 lakh hardware',
    recurring: '~₹3 lakh/yr recurring',
    barPct: 50,
  },
  {
    key: 'SOM',
    scope: '~100 points over 2–3 yrs from a Verka pilot',
    hardware: '~₹4 lakh cumulative',
    recurring: '~₹1.2 lakh/yr recurring',
    barPct: 20,
  },
];

export const MARKET_NOTE =
  'Patiala is a proof beachhead, not the market size. These figures size the first union only.';

export const SCALE_LADDER = {
  steps: [
    'Patiala union (proof beachhead)',
    'All 11 Verka unions · ~6,300 societies statewide',
    'Other state federations',
  ],
  ceiling:
    'At statewide Milkfed scale (same assumptions): ~₹2.5 crore hardware + ~₹76 lakh/yr recurring.',
  ceilingTag: 'Growth ceiling, not current claim',
  source: 'estimate' as SourceTag,
};

// ── Business model ─────────────────────────────────────────────────────────
export const BUSINESS_MODEL = {
  points: [
    {
      title: 'Hardware near cost',
      detail: 'Sell the device near-cost — the device is the entry point, not the margin.',
    },
    {
      title: 'Annual service + dashboard subscription',
      detail: 'Recurring per-device service fee plus a data/dashboard subscription for the union’s quality team.',
    },
    {
      title: 'Union-level sales',
      detail: 'Sell to the union / federation as a bulk buyer — not society-by-society.',
    },
    {
      title: 'Device-as-a-service option',
      detail: 'Rental model removes the upfront cost for cautious unions.',
    },
  ],
  moat: 'The moat, honestly stated: distribution and trust with cooperatives plus compounding collection-point data — not the hardware, which is commodity.',
};

// ── Impact (Enactus-facing) ────────────────────────────────────────────────
export interface ImpactKpi {
  label: string;
  value: string; // placeholder until pilot data exists — never invent numbers
}

export const IMPACT_KPIS: ImpactKpi[] = [
  { label: 'Litres screened / day', value: 'Pilot pending' },
  { label: 'Adulteration cases flagged', value: 'Pilot pending' },
  { label: '₹ loss prevented for the cooperative', value: 'Pilot pending' },
  { label: 'Farmer payment disputes reduced', value: 'Pilot pending' },
  { label: 'Societies live', value: 'Pilot pending' },
  { label: 'Farmers reached', value: 'Pilot pending' },
  { label: 'Student hours', value: 'Pilot pending' },
];

export const SDGS = [
  { n: 2, label: 'Zero Hunger' },
  { n: 3, label: 'Good Health & Well-Being' },
  { n: 8, label: 'Decent Work & Economic Growth' },
];

// ── Roadmap ────────────────────────────────────────────────────────────────
export const ROADMAP = [
  { phase: 'Phase 0', title: 'Confirm target adulterant with Verka', detail: 'Agree with the union which adulterant matters most before building.' },
  { phase: 'Phase 1', title: 'Learn the toolchain', detail: 'Wokwi simulation and ESP32 bring-up.' },
  { phase: 'Phase 2', title: 'Build the screening core', detail: 'Density + temperature, pH, conductivity/TDS sensing and strip-result capture.' },
  { phase: 'Phase 3', title: 'Validate against the Verka lab', detail: 'Measure accuracy and false-positive rate against accredited lab results.' },
  { phase: 'Phase 4', title: 'Verka pilot', detail: '5–20 societies live with the dashboard.' },
  { phase: 'Phase 5', title: 'Scale', detail: 'Patiala union → other Verka unions → other federations.' },
];

// ── Open items the team still needs from Verka ─────────────────────────────
export const OPEN_ITEMS = [
  'Exact functional society count for the Patiala union — pending confirmation',
  'The specific adulterant Verka most cares about — pending confirmation',
];
