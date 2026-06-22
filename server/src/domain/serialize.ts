import type { BlockDTO, SnapshotDTO, StockDTO, TimeKey } from '../types';
import { TIME_KEYS } from '../types';

// Structural shapes of the Prisma rows we read (decoupled from generated types).
interface SnapshotRow {
  window: string;
  activeCases: number;
  newCases: number;
  recovered: number;
  sForms: number;
  pForms: number;
  wqi: number;
  turbidity: number;
}
interface StockRow {
  window: string;
  ors: number;
  zinc: number;
  antibiotics: number;
}
export interface BlockRow {
  id: string;
  name: string;
  namePa: string;
  phc: string;
  population: number;
  posX: number;
  posZ: number;
  areaW: number;
  areaD: number;
  snapshots: SnapshotRow[];
  stock: StockRow[];
}

const ZERO_SNAPSHOT: SnapshotDTO = {
  activeCases: 0,
  newCases: 0,
  recovered: 0,
  sForms: 0,
  pForms: 0,
  wqi: 0,
  turbidity: 0,
};
const ZERO_STOCK: StockDTO = { ors: 0, zinc: 0, antibiotics: 0 };

const isTimeKey = (w: string): w is TimeKey => (TIME_KEYS as string[]).includes(w);

// Reduce a relational block row into the keyed-by-window API DTO.
export function toBlockDTO(row: BlockRow): BlockDTO {
  const snapshots = { '24h': ZERO_SNAPSHOT, '7d': ZERO_SNAPSHOT, epi22: ZERO_SNAPSHOT } as Record<TimeKey, SnapshotDTO>;
  const stock = { '24h': ZERO_STOCK, '7d': ZERO_STOCK, epi22: ZERO_STOCK } as Record<TimeKey, StockDTO>;

  for (const s of row.snapshots) {
    if (!isTimeKey(s.window)) continue;
    snapshots[s.window] = {
      activeCases: s.activeCases,
      newCases: s.newCases,
      recovered: s.recovered,
      sForms: s.sForms,
      pForms: s.pForms,
      wqi: s.wqi,
      turbidity: s.turbidity,
    };
  }
  for (const s of row.stock) {
    if (!isTimeKey(s.window)) continue;
    stock[s.window] = { ors: s.ors, zinc: s.zinc, antibiotics: s.antibiotics };
  }

  return {
    id: row.id,
    name: row.name,
    namePa: row.namePa,
    phc: row.phc,
    population: row.population,
    position: [row.posX, row.posZ],
    area: [row.areaW, row.areaD],
    snapshots,
    stock,
  };
}
