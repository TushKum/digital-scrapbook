import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caseStatus, snapshotStatus, wqiStatus } from '../src/domain/status';
import { computeAggregate } from '../src/domain/aggregate';
import { toBlockDTO } from '../src/domain/serialize';
import { submitReportSchema, updateStockSchema, windowSchema } from '../src/schemas';
import type { BlockDTO, SnapshotDTO } from '../src/types';

const snap = (over: Partial<SnapshotDTO> = {}): SnapshotDTO => ({
  activeCases: 0,
  newCases: 0,
  recovered: 0,
  sForms: 0,
  pForms: 0,
  wqi: 90,
  turbidity: 1,
  ...over,
});

test('wqiStatus thresholds', () => {
  assert.equal(wqiStatus(85), 'safe');
  assert.equal(wqiStatus(60), 'warning');
  assert.equal(wqiStatus(30), 'critical');
});

test('caseStatus thresholds', () => {
  assert.equal(caseStatus(10), 'safe');
  assert.equal(caseStatus(60), 'warning');
  assert.equal(caseStatus(130), 'critical');
});

test('snapshotStatus takes the more severe signal', () => {
  // clean water but very high caseload → critical
  assert.equal(snapshotStatus(snap({ wqi: 95, activeCases: 140 })), 'critical');
  // safe caseload but poor water → critical
  assert.equal(snapshotStatus(snap({ wqi: 30, activeCases: 5 })), 'critical');
  assert.equal(snapshotStatus(snap({ wqi: 95, activeCases: 5 })), 'safe');
});

test('computeAggregate sums and classifies', () => {
  const blocks: BlockDTO[] = [
    {
      id: 'a', name: 'A', namePa: 'A', phc: 'PHC A', population: 1, position: [0, 0], area: [1, 1],
      snapshots: { '24h': snap(), '7d': snap(), epi22: snap({ activeCases: 140, wqi: 35, sForms: 10, pForms: 4 }) },
      stock: { '24h': { ors: 0, zinc: 0, antibiotics: 0 }, '7d': { ors: 0, zinc: 0, antibiotics: 0 }, epi22: { ors: 0, zinc: 0, antibiotics: 0 } },
    },
    {
      id: 'b', name: 'B', namePa: 'B', phc: 'PHC B', population: 1, position: [0, 0], area: [1, 1],
      snapshots: { '24h': snap(), '7d': snap(), epi22: snap({ activeCases: 10, wqi: 90, sForms: 6, pForms: 2 }) },
      stock: { '24h': { ors: 0, zinc: 0, antibiotics: 0 }, '7d': { ors: 0, zinc: 0, antibiotics: 0 }, epi22: { ors: 0, zinc: 0, antibiotics: 0 } },
    },
  ];
  const agg = computeAggregate(blocks, 'epi22');
  assert.equal(agg.activeCases, 150);
  assert.equal(agg.sForms, 16);
  assert.equal(agg.counts.critical, 1);
  assert.equal(agg.counts.safe, 1);
  assert.equal(agg.worstBlockId, 'a');
});

test('toBlockDTO reduces relational rows to keyed DTO', () => {
  const dto = toBlockDTO({
    id: 'x', name: 'X', namePa: 'ਐਕਸ', phc: 'PHC X', population: 100, posX: 1, posZ: 2, areaW: 3, areaD: 4,
    snapshots: [{ window: 'epi22', activeCases: 5, newCases: 1, recovered: 2, sForms: 3, pForms: 1, wqi: 70, turbidity: 2 }],
    stock: [{ window: 'epi22', ors: 50, zinc: 60, antibiotics: 70 }],
  });
  assert.deepEqual(dto.position, [1, 2]);
  assert.deepEqual(dto.area, [3, 4]);
  assert.equal(dto.snapshots.epi22.activeCases, 5);
  assert.equal(dto.stock.epi22.ors, 50);
  // missing windows default to zeroed snapshots
  assert.equal(dto.snapshots['24h'].activeCases, 0);
});

test('schema validation', () => {
  assert.equal(windowSchema.safeParse('epi22').success, true);
  assert.equal(windowSchema.safeParse('bogus').success, false);
  // requires at least one field
  assert.equal(submitReportSchema.safeParse({ window: 'epi22' }).success, false);
  assert.equal(submitReportSchema.safeParse({ window: 'epi22', sForms: 3 }).success, true);
  // stock percent bounds
  assert.equal(updateStockSchema.safeParse({ window: 'epi22', ors: 150 }).success, false);
  assert.equal(updateStockSchema.safeParse({ window: 'epi22', ors: 80 }).success, true);
});
