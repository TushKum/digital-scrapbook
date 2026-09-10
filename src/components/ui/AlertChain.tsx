import { useEffect, useState } from 'react';
import { ArrowRight, Check, CircleDot, Loader2, OctagonAlert, RotateCcw, ShieldCheck } from 'lucide-react';
import type { Lang } from '../../lib/i18n';
import { PRIMARY_ALERT, STAGE_LABEL, STAGE_ORDER, STATUS_INDEX } from '../../data/environmental';
import { advanceAlert, fetchAlerts, type AlertDTO } from '../../lib/api';

interface Props {
  lang: Lang;
  officerName?: string;
}

const STORAGE_KEY = `neervana.alert.${PRIMARY_ALERT.blockId}-2025w26`;

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
  times: string[];
}

function loadLocal(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw) as Progress;
      if (typeof p.done === 'number' && Array.isArray(p.times)) return p;
    }
  } catch {
    /* storage unavailable */
  }
  return { done: 0, times: [] };
}

function saveLocal(p: Progress) {
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

// Alert accountability chain. Prefers the live API (persists each step to the
// database, recording the signed-in officer); if the API/table isn't available
// it falls back to a local (localStorage) demo so the dashboard never breaks.
export default function AlertChain({ lang, officerName }: Props) {
  const meta = PRIMARY_ALERT;
  const [mode, setMode] = useState<'loading' | 'live' | 'local'>('loading');
  const [alert, setAlert] = useState<AlertDTO | null>(null);
  const [local, setLocal] = useState<Progress>(loadLocal);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    fetchAlerts()
      .then((list) => {
        if (!active) return;
        if (list.length > 0) {
          setAlert(list[0]);
          setMode('live');
        } else {
          setMode('local');
        }
      })
      .catch(() => {
        if (active) setMode('local');
      });
    return () => {
      active = false;
    };
  }, []);

  const live = mode === 'live' && alert !== null;
  const done = live ? STATUS_INDEX[alert!.status] ?? 0 : local.done;
  const closed = done >= STAGE_ORDER.length;
  const statusLabel = STATUS_BY_DONE[Math.min(done, STAGE_ORDER.length)][lang];
  const name = lang === 'PA' ? meta.blockNamePa : meta.blockName;
  const driver = lang === 'PA' ? meta.driverPa : meta.driverEn;

  const advance = async () => {
    if (done >= STAGE_ORDER.length || busy) return;
    const stage = STAGE_ORDER[done];
    if (live && alert) {
      setBusy(true);
      try {
        const updated = await advanceAlert(alert.id, stage, meta.chain[done].note);
        setAlert(updated);
      } catch {
        /* leave state unchanged on failure */
      } finally {
        setBusy(false);
      }
    } else {
      const next: Progress = { done: local.done + 1, times: [...local.times, new Date().toISOString()] };
      setLocal(next);
      saveLocal(next);
    }
  };

  const reset = () => {
    const cleared: Progress = { done: 0, times: [] };
    setLocal(cleared);
    saveLocal(cleared);
  };

  const statusTone = closed ? '#138808' : done === 0 ? '#6b7280' : '#e07e1d';

  // Per-stage completed info (actor + time + note) from the live event or local.
  const stepInfo = (i: number) => {
    if (live && alert && alert.events[i]) {
      const e = alert.events[i];
      return { time: e.at, actor: e.actor, note: e.note ?? (lang === 'PA' ? meta.chain[i].notePa : meta.chain[i].note) };
    }
    return {
      time: local.times[i],
      actor: officerName ?? (lang === 'PA' ? meta.chain[i].actorPa : meta.chain[i].actor),
      note: lang === 'PA' ? meta.chain[i].notePa : meta.chain[i].note,
    };
  };

  return (
    <div className="gov-panel border-2 border-critical/40 bg-white p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <OctagonAlert className="h-4 w-4 text-critical" aria-hidden="true" />
          <span className="text-[12px] font-bold text-navy">
            {lang === 'PA' ? 'ਅਲਰਟ ਤੇ ਕਾਰਵਾਈ' : 'Alert & response'}
          </span>
        </div>
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
            live ? 'bg-india-greenTint text-india-green' : 'bg-navy-tint text-navy'
          }`}
        >
          {mode === 'loading'
            ? '…'
            : live
              ? lang === 'PA'
                ? 'ਲਾਈਵ · ਡਾਟਾਬੇਸ'
                : 'LIVE · saved to DB'
              : lang === 'PA'
                ? 'ਡੈਮੋ · ਲੋਕਲ'
                : 'DEMO · local'}
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
          const isCurrent = i === done && !closed;
          const info = stepInfo(i);
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
                  {isDone && info.time && <span className="text-[9px] tabular-nums text-muted">{fmtTime(info.time)}</span>}
                </div>
                <div className={`text-[10px] ${isDone || isCurrent ? 'font-medium text-ink' : 'text-muted'}`}>
                  {isDone ? info.actor : lang === 'PA' ? meta.chain[i].actorPa : meta.chain[i].actor}
                </div>
                {(isDone || isCurrent) && (
                  <div className="text-[10px] text-muted">{info.note}</div>
                )}

                {isCurrent && (
                  <button
                    type="button"
                    onClick={advance}
                    disabled={busy}
                    className="gov-focus mt-1.5 inline-flex items-center gap-1.5 rounded-md bg-navy px-2.5 py-1 text-[11px] font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" /> : null}
                    {STAGE_LABEL[stage][lang]}
                    {!busy && <ArrowRight className="h-3 w-3" aria-hidden="true" />}
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
            {lang === 'PA' ? 'ਬੰਦ ਕੀਤਾ' : 'Closed'}
          </span>
        ) : (
          <span className="text-[10px] text-muted">
            {live
              ? lang === 'PA'
                ? 'ਹਰ ਕਦਮ ਡਾਟਾਬੇਸ ਵਿੱਚ ਸੰਭਾਲਿਆ ਜਾਂਦਾ ਹੈ'
                : 'Each step is saved to the database'
              : lang === 'PA'
                ? 'ਅਲਰਟ ਨੂੰ ਹਰ ਕਦਮ ਰਾਹੀਂ ਅੱਗੇ ਵਧਾਓ'
                : 'Advance the alert through each step'}
          </span>
        )}
        {!live && local.done > 0 && (
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
