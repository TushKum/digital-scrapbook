import type { SnapshotDTO, Status } from '../types';

// Pure status-classification logic (no IO) — unit-tested in server/tests.
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

// Block status = the more severe of the water-quality and caseload signals.
export function snapshotStatus(s: SnapshotDTO): Status {
  const a = wqiStatus(s.wqi);
  const b = caseStatus(s.activeCases);
  return RANK[a] >= RANK[b] ? a : b;
}
