import { AlertTriangle, Droplets, Activity, PackageCheck, ArrowRight } from 'lucide-react';
import type { Block, TimeKey } from '../../data/blocks';
import type { Lang, Strings } from '../../lib/i18n';
import {
  blockName,
  caseStatus,
  fmt,
  snapshot,
  snapshotStatus,
  stockFor,
  STATUS_COLOR,
  STATUS_TINT,
  statusLabel,
  wqiStatus,
  type Status,
} from '../../lib/metrics';

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

const RANK: Record<Status, number> = { safe: 0, warning: 1, critical: 2 };

// Cases per 100,000 population. Shown for comparability between blocks whose
// populations differ by 3x; the status thresholds themselves are unchanged and
// still read absolute counts, which the footnote states plainly.
function caseRate(cases: number, population: number): number {
  return population > 0 ? (cases / population) * 100000 : 0;
}

/**
 * Which signal put this block where it is. The dashboard previously showed a
 * status colour with no explanation, so an officer could not tell a water
 * problem from a caseload problem without opening two other panels.
 */
function driverOf(wqi: Status, cases: Status, str: Strings): string {
  if (wqi !== 'safe' && cases !== 'safe') return str.driverBoth;
  if (wqi !== 'safe') return str.driverWater;
  if (cases !== 'safe') return str.driverCases;
  return str.driverNone;
}

function actionsFor(wqi: Status, cases: Status, lowStock: number, str: Strings): string[] {
  const out: string[] = [];
  if (wqi !== 'safe') out.push(str.actChlorinate);
  if (cases !== 'safe') out.push(str.actTeam);
  if (lowStock < 40) out.push(str.actRestock);
  return out.length ? out : [str.actMonitor];
}

type Row = {
  block: Block;
  status: Status;
  wqiSt: Status;
  caseSt: Status;
  wqi: number;
  cases: number;
  rate: number;
  lowStock: number;
};

function buildRows(blocks: Block[], time: TimeKey): Row[] {
  return blocks
    .map((block) => {
      const s = snapshot(block, time);
      const st = stockFor(block, time);
      return {
        block,
        status: snapshotStatus(s),
        wqiSt: wqiStatus(s.wqi),
        caseSt: caseStatus(s.activeCases),
        wqi: s.wqi,
        cases: s.activeCases,
        rate: caseRate(s.activeCases, block.population),
        lowStock: Math.min(st.ors, st.zinc, st.antibiotics),
      };
    })
    .sort((a, b) => RANK[b.status] - RANK[a.status] || b.rate - a.rate);
}

/**
 * Centre column — replaces the 3D scene. The scene rendered six tiles at
 * arbitrary coordinates (Block.position is a layout offset, not a geolocation),
 * so it implied a spatial relationship the data does not carry. This ranks the
 * same blocks by how much attention they need and says why.
 */
