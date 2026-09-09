import { useState } from 'react';
import { ArrowRight, Check, CircleDot, OctagonAlert, RotateCcw, ShieldCheck } from 'lucide-react';
import type { Lang } from '../../lib/i18n';
import { PRIMARY_ALERT, STAGE_LABEL, STAGE_ORDER } from '../../data/environmental';

interface Props {
  lang: Lang;
  officerName?: string;
}

const STORAGE_KEY = `neervana.alert.${PRIMARY_ALERT.blockId}-2025w26`;

// status label indexed by number of completed stages (0 = open … 5 = closed)
const STATUS_BY_DONE: Record<Lang, string>[] = [
  { EN: 'Open', PA: 'ਖੁੱਲ੍ਹਾ' },
  { EN: 'Acknowledged', PA: 'ਪੁਸ਼ਟੀ ਹੋਈ' },
  { EN: 'Assigned', PA: 'ਸੌਂਪਿਆ' },
  { EN: 'Acting', PA: 'ਕਾਰਵਾਈ ਜਾਰੀ' },
  { EN: 'Verifying', PA: 'ਤਸਦੀਕ ਜਾਰੀ' },
  { EN: 'Closed', PA: 'ਬੰਦ' },
];

interface Progress {
  done: number;
  times: string[]; // ISO timestamp per completed stage
}

function load(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Progress;
      if (typeof p.done === 'number' && Array.isArray(p.times)) return p;
    }
  } catch {
    /* storage unavailable — start fresh */
  }
  return { done: 0, times: [] };
}

function save(p: Progress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// Interactive alert accountability chain. An officer advances the alert through
// acknowledge -> assign -> act -> verify -> close; each step stamps the real time
// (and signed-in officer) and persists to localStorage. Demo workflow — badge says so.
export default function AlertChain({ lang, officerName }: Props) {
  const a = PRIMARY_ALERT;
  const [progress, setProgress] = useState<Progress>(load);
  const { done, times } = progress;

  const name = lang === 'PA' ? a.blockNamePa : a.blockName;
  const driver = lang === 'PA' ? a.driverPa : a.driverEn;
  const closed = done >= STAGE_ORDER.length;
  const statusLabel = STATUS_BY_DONE[Math.min(done, STAGE_ORDER.length)][lang];

  const advance = () => {
    if (done >= STAGE_ORDER.length) return;
    const next: Progress = { done: done + 1, times: [...times, new Date().toISOString()] };
    setProgress(next);
    save(next);
  };
  const reset = () => {
    const cleared: Progress = { done: 0, times: [] };
    setProgress(cleared);
    save(cleared);
  };

  const statusTone = closed ? '#138808' : done === 0 ? '#6b7280' : '#e07e1d';

  return (
    <div className="gov-panel border-2 border-critical/40 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <OctagonAlert className="h-4 w-4 text-critical" aria-hidden="true" />
          <span className="text-[12px] font-bold text-navy">
            {lang === 'PA' ? 'ਅਲਰਟ ਤੇ ਕਾਰਵਾਈ' : 'Alert & response'}
          </span>
        </div>
        <span className="rounded-full bg-navy-tint px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-navy">
          {lang === 'PA' ? 'ਡੈਮੋ · ਇੰਟਰਐਕਟਿਵ' : 'DEMO · interactive'}
        </span>
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]">
        <span className="font-bold text-navy">{name}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-critical/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-critical">
          <OctagonAlert className="h-3 w-3" aria-hidden="true" />
          {lang === 'PA' ? 'ਗੰਭੀਰ' : 'Critical'}
        </span>
        <span className="text-muted">
          {lang === 'PA' ? 'ਕਾਰਨ' : 'Driver'}: <span className="font-semibold text-ink">{driver}</span>
        </span>
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
          style={{ backgroundColor: `${statusTone}1a`, color: statusTone }}
        >
          {closed ? <ShieldCheck className="h-3 w-3" aria-hidden="true" /> : <CircleDot className="h-3 w-3" aria-hidden="true" />}
          {statusLabel}
        </span>
      </div>

      <ol className="space-y-2.5">
        {STAGE_ORDER.map((stage, i) => {
          const isDone = i < done;
          const isCurrent = i === done;
          const step = a.chain[i];
          return (
            <li key={stage} className="flex gap-2.5">
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${
                  isDone ? 'bg-india-green text-white' : isCurrent ? 'bg-saffron text-white' : 'bg-gray-200 text-muted'
                }`}
              >
                {isDone ? <Check className="h-3 w-3" aria-hidden="true" /> : <span className="text-[10px] font-bold">{i + 1}</span>}
              </span>

              <div className="-mt-px min-w-0 flex-1 leading-tight">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className={`text-[11px] font-bold ${isDone || isCurrent ? 'text-navy' : 'text-muted'}`}>
                    {STAGE_LABEL[stage][lang]}
                  </span>
                  {isDone && <span className="text-[9px] tabular-nums text-muted">{fmtTime(times[i])}</span>}
                </div>
                <div className={`text-[10px] ${isDone || isCurrent ? 'font-medium text-ink' : 'text-muted'}`}>
                  {lang === 'PA' ? step.actorPa : step.actor}
                </div>
                {(isDone || isCurrent) && (
                  <div className="text-[10px] text-muted">{lang === 'PA' ? step.notePa : step.note}</div>
                )}
                {isDone && officerName && (
                  <div className="text-[9px] italic text-muted">
                    {lang === 'PA' ? 'ਰਿਕਾਰਡ' : 'logged by'}: {officerName}
                  </div>
                )}

                {isCurrent && (
                  <button
                    type="button"
                    onClick={advance}
                    className="gov-focus mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-navy px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-navy-light"
                  >
                    {STAGE_LABEL[stage][lang]}
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-2.5 flex items-center justify-between gap-2 border-t border-gray-200 pt-2">
        {closed ? (
          <span className="flex items-center gap-1.5 text-[10px] font-semibold text-india-green">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            {lang === 'PA' ? 'ਬੰਦ ਕੀਤਾ' : 'Closed'} · {fmtTime(times[times.length - 1])}
          </span>
        ) : (
          <span className="text-[10px] text-muted">
            {lang === 'PA' ? 'ਅਗਲਾ ਕਦਮ ਦਬਾਓ' : 'Advance the alert through each step'}
          </span>
        )}
        {done > 0 && (
          <button
            type="button"
            onClick={reset}
            className="gov-focus inline-flex items-center gap-1 rounded-md border border-gray-200 px-2 py-0.5 text-[10px] font-semibold text-muted transition-colors hover:border-navy/30 hover:text-navy"
          >
            <RotateCcw className="h-3 w-3" aria-hidden="true" />
            {lang === 'PA' ? 'ਰੀਸੈੱਟ' : 'Reset'}
          </button>
        )}
      </div>
    </div>
  );
}
