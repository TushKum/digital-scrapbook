import { Boxes, Package, Pill, Syringe } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Block, TimeKey } from '../../data/blocks';
import type { Lang, Strings } from '../../lib/i18n';
import { blockName, STATUS_COLOR, stockFor, stockStatus } from '../../lib/metrics';

interface Props {
  blocks: Block[];
  time: TimeKey;
  lang: Lang;
  str: Strings;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

// Right panel — PHC-wise essential-medicine stockpile gauges with a district
// summary header.
export default function ResourcePanel({
  blocks,
  time,
  lang,
  str,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  const n = blocks.length || 1;
  const avg = blocks.reduce(
    (acc, b) => {
      const s = stockFor(b, time);
      acc.ors += s.ors;
      acc.zinc += s.zinc;
      acc.antibiotics += s.antibiotics;
      return acc;
    },
    { ors: 0, zinc: 0, antibiotics: 0 },
  );

  return (
    <section className="gov-panel flex h-full w-[21rem] flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-200 px-3.5 py-2.5">
        <span className="grid h-7 w-7 place-items-center rounded bg-navy-tint text-navy">
          <Package className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <h2 className="text-[13px] font-bold text-navy">{str.resourceTitle}</h2>
          <p className="gov-eyebrow">{str.resourceSub}</p>
        </div>
      </div>

      {/* district summary */}
      <div className="grid grid-cols-3 gap-px border-b border-gray-200 bg-gray-100">
        <Summary icon={<Boxes className="h-3.5 w-3.5" />} label={str.ors} pct={avg.ors / n} />
        <Summary icon={<Pill className="h-3.5 w-3.5" />} label={str.zinc} pct={avg.zinc / n} />
        <Summary icon={<Syringe className="h-3.5 w-3.5" />} label={str.antibiotics} pct={avg.antibiotics / n} />
      </div>

      <div className="gov-scroll flex-1 space-y-2 overflow-y-auto p-2.5">
        {blocks.map((b) => {
          const s = stockFor(b, time);
          const isActive = selectedId === b.id || hoveredId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => onSelect(selectedId === b.id ? null : b.id)}
              onMouseEnter={() => onHover(b.id)}
              onMouseLeave={() => onHover(null)}
              className={`block w-full rounded-md border p-2.5 text-left transition-colors ${
                isActive ? 'border-navy/40 bg-navy-tint' : 'border-gray-200 bg-white hover:bg-panel'
              }`}
            >
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[12px] font-bold text-navy">{b.phc}</span>
                <span className="text-[10px] text-muted">{blockName(b, lang)}</span>
              </div>
              <StockBar label={str.ors} pct={s.ors} />
              <StockBar label={str.zinc} pct={s.zinc} />
              <StockBar label={str.antibiotics} pct={s.antibiotics} />
            </button>
          );
        })}
      </div>

      <div className="border-t border-gray-200 px-3.5 py-1.5">
        <div className="flex items-center justify-center gap-3 text-[9px] uppercase tracking-wide text-muted">
          <Legend color={STATUS_COLOR.safe} label="≥70%" />
          <Legend color={STATUS_COLOR.warning} label="40–69%" />
          <Legend color={STATUS_COLOR.critical} label="<40%" />
        </div>
      </div>
    </section>
  );
}

function StockBar({ label, pct }: { label: string; pct: number }) {
  const color = STATUS_COLOR[stockStatus(pct)];
  return (
    <div className="mb-1.5 last:mb-0">
      <div className="mb-0.5 flex items-center justify-between text-[10px]">
        <span className="font-medium text-ink">{label}</span>
        <span className="font-bold tabular-nums" style={{ color }}>
          {Math.round(pct)}%
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function Summary({ icon, label, pct }: { icon: ReactNode; label: string; pct: number }) {
  const color = STATUS_COLOR[stockStatus(pct)];
  return (
    <div className="bg-white px-2 py-2 text-center">
      <div className="flex items-center justify-center gap-1 text-muted">{icon}</div>
      <div className="mt-0.5 text-[15px] font-extrabold tabular-nums" style={{ color }}>
        {Math.round(pct)}%
      </div>
      <div className="text-[9px] font-medium uppercase tracking-wide text-muted">{label}</div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
