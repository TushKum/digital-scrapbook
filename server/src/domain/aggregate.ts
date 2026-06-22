import type { AggregateDTO, BlockDTO, Status, TimeKey } from '../types';
import { snapshotStatus } from './status';

// Pure district-level aggregation over the block DTOs for a reporting window.
export function computeAggregate(blocks: BlockDTO[], window: TimeKey): AggregateDTO {
  let activeCases = 0;
  let newCases = 0;
  let recovered = 0;
  let sForms = 0;
  let pForms = 0;
  let wqiSum = 0;
  const counts: Record<Status, number> = { safe: 0, warning: 0, critical: 0 };
  let worstBlockId: string | null = null;
  let worstScore = -1;

  for (const b of blocks) {
    const s = b.snapshots[window];
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
      worstBlockId = b.id;
    }
  }

  const n = blocks.length || 1;
  return {
    window,
    activeCases,
    newCases,
    recovered,
    sForms,
    pForms,
    avgWqi: Math.round((wqiSum / n) * 10) / 10,
    counts,
    worstBlockId,
  };
}
