// ──────────────────────────────────────────────────────────────────────────
// Derivation helpers — status classification, official colour mapping, KPI
// aggregation and 3D marker normalisation shared by the scene and the panels.
// ──────────────────────────────────────────────────────────────────────────
import type { Block, BlockSnapshot, StockLevel, TimeKey } from '../data/blocks';
import type { Lang, Strings } from './i18n';

export type Status = 'safe' | 'warning' | 'critical';

export const STATUS_COLOR: Record<Status, string> = {
  safe: '#138808', // India green
  warning: '#FF9933', // saffron
  critical: '#DC2626', // red
};

export const STATUS_TINT: Record<Status, string> = {
  safe: '#e7f4e5',
  warning: '#fff3e6',
  critical: '#fde8e8',
};

const RANK: Record<Status, number> = { safe: 0, warning: 1, critical: 2 };

export function wqiStatus(wqi: number): Status {
  if (wqi >= 70) return 'safe';
  if (wqi >= 45) return 'warning';
  return 'critical';
}

export function caseStatus(cases: number): Status {
  if (cases >= 120) return 'critical';
  if (cases >= 50) return 'warning';
  return 'safe';
}

// Block status = the more severe of water-quality and caseload signals.
export function snapshotStatus(s: BlockSnapshot): Status {
  const a = wqiStatus(s.wqi);
  const b = caseStatus(s.activeCases);
  return RANK[a] >= RANK[b] ? a : b;
}

export function statusLabel(status: Status, str: Strings): string {
  if (status === 'safe') return str.statusSafe;
  if (status === 'warning') return str.statusWarning;
  return str.statusCritical;
}

export function stockStatus(pct: number): Status {
  if (pct >= 70) return 'safe';
  if (pct >= 40) return 'warning';
  return 'critical';
}

// Safe snapshot accessor.
export function snapshot(block: Block, time: TimeKey): BlockSnapshot {
  return block.snapshots[time];
}
export function stockFor(block: Block, time: TimeKey): StockLevel {
  return block.stock[time];
}

export function blockName(block: Block, lang: Lang): string {
  return lang === 'PA' ? block.namePa : block.name;
}

// Normalised 0..1 caseload used to drive 3D marker height.
const MAX_CASES_REF = 160;
export function caseIntensity(s: BlockSnapshot): number {
  return Math.min(1, s.activeCases / MAX_CASES_REF);
}

export interface Aggregate {
  activeCases: number;
  newCases: number;
  recovered: number;
  sForms: number;
  pForms: number;
  avgWqi: number;
  counts: Record<Status, number>;
  worst: Block | null;
}

export function aggregate(blocks: Block[], time: TimeKey): Aggregate {
  let activeCases = 0;
  let newCases = 0;
  let recovered = 0;
  let sForms = 0;
  let pForms = 0;
  let wqiSum = 0;
  const counts: Record<Status, number> = { safe: 0, warning: 0, critical: 0 };
  let worst: Block | null = null;
  let worstScore = -1;

  for (const b of blocks) {
    const s = snapshot(b, time);
    activeCases += s.activeCases;
    newCases += s.newCases;
    recovered += s.recovered;
    sForms += s.sForms;
    pForms += s.pForms;
    wqiSum += s.wqi;
    counts[snapshotStatus(s)] += 1;

    const score = s.activeCases + (100 - s.wqi) * 1.5;
    if (score > worstScore) {
      worstScore = score;
      worst = b;
    }
  }

  const n = blocks.length || 1;
  return {
    activeCases,
    newCases,
    recovered,
    sForms,
    pForms,
    avgWqi: wqiSum / n,
    counts,
    worst,
  };
}

export function fmt(n: number): string {
  return n.toLocaleString('en-IN');
}
