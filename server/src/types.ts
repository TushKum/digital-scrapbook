// API DTOs — the wire contract consumed by the NEERVANA frontend. Kept in sync
// with src/data/blocks.ts on the client.

export type TimeKey = '24h' | '7d' | 'epi22';
export type Lang = 'EN' | 'PA';
export type Status = 'safe' | 'warning' | 'critical';

export const TIME_KEYS: TimeKey[] = ['24h', '7d', 'epi22'];
export const LANGS: Lang[] = ['EN', 'PA'];

export interface SnapshotDTO {
  activeCases: number;
  newCases: number;
  recovered: number;
  sForms: number;
  pForms: number;
  wqi: number;
  turbidity: number;
}

export interface StockDTO {
  ors: number;
  zinc: number;
  antibiotics: number;
}

export interface BlockDTO {
  id: string;
  name: string;
  namePa: string;
  phc: string;
  population: number;
  position: [number, number];
  area: [number, number];
  snapshots: Record<TimeKey, SnapshotDTO>;
  stock: Record<TimeKey, StockDTO>;
}

export interface AggregateDTO {
  window: TimeKey;
  activeCases: number;
  newCases: number;
  recovered: number;
  sForms: number;
  pForms: number;
  avgWqi: number;
  counts: Record<Status, number>;
  worstBlockId: string | null;
}
