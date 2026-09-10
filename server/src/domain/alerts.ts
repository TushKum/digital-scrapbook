// Alert accountability workflow — pure domain logic + serialization.
// Stages advance in a fixed order; each has exactly one valid next action.

export const ALERT_STAGES = ['acknowledge', 'assign', 'act', 'verify', 'close'] as const;
export type AlertAction = (typeof ALERT_STAGES)[number];
export type AlertStatus = 'open' | 'acknowledged' | 'assigned' | 'acting' | 'verifying' | 'closed';

// action -> resulting status
export const STATUS_AFTER: Record<AlertAction, AlertStatus> = {
  acknowledge: 'acknowledged',
  assign: 'assigned',
  act: 'acting',
  verify: 'verifying',
  close: 'closed',
};

// current status -> the only valid next action (undefined once closed)
export const NEXT_ACTION: Record<AlertStatus, AlertAction | undefined> = {
  open: 'acknowledge',
  acknowledged: 'assign',
  assigned: 'act',
  acting: 'verify',
  verifying: 'close',
  closed: undefined,
};

export interface ResponseEventDTO {
  id: string;
  action: string;
  actor: string;
  note: string | null;
  at: string;
}

export interface AlertDTO {
  id: string;
  blockId: string;
  level: string;
  driver: string;
  riskScore: number;
  status: AlertStatus;
  raisedAt: string;
  closedAt: string | null;
  provenance: string;
  events: ResponseEventDTO[];
}

interface AlertRow {
  id: string;
  blockId: string;
  level: string;
  driver: string;
  riskScore: number;
  status: string;
  raisedAt: Date;
  closedAt: Date | null;
  provenance: string;
  events: { id: string; action: string; actor: string; note: string | null; at: Date }[];
}

export function toAlertDTO(r: AlertRow): AlertDTO {
  return {
    id: r.id,
    blockId: r.blockId,
    level: r.level,
    driver: r.driver,
    riskScore: r.riskScore,
    status: r.status as AlertStatus,
    raisedAt: r.raisedAt.toISOString(),
    closedAt: r.closedAt ? r.closedAt.toISOString() : null,
    provenance: r.provenance,
    events: r.events.map((e) => ({
      id: e.id,
      action: e.action,
      actor: e.actor,
      note: e.note,
      at: e.at.toISOString(),
    })),
  };
}
