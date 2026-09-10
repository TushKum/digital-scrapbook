// Environmental + response data wired into the Command Centre dashboard.
// Rainfall = REAL (NASA POWER PRECTOTCORR, Patiala 30.34N/76.39E, weekly totals).
// Alert + response chain = rule-based / synthetic-demo reconstruction of the
// July 2025 Sanaur/Alipur-Arian event. Provenance is shown on-screen via badges;
// mirrors data/seed/rainfall_observations.csv and data/seed/reference_data.json.
import type { Lang } from '../lib/i18n';

export interface RainfallWeek {
  isoWeek: string;
  label: string;
  mm: number;
  onset?: boolean;
}

export const RAINFALL_WEEKLY: RainfallWeek[] = [
  { isoWeek: '2025-W22', label: 'W22', mm: 16.2 },
  { isoWeek: '2025-W23', label: 'W23', mm: 13.9 },
  { isoWeek: '2025-W24', label: 'W24', mm: 1.7 },
  { isoWeek: '2025-W25', label: 'W25', mm: 45.7 },
  { isoWeek: '2025-W26', label: 'W26', mm: 101.6, onset: true },
  { isoWeek: '2025-W27', label: 'W27', mm: 76.3 },
  { isoWeek: '2025-W28', label: 'W28', mm: 40.0 },
  { isoWeek: '2025-W29', label: 'W29', mm: 25.1 },
  { isoWeek: '2025-W30', label: 'W30', mm: 58.7 },
  { isoWeek: '2025-W31', label: 'W31', mm: 96.8 },
];

export type StageKey = 'acknowledge' | 'assign' | 'act' | 'verify' | 'close';

export const STAGE_ORDER: StageKey[] = ['acknowledge', 'assign', 'act', 'verify', 'close'];

export interface ResponseStep {
  stage: StageKey;
  actor: string;
  actorPa: string;
  note: string;
  notePa: string;
  at: string; // ISO
}

export interface PrimaryAlert {
  blockId: string;
  blockName: string;
  blockNamePa: string;
  level: 'watch' | 'advisory' | 'critical';
  driverEn: string;
  driverPa: string;
  riskScore: number;
  status: 'open' | 'acknowledged' | 'assigned' | 'acting' | 'verifying' | 'closed';
  raisedAt: string;
  chain: ResponseStep[];
}

export const PRIMARY_ALERT: PrimaryAlert = {
  blockId: 'sanaur',
  blockName: 'Sanaur',
  blockNamePa: 'ਸਨੌਰ',
  level: 'critical',
  driverEn: 'ORP collapse — sewage ingress',
  driverPa: 'ORP ਡਿੱਗਣਾ — ਸੀਵਰੇਜ ਰਲਾਵਟ',
  riskScore: 92,
  status: 'closed',
  raisedAt: '2025-06-27T09:00:00+05:30',
  chain: [
    { stage: 'acknowledge', actor: 'ANM, Sanaur sub-centre', actorPa: 'ਏਐਨਐਮ, ਸਨੌਰ', note: 'Source ORP < 300 mV flagged', notePa: 'ਸਰੋਤ ਤੇ ORP < 300 mV', at: '2025-06-27T10:30:00+05:30' },
    { stage: 'assign', actor: 'PHC MO, Sanaur', actorPa: 'ਪੀਐਚਸੀ ਐਮਓ, ਸਨੌਰ', note: 'RRT tasked; samples ordered', notePa: 'ਆਰਆਰਟੀ ਤਾਇਨਾਤ; ਨਮੂਨੇ', at: '2025-06-27T14:00:00+05:30' },
    { stage: 'act', actor: 'Rapid Response Team', actorPa: 'ਰੈਪਿਡ ਰਿਸਪਾਂਸ ਟੀਮ', note: 'Sewage cross-connection cut; chlorination', notePa: 'ਸੀਵਰ ਕੁਨੈਕਸ਼ਨ ਕੱਟਿਆ; ਕਲੋਰੀਨੇਸ਼ਨ', at: '2025-06-28T11:00:00+05:30' },
    { stage: 'verify', actor: 'District Public Health Lab', actorPa: 'ਜ਼ਿਲ੍ਹਾ ਲੈਬ', note: 'Re-test: ORP recovering > 600 mV', notePa: 'ਮੁੜ-ਜਾਂਚ: ORP > 600 mV', at: '2025-07-01T09:00:00+05:30' },
    { stage: 'close', actor: 'District Nodal Officer', actorPa: 'ਜ਼ਿਲ੍ਹਾ ਨੋਡਲ ਅਫ਼ਸਰ', note: 'Cleared; routine monitoring', notePa: 'ਹੱਲ; ਨਿਯਮਤ ਨਿਗਰਾਨੀ', at: '2025-07-01T12:00:00+05:30' },
  ],
};

// Map a persisted alert status to the number of completed stages.
export const STATUS_INDEX: Record<string, number> = {
  open: 0,
  acknowledged: 1,
  assigned: 2,
  acting: 3,
  verifying: 4,
  closed: 5,
};

export const STAGE_LABEL: Record<StageKey, Record<Lang, string>> = {
  acknowledge: { EN: 'Acknowledge', PA: 'ਪੁਸ਼ਟੀ' },
  assign: { EN: 'Assign', PA: 'ਸੌਂਪੋ' },
  act: { EN: 'Act', PA: 'ਕਾਰਵਾਈ' },
  verify: { EN: 'Verify', PA: 'ਤਸਦੀਕ' },
  close: { EN: 'Close', PA: 'ਬੰਦ' },
};
