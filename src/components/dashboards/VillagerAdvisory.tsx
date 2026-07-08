import { useEffect, useMemo, useState } from 'react';
import {
  ChevronLeft,
  Droplets,
  Flame,
  Hand,
  HeartPulse,
  Hospital,
  MapPin,
  Pill,
  RefreshCw,
  Users,
} from 'lucide-react';
import { STRINGS } from '../../lib/i18n';
import { DASH } from '../../lib/dashboardStrings';
import type { Status } from '../../lib/metrics';
import { blockName, snapshot, snapshotStatus, statusLabel, STATUS_COLOR, STATUS_TINT } from '../../lib/metrics';
import { useBootstrap } from '../../hooks/useBootstrap';
import { usePublicChrome } from '../../hooks/usePublicChrome';
import TopUtilityBar from '../ui/TopUtilityBar';
import { STATUS_ICON, STATUS_TEXT } from './marks';
import { StatusPill } from './shared';

// "Today" = the freshest reporting window.
const NOW = '24h' as const;

// Guidance cards, keyed; priority set is status-driven.
const GUIDE = [
  { key: 'boil', icon: Flame, text: (d: (typeof DASH)['EN']) => d.boilWater },
  { key: 'ors', icon: Pill, text: (d: (typeof DASH)['EN']) => d.useOrs },
  { key: 'phc', icon: HeartPulse, text: (d: (typeof DASH)['EN']) => d.visitPhc },
  { key: 'wash', icon: Hand, text: (d: (typeof DASH)['EN']) => d.washHands },
] as const;

const PRIORITY: Record<Status, string[]> = {
  safe: ['wash'],
  warning: ['boil', 'ors'],
  critical: ['boil', 'phc', 'ors'],
};

const STATUS_ORDER: Status[] = ['safe', 'warning', 'critical'];

