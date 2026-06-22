// ──────────────────────────────────────────────────────────────────────────
// Shared client-side types for the Patiala district surveillance dataset.
// The data itself is now served by the NEERVANA backend API (see src/lib/api.ts
// and server/). This module only holds the type contract plus presentation-only
// map constants.
// ──────────────────────────────────────────────────────────────────────────

export type TimeKey = '24h' | '7d' | 'epi22';

export interface BlockSnapshot {
  activeCases: number; // ADD / suspected water-borne cases in window
  newCases: number;
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
