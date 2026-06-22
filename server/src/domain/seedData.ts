import type { Lang, SnapshotDTO, StockDTO, TimeKey } from '../types';

// Canonical seed dataset for Patiala district. Generated deterministically from
// authored per-block profiles, then loaded into Postgres by db/seed.ts.

export interface SeedBlock {
  id: string;
  name: string;
  namePa: string;
  phc: string;
  population: number;
  posX: number;
  posZ: number;
  areaW: number;
  areaD: number;
  snapshots: Record<TimeKey, SnapshotDTO>;
  stock: Record<TimeKey, StockDTO>;
  sortOrder: number;
}

export interface SeedDispatch {
  lang: Lang;
  text: string;
  priority: number;
}

const round = (v: number) => Math.round(v);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface Seed {
  id: string;
  name: string;
  namePa: string;
  phc: string;
  population: number;
  position: [number, number];
  area: [number, number];
  baseCases: number;
  wqi: number;
  turbidity: number;
  stock: StockDTO;
}

const SEEDS: Seed[] = [
  { id: 'sanaur', name: 'Sanaur', namePa: 'ਸਨੌਰ', phc: 'CHC Sanaur', population: 38420, position: [2, 4], area: [3.6, 3.4], baseCases: 142, wqi: 38, turbidity: 14.2, stock: { ors: 32, zinc: 28, antibiotics: 41 } },
  { id: 'samana', name: 'Samana', namePa: 'ਸਮਾਣਾ', phc: 'SDH Samana', population: 51230, position: [-3.5, 7], area: [3.8, 3.6], baseCases: 96, wqi: 47, turbidity: 9.8, stock: { ors: 48, zinc: 52, antibiotics: 60 } },
  { id: 'patran', name: 'Patran', namePa: 'ਪਾਤੜਾਂ', phc: 'CHC Patran', population: 33760, position: [-9, 9], area: [3.4, 3.2], baseCases: 71, wqi: 51, turbidity: 8.1, stock: { ors: 54, zinc: 49, antibiotics: 62 } },
  { id: 'rajpura', name: 'Rajpura', namePa: 'ਰਾਜਪੁਰਾ', phc: 'SDH Rajpura', population: 88210, position: [6, -5], area: [4.0, 3.8], baseCases: 64, wqi: 58, turbidity: 6.4, stock: { ors: 66, zinc: 71, antibiotics: 58 } },
  { id: 'nabha', name: 'Nabha', namePa: 'ਨਾਭਾ', phc: 'Civil Hospital Nabha', population: 67800, position: [-5, 0], area: [3.9, 3.7], baseCases: 38, wqi: 72, turbidity: 3.1, stock: { ors: 82, zinc: 78, antibiotics: 74 } },
  { id: 'ghanaur', name: 'Ghanaur', namePa: 'ਘਨੌਰ', phc: 'PHC Ghanaur', population: 28900, position: [9.5, 1.5], area: [3.3, 3.2], baseCases: 22, wqi: 78, turbidity: 2.4, stock: { ors: 88, zinc: 84, antibiotics: 90 } },
];

