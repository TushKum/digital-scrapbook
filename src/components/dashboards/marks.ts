// Non-component constants for the dashboard dataviz primitives, split out of
// shared.tsx so that file exports only components (React Fast Refresh rule).
import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, OctagonAlert, ShieldCheck } from 'lucide-react';
import type { Status } from '../../lib/metrics';

// Distinct silhouette per status — the primary non-colour differentiator.
// safe(green) and critical(red) are lightness-identical (contrast 1.05), so
// shape (not colour) must carry state.
export const STATUS_ICON: Record<Status, LucideIcon> = {
  safe: ShieldCheck, // rounded shield
  warning: AlertTriangle, // triangle
  critical: OctagonAlert, // octagon
};

// AA-safe text colours on white / status tint (raw saffron #FF9933 is 2.13:1).
export const STATUS_TEXT: Record<Status, string> = {
  safe: '#138808', // 4.61:1
  warning: '#e07e1d', // saffron.dark
  critical: '#DC2626', // 4.83:1
};

export const NAVY = '#003366';