export default function VillagerAdvisory() {
  const chrome = usePublicChrome();
  const str = STRINGS[chrome.lang];
  const d = DASH[chrome.lang];
  const { status, blocks, error, reload } = useBootstrap(true);
  const [villageId, setVillageId] = useState<string | null>(null);

  useEffect(() => {
    const prev = document.title;
    document.title = 'Village Advisory · NEERVANA';
    return () => {
      document.title = prev;
    };
  }, []);

  const village = useMemo(() => blocks.find((b) => b.id === villageId) ?? null, [blocks, villageId]);

  return (
    <div className="gov-scroll flex min-h-screen w-screen flex-col overflow-y-auto bg-navy-tint">
      <TopUtilityBar
        str={str}
        textScale={chrome.textScale}
        onTextScale={chrome.setTextScale}
        contrast={chrome.contrast}
        onContrast={chrome.setContrast}
        lang={chrome.lang}
        onLang={chrome.setLang}
      />

      {/* Masthead with a big, obvious language switch for the low-literacy audience */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white px-4 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 bg-navy-tint">
              <Droplets className="h-6 w-6 text-navy" />
            </div>
            <div className="leading-tight">
              <p className="text-[16px] font-extrabold tracking-tight text-navy sm:text-[18px]">{d.villagerTitle}</p>
              <p className="text-[11px] text-muted">{str.district}</p>
            </div>
          </div>
          <div className="flex overflow-hidden rounded-lg border border-navy/20" role="group" aria-label={str.language}>
            {(['EN', 'PA'] as const).map((l) => (
              <button
                key={l}
                onClick={() => chrome.setLang(l)}
                aria-pressed={chrome.lang === l}
                className={`gov-focus px-3 py-2 text-sm font-bold transition-colors ${
                  chrome.lang === l ? 'bg-navy text-white' : 'bg-white text-navy hover:bg-navy-tint'
                }`}
              >
                {l === 'EN' ? 'English' : 'ਪੰਜਾਬੀ'}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-5 sm:px-6">
        {status === 'loading' && (
          <div className="grid place-items-center gap-3 py-20 text-center">
            <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-navy/20 border-t-navy" />
            <p className="text-base font-medium text-muted">{d.loadingMsg}</p>
          </div>
        )}

        {status === 'error' && (
          <div className="gov-panel mx-auto max-w-md p-6 text-center">
            <p className="text-base font-semibold text-ink">{d.errorMsg}</p>
            {error ? <p className="mt-1 text-[12px] text-muted">{error}</p> : null}
            <button
              onClick={reload}
              className="gov-focus mt-4 inline-flex items-center gap-2 rounded-md bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-light"
            >
              <RefreshCw className="h-4 w-4" />
              {d.retry}
            </button>
          </div>
        )}

        {status === 'ready' && !village && (
          <div className="animate-fade-in space-y-4">
            <div className="text-center">
              <h1 className="text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">{d.pickVillage}</h1>
              <p className="mt-1 text-sm text-muted">{d.pickHint}</p>
            </div>
            <ul className="grid gap-2.5 sm:grid-cols-2">
              {blocks.map((b) => {
                const st = snapshotStatus(snapshot(b, NOW));
                const Icon = STATUS_ICON[st];
                return (
                  <li key={b.id}>
                    <button
                      onClick={() => setVillageId(b.id)}
                      className="gov-focus flex w-full items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-4 py-4 text-left transition-colors hover:border-navy/40 hover:bg-panel"
                    >
                      <span className="flex items-center gap-3">
                        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full" style={{ background: STATUS_TINT[st] }}>
                          <Icon className="h-6 w-6" style={{ color: STATUS_COLOR[st] }} aria-hidden="true" />
                        </span>
                        <span className="leading-tight">
                          <span className="block text-[17px] font-extrabold text-navy">{blockName(b, chrome.lang)}</span>
                          <span className="block text-[12px] text-muted">{b.phc}</span>
                        </span>
                      </span>
                      <StatusPill status={st} label={statusLabel(st, STRINGS[chrome.lang])} />
                    </button>
                  </li>
                );
              })}
            </ul>
            <WorkerLink d={d} />
          </div>
        )}

        {status === 'ready' && village && (
          <VillageDetail
            key={village.id}
            name={blockName(village, chrome.lang)}
            phc={village.phc}
            statusValue={snapshotStatus(snapshot(village, NOW))}
            lang={chrome.lang}
            str={str}
            d={d}
            onBack={() => setVillageId(null)}
          />
        )}
      </main>
    </div>
  );
}

function VillageDetail({
  name,
  phc,
  statusValue,
  lang,
  str,
  d,
  onBack,
}: {
  name: string;
  phc: string;
  statusValue: Status;
  lang: 'EN' | 'PA';
  str: (typeof STRINGS)['EN'];
  d: (typeof DASH)['EN'];
  onBack: () => void;
}) {
  const BigIcon = STATUS_ICON[statusValue];
  const priority = new Set(PRIORITY[statusValue]);

  return (
    <div className="animate-fade-in space-y-4">
      <button
        onClick={onBack}
        className="gov-focus inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-navy hover:bg-panel"
      >
        <ChevronLeft className="h-4 w-4" />
        {d.changeVillage}
      </button>

      {/* Village name — the page's h1 on the detail view */}
      <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-navy">
        <MapPin className="h-5 w-5" aria-hidden="true" />
        {name}
      </h1>

      {/* Big status card — icon shape + big word + colour, plus a 3-step
          position indicator: status is never colour-alone. */}
      <div
        className="rounded-lg border-2 p-5 sm:p-6"
        style={{ background: STATUS_TINT[statusValue], borderColor: STATUS_COLOR[statusValue] }}
      >
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-white shadow-sm">
            <BigIcon className="h-9 w-9" style={{ color: STATUS_COLOR[statusValue] }} aria-hidden="true" />
          </span>
          <div>
            <p className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl" style={{ color: STATUS_TEXT[statusValue] }}>
              {d.headline[statusValue]}
            </p>
            <p className="mt-1 text-base leading-6 text-ink sm:text-lg">{d.guidance[statusValue]}</p>
          </div>
        </div>

        {/* Position indicator: safe → advisory → critical. Active step is
            dark-on-tint (AA-safe for advisory, unlike white-on-raw-saffron). */}
        <ol className="mt-5 grid grid-cols-3 gap-2" aria-label={str.colStatus}>
          {STATUS_ORDER.map((s) => {
            const Icon = STATUS_ICON[s];
            const active = s === statusValue;
            return (
              <li
                key={s}
                className={`flex flex-col items-center gap-1 rounded-lg border-2 py-2 text-center ${
                  active ? '' : 'border-gray-200 bg-white'
                }`}
                style={active ? { background: STATUS_TINT[s], borderColor: STATUS_COLOR[s] } : undefined}
                aria-current={active ? 'true' : undefined}
              >
                <Icon
                  className={`h-5 w-5 ${active ? '' : 'text-muted'}`}
                  style={active ? { color: STATUS_COLOR[s] } : undefined}
                  aria-hidden="true"
                />
                <span
                  className={`text-[11px] font-bold uppercase leading-none ${active ? '' : 'text-muted'}`}
                  style={active ? { color: STATUS_TEXT[s] } : undefined}
                >
                  {statusLabel(s, STRINGS[lang])}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Guidance cards, priority-emphasised by status */}
      <section>
        <h2 className="mb-2 text-lg font-bold text-navy">{d.guidanceTitle}</h2>
        <ul className="grid gap-2.5 sm:grid-cols-2">
          {GUIDE.map((g) => {
            const isPriority = priority.has(g.key);
            return (
              <li
                key={g.key}
                className={`flex items-center gap-3 rounded-lg border-2 bg-white px-4 py-4 ${
                  isPriority ? '' : 'border-gray-200'
                }`}
                style={isPriority ? { borderColor: STATUS_COLOR[statusValue], background: STATUS_TINT[statusValue] } : undefined}
              >
                <span
                  className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${isPriority ? 'bg-white' : 'bg-navy-tint'}`}
                >
                  <g.icon className="h-6 w-6 text-navy" style={isPriority ? { color: STATUS_COLOR[statusValue] } : undefined} aria-hidden="true" />
                </span>
                <div>
                  {isPriority ? (
                    <span className="text-[10px] font-bold uppercase tracking-wide" style={{ color: STATUS_TEXT[statusValue] }}>
                      {d.priority}
                    </span>
                  ) : null}
                  <p className="text-[15px] font-semibold leading-5 text-ink">{g.text(d)}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Where to get help */}
      <div className="grid gap-2.5 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-tint">
            <Hospital className="h-6 w-6 text-navy" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <p className="gov-eyebrow">{d.yourPhc}</p>
            <p className="text-[15px] font-bold text-navy">{phc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3.5">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-tint">
            <Hand className="h-6 w-6 text-navy" aria-hidden="true" />
          </span>
          <p className="text-[14px] font-semibold leading-5 text-ink">{d.helpLine}</p>
        </div>
      </div>
    </div>
  );
}

function WorkerLink({ d }: { d: (typeof DASH)['EN'] }) {
  return (
    <div className="pt-2 text-center">
      <a href="/asha" className="gov-focus inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold text-navy hover:bg-panel">
        <Users className="h-4 w-4" />
        {d.forWorkers} →
      </a>
    </div>
  );
}