function snapshots(seed: Seed): Record<TimeKey, SnapshotDTO> {
  const epi: SnapshotDTO = {
    activeCases: seed.baseCases,
    newCases: round(seed.baseCases * 0.42),
    recovered: round(seed.baseCases * 1.55),
    sForms: round(seed.baseCases * 2.1 + seed.population / 4200),
    pForms: round(seed.baseCases * 1.05 + 6),
    wqi: seed.wqi,
    turbidity: seed.turbidity,
  };
  const week: SnapshotDTO = {
    activeCases: round(seed.baseCases * 0.6),
    newCases: round(seed.baseCases * 0.28),
    recovered: round(seed.baseCases * 0.92),
    sForms: round(epi.sForms * 0.56),
    pForms: round(epi.pForms * 0.56),
    wqi: clamp(seed.wqi + 4, 0, 100),
    turbidity: Math.max(0.6, round((seed.turbidity - 1.6) * 10) / 10),
  };
  const day: SnapshotDTO = {
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

function stockLevels(seed: Seed): Record<TimeKey, StockDTO> {
  const bump = (s: StockDTO, by: number): StockDTO => ({
    ors: clamp(s.ors + by, 0, 100),
    zinc: clamp(s.zinc + by, 0, 100),
    antibiotics: clamp(s.antibiotics + by, 0, 100),
  });
  return { epi22: seed.stock, '7d': bump(seed.stock, 9), '24h': bump(seed.stock, 17) };
}

export const SEED_BLOCKS: SeedBlock[] = SEEDS.map((seed, i) => ({
  id: seed.id,
  name: seed.name,
  namePa: seed.namePa,
  phc: seed.phc,
  population: seed.population,
  posX: seed.position[0],
  posZ: seed.position[1],
  areaW: seed.area[0],
  areaD: seed.area[1],
  snapshots: snapshots(seed),
  stock: stockLevels(seed),
  sortOrder: i,
}));

export const SEED_DISPATCHES: SeedDispatch[] = [
  { lang: 'EN', priority: 9, text: 'ALERT: High turbidity reported in Sanaur block — boiling-water advisory issued for affected wards.' },
  { lang: 'EN', priority: 5, text: 'UPDATE: ORS stock replenished at Rajpura CHC; buffer restored to 82%.' },
  { lang: 'EN', priority: 6, text: 'ADVISORY: Chlorination drive intensified across Samana sub-centres following coliform detection.' },
  { lang: 'EN', priority: 4, text: 'NOTICE: Rapid Response Team deployed to Patran for door-to-door ADD surveillance.' },
  { lang: 'EN', priority: 2, text: 'INFO: Nabha block water quality within safe limits — routine monitoring continues.' },
  { lang: 'EN', priority: 3, text: 'DIRECTIVE: District Nodal Officer to review Epi-Week 22 IDSP returns by 1800 hrs.' },
  { lang: 'PA', priority: 9, text: 'ਚੇਤਾਵਨੀ: ਸਨੌਰ ਬਲਾਕ ਵਿੱਚ ਉੱਚ ਗੰਦਲਾਪਣ — ਪ੍ਰਭਾਵਿਤ ਵਾਰਡਾਂ ਲਈ ਪਾਣੀ ਉਬਾਲਣ ਦੀ ਸਲਾਹ ਜਾਰੀ।' },
  { lang: 'PA', priority: 5, text: 'ਅਪਡੇਟ: ਰਾਜਪੁਰਾ CHC ਵਿਖੇ ORS ਭੰਡਾਰ ਮੁੜ ਭਰਿਆ ਗਿਆ; ਬਫ਼ਰ 82% ਤੱਕ ਬਹਾਲ।' },
  { lang: 'PA', priority: 6, text: 'ਸਲਾਹ: ਕੋਲੀਫਾਰਮ ਮਿਲਣ ਮਗਰੋਂ ਸਮਾਣਾ ਉਪ-ਕੇਂਦਰਾਂ ਵਿੱਚ ਕਲੋਰੀਨੇਸ਼ਨ ਤੇਜ਼ ਕੀਤੀ ਗਈ।' },
  { lang: 'PA', priority: 4, text: 'ਸੂਚਨਾ: ਪਾਤੜਾਂ ਵਿੱਚ ਘਰ-ਘਰ ADD ਨਿਗਰਾਨੀ ਲਈ ਰੈਪਿਡ ਰਿਸਪਾਂਸ ਟੀਮ ਤਾਇਨਾਤ।' },
  { lang: 'PA', priority: 2, text: 'ਜਾਣਕਾਰੀ: ਨਾਭਾ ਬਲਾਕ ਦਾ ਪਾਣੀ ਸੁਰੱਖਿਅਤ ਹੱਦਾਂ ਅੰਦਰ — ਨਿਯਮਤ ਨਿਗਰਾਨੀ ਜਾਰੀ।' },
  { lang: 'PA', priority: 3, text: 'ਹਦਾਇਤ: ਜ਼ਿਲ੍ਹਾ ਨੋਡਲ ਅਫ਼ਸਰ 1800 ਵਜੇ ਤੱਕ ਮਹਾਂਮਾਰੀ ਹਫ਼ਤਾ 22 ਦੇ IDSP ਅੰਕੜੇ ਜਾਂਚਣ।' },
];
