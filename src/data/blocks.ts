// ──────────────────────────────────────────────────────────────────────────
// NEERVANA · Patiala District block-level surveillance dataset.
// Six blocks, each with a snapshot per reporting window (last 24h / last 7d /
// Epi-Week 22) and PHC essential-medicine stock levels. Values are synthetic
// but modelled on realistic IDSP reporting and water-quality patterns, and are
// materialised at module load so the dashboard is populated out of the box.
// ──────────────────────────────────────────────────────────────────────────

export type TimeKey = '24h' | '7d' | 'epi22';

export interface BlockSnapshot {
  activeCases: number; // ADD / suspected water-borne cases in window
  newCases: number; // freshly reported in window
  recovered: number;
  sForms: number; // IDSP S-form (syndromic, sub-centre) submissions
  pForms: number; // IDSP P-form (presumptive, PHC) submissions
  wqi: number; // Water Quality Index 0–100 (higher = cleaner)
  turbidity: number; // NTU
}

export interface StockLevel {
  ors: number; // % of buffer stock available
  zinc: number;
  antibiotics: number;
}

export interface Block {
  id: string;
  name: string;
  namePa: string;
  phc: string;
  population: number;
  position: [number, number]; // [x, z] on the 3D map
  area: [number, number]; // footprint plate size [w, d]
  snapshots: Record<TimeKey, BlockSnapshot>;
  stock: Record<TimeKey, StockLevel>;
}

const round = (v: number) => Math.round(v);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface BlockSeed {
  id: string;
  name: string;
  namePa: string;
  phc: string;
  population: number;
  position: [number, number];
  area: [number, number];
  baseCases: number; // Epi-Week 22 active caseload
  wqi: number; // current Water Quality Index
  turbidity: number;
  stock: StockLevel; // Epi-Week 22 (most depleted) buffer levels
}

const SEEDS: BlockSeed[] = [
  {
    id: 'sanaur',
    name: 'Sanaur',
    namePa: 'ਸਨੌਰ',
    phc: 'CHC Sanaur',
    population: 38420,
    position: [2, 4],
    area: [3.6, 3.4],
    baseCases: 142,
    wqi: 38,
    turbidity: 14.2,
    stock: { ors: 32, zinc: 28, antibiotics: 41 },
  },
  {
    id: 'samana',
    name: 'Samana',
    namePa: 'ਸਮਾਣਾ',
    phc: 'SDH Samana',
    population: 51230,
    position: [-3.5, 7],
    area: [3.8, 3.6],
    baseCases: 96,
    wqi: 47,
    turbidity: 9.8,
    stock: { ors: 48, zinc: 52, antibiotics: 60 },
  },
  {
    id: 'patran',
    name: 'Patran',
    namePa: 'ਪਾਤੜਾਂ',
    phc: 'CHC Patran',
    population: 33760,
    position: [-9, 9],
    area: [3.4, 3.2],
    baseCases: 71,
    wqi: 51,
    turbidity: 8.1,
    stock: { ors: 54, zinc: 49, antibiotics: 62 },
  },
  {
    id: 'rajpura',
    name: 'Rajpura',
    namePa: 'ਰਾਜਪੁਰਾ',
    phc: 'SDH Rajpura',
    population: 88210,
    position: [6, -5],
    area: [4.0, 3.8],
    baseCases: 64,
    wqi: 58,
    turbidity: 6.4,
    stock: { ors: 66, zinc: 71, antibiotics: 58 },
  },
  {
    id: 'nabha',
    name: 'Nabha',
    namePa: 'ਨਾਭਾ',
    phc: 'Civil Hospital Nabha',
    population: 67800,
    position: [-5, 0],
    area: [3.9, 3.7],
    baseCases: 38,
    wqi: 72,
    turbidity: 3.1,
    stock: { ors: 82, zinc: 78, antibiotics: 74 },
  },
  {
    id: 'ghanaur',
    name: 'Ghanaur',
    namePa: 'ਘਨੌਰ',
    phc: 'PHC Ghanaur',
    population: 28900,
    position: [9.5, 1.5],
    area: [3.3, 3.2],
    baseCases: 22,
    wqi: 78,
    turbidity: 2.4,
    stock: { ors: 88, zinc: 84, antibiotics: 90 },
  },
];

function buildSnapshots(seed: BlockSeed): Record<TimeKey, BlockSnapshot> {
  const epi: BlockSnapshot = {
    activeCases: seed.baseCases,
    newCases: round(seed.baseCases * 0.42),
    recovered: round(seed.baseCases * 1.55),
    sForms: round(seed.baseCases * 2.1 + seed.population / 4200),
    pForms: round(seed.baseCases * 1.05 + 6),
    wqi: seed.wqi,
    turbidity: seed.turbidity,
  };
  const week: BlockSnapshot = {
    activeCases: round(seed.baseCases * 0.6),
    newCases: round(seed.baseCases * 0.28),
    recovered: round(seed.baseCases * 0.92),
    sForms: round(epi.sForms * 0.56),
    pForms: round(epi.pForms * 0.56),
    wqi: clamp(seed.wqi + 4, 0, 100),
    turbidity: Math.max(0.6, round((seed.turbidity - 1.6) * 10) / 10),
  };
  const day: BlockSnapshot = {
    activeCases: round(seed.baseCases * 0.17),
    newCases: round(seed.baseCases * 0.09),
    recovered: round(seed.baseCases * 0.2),
    sForms: round(epi.sForms * 0.13),
    pForms: round(epi.pForms * 0.13),
    wqi: clamp(seed.wqi + 7, 0, 100),
    turbidity: Math.max(0.4, round((seed.turbidity - 2.4) * 10) / 10),
  };
  return { '24h': day, '7d': week, epi22: epi };
}

function buildStock(seed: BlockSeed): Record<TimeKey, StockLevel> {
  // Stock improves toward the present as replenishment lands; Epi-Week 22 is the
  // most depleted (outbreak peak).
  const bump = (s: StockLevel, by: number): StockLevel => ({
    ors: clamp(s.ors + by, 0, 100),
    zinc: clamp(s.zinc + by, 0, 100),
    antibiotics: clamp(s.antibiotics + by, 0, 100),
  });
  return {
    epi22: seed.stock,
    '7d': bump(seed.stock, 9),
    '24h': bump(seed.stock, 17),
  };
}

export const BLOCKS: Block[] = SEEDS.map((seed) => ({
  id: seed.id,
  name: seed.name,
  namePa: seed.namePa,
  phc: seed.phc,
  population: seed.population,
  position: seed.position,
  area: seed.area,
  snapshots: buildSnapshots(seed),
  stock: buildStock(seed),
}));

export const TIME_KEYS: TimeKey[] = ['24h', '7d', 'epi22'];

// A light "canal" polyline (Bhakra branch) drawn across the GIS map for context.
export const CANAL_PATH: Array<[number, number]> = [
  [-12, -3],
  [-6, -1],
  [-1, 2],
  [4, 3],
  [8, 6],
  [11, 10],
];
