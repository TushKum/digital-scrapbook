// ──────────────────────────────────────────────────────────────────────────
// Shared, design-system-native dataviz primitives for the ASHA + villager
// dashboards. Colour rules (computed, not eyeballed):
//  · Status = reserved palette + a DISTINCT ICON SHAPE + text label. safe(green)
//    and critical(red) are lightness-identical (contrast 1.05) so colour alone
//    never encodes status — shape carries it.
//  · Status TEXT uses AA-safe tones: saffron text is #e07e1d (raw #FF9933 is
//    only 2.13:1 on white). Dots/fills keep the canonical STATUS_COLOR.
//  · Magnitude marks are single-hue navy; thin bars, 4px rounded ends anchored
//    to the baseline, direct value labels.
// ──────────────────────────────────────────────────────────────────────────
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Status } from '../../lib/metrics';
import { STATUS_COLOR, STATUS_TINT, stockStatus } from '../../lib/metrics';
import { NAVY, STATUS_ICON, STATUS_TEXT } from './marks';

/** Status chip: tint fill + shape icon + label. Never colour-alone. */
export function StatusPill({ status, label, size = 'sm' }: { status: Status; label: string; size?: 'sm' | 'lg' }) {
  const Icon = STATUS_ICON[status];
  const lg = size === 'lg';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold uppercase ${
        lg ? 'px-3 py-1 text-xs' : 'px-2 py-0.5 text-[10px]'
      }`}
      style={{ background: STATUS_TINT[status], color: STATUS_TEXT[status] }}
    >
      <Icon className={lg ? 'h-4 w-4' : 'h-3 w-3'} style={{ color: STATUS_COLOR[status] }} aria-hidden="true" />
      {label}
    </span>
  );
}

/** Stat tile — a headline number, no plot. Optional status tone colours value. */
export function MetricTile({
  icon: Icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: Status;
}) {
  return (
    <div className="gov-panel px-4 py-3.5">
      <div className="flex items-center gap-1.5 text-muted">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="gov-eyebrow">{label}</span>
        {tone
          ? (() => {
              const S = STATUS_ICON[tone];
              return <S className="ml-auto h-3.5 w-3.5" style={{ color: STATUS_COLOR[tone] }} aria-hidden="true" />;
            })()
          : null}
      </div>
      <p
        className="mt-1.5 text-2xl font-extrabold tabular-nums tracking-tight text-navy"
        style={tone ? { color: STATUS_TEXT[tone] } : undefined}
      >
        {value}
      </p>
      {sub ? <p className="mt-0.5 text-[11px] leading-4 text-muted">{sub}</p> : null}
    </div>
  );
}

export interface BarRow {
  label: string;
  sub?: string;
  value: number;
  hint?: string;
}

/** Horizontal magnitude bars — single-hue navy, rounded ends, direct labels.
 *  Identity/magnitude by row; state (if any) is shown separately as a chip. */
export function HBarList({ rows, unit }: { rows: BarRow[]; unit?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul className="space-y-2.5">
      {rows.map((r) => (
        <li
          key={r.label}
          className="grid grid-cols-[8rem_1fr_3rem] items-center gap-2.5"
          title={r.hint ?? `${r.label}: ${r.value}${unit ? ' ' + unit : ''}`}
        >
          <span className="truncate text-[12px] font-semibold text-ink">
            {r.label}
            {r.sub ? <span className="ml-1 text-[10px] font-normal text-muted">{r.sub}</span> : null}
          </span>
          <span className="h-2.5 w-full rounded-full bg-gray-200">
            <span
              className="block h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(3, (r.value / max) * 100)}%`, background: NAVY }}
            />
          </span>
          <span className="text-right text-[12px] font-bold tabular-nums text-navy">{r.value}</span>
        </li>
      ))}
    </ul>
  );
}

export interface TrendPoint {
  label: string;
  value: number; // 0..100 (WQI)
}

/** WQI trend across reporting windows — a comparable 0..100 index, so a line
 *  over discrete windows is honest. 2px navy line, single-hue navy markers
 *  (state is read off the Y-position against the dashed safe/advisory threshold
 *  guides, not marker colour), direct labels. */
export function WqiTrend({ points }: { points: TrendPoint[] }) {
  const W = 320;
  const H = 108;
  const padX = 28;
  const padTop = 16;
  const padBot = 24;
  const x = (i: number) => padX + (points.length > 1 ? (i / (points.length - 1)) * (W - 2 * padX) : (W - 2 * padX) / 2);
  const y = (v: number) => padTop + (1 - v / 100) * (H - padTop - padBot);
  const d = points.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Water Quality Index across reporting windows (0 to 100, higher is cleaner)">
      {/* recessive threshold guides: safe ≥70, advisory ≥45 */}
      {[70, 45].map((t) => (
        <g key={t}>
          <line x1={padX} x2={W - padX} y1={y(t)} y2={y(t)} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="3 3" />
          <text x={W - padX + 2} y={y(t) + 3} fontSize="7" fill="#9aa4b2" textAnchor="start">{t}</text>
        </g>
      ))}
      <path d={d} fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p, i) => (
        <g key={p.label}>
          <circle cx={x(i)} cy={y(p.value)} r="4.5" fill={NAVY} stroke="#fff" strokeWidth="2">
            <title>{`${p.label}: WQI ${p.value}`}</title>
          </circle>
          <text x={x(i)} y={y(p.value) - 8} fontSize="9" fontWeight="700" fill={NAVY} textAnchor="middle">{p.value}</text>
          <text x={x(i)} y={H - 8} fontSize="8" fill="#6b7280" textAnchor="middle">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

/** Stock meter — % of buffer stock, status-coloured fill + AA-safe label,
 *  mirrors ResourcePanel's StockBar idiom. */
export function StockMeter({ label, pct }: { label: string; pct: number }) {
  const st = stockStatus(pct);
  const StIcon = STATUS_ICON[st];
  return (
    <div className="mb-1.5 last:mb-0">
      <div className="mb-0.5 flex items-center justify-between text-[10px]">
        <span className="font-medium text-ink">{label}</span>
        <span className="flex items-center gap-1 font-bold tabular-nums" style={{ color: STATUS_TEXT[st] }}>
          <StIcon className="h-3 w-3" style={{ color: STATUS_COLOR[st] }} aria-hidden="true" />
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: STATUS_COLOR[st] }} />
      </div>
    </div>
  );
}