export default function ResponseBoard({
  blocks,
  time,
  lang,
  str,
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: Props) {
  const rows = buildRows(blocks, time);
  if (!rows.length) return null;

  const [lead, ...rest] = rows;
  const counts = rows.reduce(
    (acc, r) => ({ ...acc, [r.status]: acc[r.status] + 1 }),
    { safe: 0, warning: 0, critical: 0 } as Record<Status, number>,
  );

  return (
    <section className="gov-panel flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-4 border-b border-gray-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded bg-navy-tint text-navy">
            <AlertTriangle className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <h2 className="text-[13px] font-bold text-navy">{str.boardTitle}</h2>
            <p className="gov-eyebrow">{str.boardSub}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {(['critical', 'warning', 'safe'] as Status[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-[11px] font-semibold text-ink">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: STATUS_COLOR[s] }}
                aria-hidden="true"
              />
              {counts[s]} {statusLabel(s, str)}
            </span>
          ))}
        </div>
      </header>

      <div className="gov-scroll flex-1 overflow-y-auto p-4">
        {/* Lead block — the one that needs attention first. */}
        <button
          type="button"
          onClick={() => onSelect(selectedId === lead.block.id ? null : lead.block.id)}
          onMouseEnter={() => onHover(lead.block.id)}
          onMouseLeave={() => onHover(null)}
          className="gov-focus block w-full rounded-lg border-2 text-left transition-shadow hover:shadow-float"
          style={{
            borderColor: STATUS_COLOR[lead.status],
            backgroundColor: STATUS_TINT[lead.status],
          }}
        >
          <div className="flex items-start justify-between gap-4 px-4 pt-3.5">
            <div>
              <p className="gov-eyebrow">
                {str.boardRank} 1 · {lead.block.phc}
              </p>
              <h3 className="mt-0.5 text-2xl font-extrabold leading-tight text-navy">
                {blockName(lead.block, lang)}
              </h3>
            </div>
            <span
              className="shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: STATUS_COLOR[lead.status] }}
            >
              {statusLabel(lead.status, str)}
            </span>
          </div>

          <p className="px-4 pt-2 text-[12px] font-semibold text-ink">
            <span className="text-muted">{str.driverLabel}: </span>
            {driverOf(lead.wqiSt, lead.caseSt, str)}
          </p>

          <dl className="mt-3 grid grid-cols-4 gap-px border-y border-gray-200 bg-gray-200">
            <Metric icon={<Droplets className="h-3.5 w-3.5" />} label={str.colWqi} value={String(lead.wqi)} tone={lead.wqiSt} />
            <Metric icon={<Activity className="h-3.5 w-3.5" />} label={str.colCases} value={fmt(lead.cases)} tone={lead.caseSt} />
            <Metric label={str.caseRate} value={Math.round(lead.rate).toLocaleString('en-IN')} sub={str.perLakh} />
            <Metric
              icon={<PackageCheck className="h-3.5 w-3.5" />}
              label={str.lowestStock}
              value={`${lead.lowStock}%`}
              tone={lead.lowStock < 40 ? 'critical' : lead.lowStock < 70 ? 'warning' : 'safe'}
            />
          </dl>

          <div className="flex flex-wrap items-center gap-1.5 px-4 py-3">
            <span className="gov-eyebrow">{str.recommended}</span>
            {actionsFor(lead.wqiSt, lead.caseSt, lead.lowStock, str).map((a) => (
              <span
                key={a}
                className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-navy shadow-panel"
              >
                <ArrowRight className="h-3 w-3" aria-hidden="true" />
                {a}
              </span>
            ))}
          </div>
        </button>

        {/* Everything else, same ordering. */}
        <ul className="mt-3 space-y-1.5">
          {rest.map((r, i) => {
            const active = selectedId === r.block.id || hoveredId === r.block.id;
            return (
              <li key={r.block.id}>
                <button
                  type="button"
                  onClick={() => onSelect(selectedId === r.block.id ? null : r.block.id)}
                  onMouseEnter={() => onHover(r.block.id)}
                  onMouseLeave={() => onHover(null)}
                  className={`gov-focus flex w-full flex-col gap-2 rounded-md border px-3 py-2.5 text-left transition-colors sm:grid sm:grid-cols-[2rem_1fr_auto] sm:items-center sm:gap-3 ${
                    active ? 'border-navy bg-navy-tint' : 'border-gray-200 bg-white hover:bg-panel'
                  }`}
                >
                  {/* Rank + identity. On a phone these share one flex row and the
                      name gets the full width (no truncation). At sm+ the wrapper
                      dissolves (display:contents) so rank and name become the
                      first two grid columns of the original single-row layout. */}
                  <span className="flex min-w-0 items-start gap-2.5 sm:contents">
                    <span className="text-[13px] font-bold tabular-nums text-muted">{i + 2}</span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: STATUS_COLOR[r.status] }}
                          aria-hidden="true"
                        />
                        <span className="text-[13px] font-bold leading-tight text-navy">
                          {blockName(r.block, lang)}
                        </span>
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-tight text-muted">
                        {driverOf(r.wqiSt, r.caseSt, str)}
                      </span>
                    </span>
                  </span>

                  <span className="flex items-center justify-between gap-4 tabular-nums sm:justify-end sm:text-right">
                    <Mini label={str.colWqi} value={String(r.wqi)} tone={r.wqiSt} />
                    <Mini
                      label={str.perLakh}
                      value={Math.round(r.rate).toLocaleString('en-IN')}
                    />
                    <Mini
                      label={str.lowestStock}
                      value={`${r.lowStock}%`}
                      tone={r.lowStock < 40 ? 'critical' : r.lowStock < 70 ? 'warning' : 'safe'}
                    />
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <p className="mt-3 text-[11px] leading-relaxed text-muted">{str.rateFootnote}</p>
      </div>
    </section>
  );
}

function Metric({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  tone?: Status;
}) {
  return (
    <div className="bg-white px-3 py-2.5">
      <dt className="gov-eyebrow flex items-center gap-1">
        {icon}
        {label}
      </dt>
      <dd
        className="mt-0.5 text-xl font-extrabold tabular-nums leading-none"
        style={{ color: tone ? STATUS_COLOR[tone] : '#003366' }}
      >
        {value}
      </dd>
      {sub && <p className="mt-0.5 text-[10px] text-muted">{sub}</p>}
    </div>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone?: Status }) {
  return (
    <span className="block">
      <span className="gov-eyebrow block">{label}</span>
      <span
        className="block text-[13px] font-bold leading-none"
        style={{ color: tone ? STATUS_COLOR[tone] : '#1f2937' }}
      >
        {value}
      </span>
    </span>
  );
}
