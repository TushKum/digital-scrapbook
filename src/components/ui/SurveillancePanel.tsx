import { ClipboardList } from 'lucide-react';
import type { Block, TimeKey } from '../../data/blocks';
import type { Lang, Strings } from '../../lib/i18n';
import type { Aggregate } from '../../lib/metrics';
import {
  blockName,
  fmt,
  snapshot,
  snapshotStatus,
  STATUS_COLOR,
  statusLabel,
  wqiStatus,
} from '../../lib/metrics';

interface Props {
  blocks: Block[];
  time: TimeKey;
  lang: Lang;
  str: Strings;
  agg: Aggregate;
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (id: string | null) => void;
  onHover: (id: string | null) => void;
}

// Left panel — IDSP S & P form ledger with the official tabular look:
// thin borders, alternating rows, status chips.
export default function SurveillancePanel({
  blocks,
  time,
  lang,
  str,
  agg,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  return (
    <section className="gov-panel flex h-full w-[21rem] flex-col overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-200 px-3.5 py-2.5">
        <span className="grid h-7 w-7 place-items-center rounded bg-navy-tint text-navy">
          <ClipboardList className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <h2 className="text-[13px] font-bold text-navy">{str.surveillanceTitle}</h2>
          <p className="gov-eyebrow">{str.surveillanceSub}</p>
        </div>
      </div>

      <div className="gov-scroll flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-panel">
            <tr className="text-[10px] uppercase tracking-wide text-muted">
              <th className="border-b border-gray-200 px-3 py-2 font-semibold">{str.colBlock}</th>
              <th className="border-b border-gray-200 px-1 py-2 text-center font-semibold">{str.colS}</th>
              <th className="border-b border-gray-200 px-1 py-2 text-center font-semibold">{str.colP}</th>
              <th className="border-b border-gray-200 px-1 py-2 text-center font-semibold">{str.colCases}</th>
              <th className="border-b border-gray-200 px-1 py-2 text-center font-semibold">{str.colWqi}</th>
              <th className="border-b border-gray-200 px-2 py-2 text-center font-semibold">{str.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b, i) => {
              const s = snapshot(b, time);
              const status = snapshotStatus(s);
              const isActive = selectedId === b.id || hoveredId === b.id;
              return (
                <tr
                  key={b.id}
                  onClick={() => onSelect(selectedId === b.id ? null : b.id)}
                  onMouseEnter={() => onHover(b.id)}
                  onMouseLeave={() => onHover(null)}
                  className={`cursor-pointer text-[12px] transition-colors ${
                    isActive ? 'bg-navy-tint' : i % 2 === 0 ? 'bg-white' : 'bg-panel'
                  } hover:bg-navy-tint`}
                  style={isActive ? { boxShadow: `inset 3px 0 0 0 ${STATUS_COLOR[status]}` } : undefined}
                >
                  <td className="border-b border-gray-100 px-3 py-2 font-semibold text-ink">
                    {blockName(b, lang)}
                    <span className="block text-[9px] font-normal text-muted">{b.phc}</span>
                  </td>
                  <td className="border-b border-gray-100 px-1 py-2 text-center tabular-nums text-ink">{s.sForms}</td>
                  <td className="border-b border-gray-100 px-1 py-2 text-center tabular-nums text-ink">{s.pForms}</td>
                  <td className="border-b border-gray-100 px-1 py-2 text-center font-semibold tabular-nums text-ink">{s.activeCases}</td>
                  <td
                    className="border-b border-gray-100 px-1 py-2 text-center font-semibold tabular-nums"
                    style={{ color: STATUS_COLOR[wqiStatus(s.wqi)] }}
                  >
                    {s.wqi}
                  </td>
                  <td className="border-b border-gray-100 px-2 py-2 text-center">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
                      style={{ background: `${STATUS_COLOR[status]}1a`, color: STATUS_COLOR[status] }}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_COLOR[status] }} />
                      {statusLabel(status, str)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-navy text-[12px] font-bold text-white">
              <td className="px-3 py-2 uppercase tracking-wide">{str.totals}</td>
              <td className="px-1 py-2 text-center tabular-nums">{agg.sForms}</td>
              <td className="px-1 py-2 text-center tabular-nums">{agg.pForms}</td>
              <td className="px-1 py-2 text-center tabular-nums">{fmt(agg.activeCases)}</td>
              <td className="px-1 py-2 text-center tabular-nums">{Math.round(agg.avgWqi)}</td>
              <td className="px-2 py-2 text-center text-[9px]">{blocks.length} {str.colBlock}s</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  );
}
