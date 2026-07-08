import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ClipboardList,
  Droplets,
  Landmark,
  LayoutDashboard,
  LogOut,
  Megaphone,
  Package,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import type { AuthUser } from '../../lib/api';
import type { Block, TimeKey } from '../../data/blocks';
import { TIME_KEYS } from '../../data/blocks';
import type { Lang } from '../../lib/i18n';
import { STRINGS } from '../../lib/i18n';
import { DASH } from '../../lib/dashboardStrings';
import {
  aggregate,
  blockName,
  fmt,
  snapshot,
  snapshotStatus,
  statusLabel,
  stockFor,
  stockStatus,
  wqiStatus,
} from '../../lib/metrics';
import type { Status } from '../../lib/metrics';
import type { BootStatus } from '../../hooks/useBootstrap';
import TopUtilityBar from '../ui/TopUtilityBar';
import BootStatusView from '../ui/BootStatus';
import { STATUS_ICON, STATUS_TEXT } from './marks';
import { HBarList, MetricTile, StatusPill, StockMeter, WqiTrend } from './shared';
import { STATUS_COLOR } from '../../lib/metrics';

interface Props {
  blocks: Block[];
  dispatches: Record<Lang, string[]>;
  status: BootStatus;
  error: string | null;
  reload: () => void;
  user: AuthUser | null;
  onSignOut: () => void;
  lang: Lang;
  onLang: (l: Lang) => void;
  textScale: number;
  onTextScale: (n: number) => void;
  contrast: boolean;
  onContrast: (v: boolean) => void;
}

const WINDOW_LABEL = (str: (typeof STRINGS)['EN'], tk: TimeKey) =>
  tk === '24h' ? str.t24 : tk === '7d' ? str.t7 : str.tEpi;

function Section({
  icon: Icon,
  title,
  sub,
  children,
  aside,
}: {
  icon: typeof Activity;
  title: string;
  sub: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section className="gov-panel animate-fade-in overflow-hidden">
      <div className="flex items-center justify-between gap-2 border-b border-gray-200 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded bg-navy-tint text-navy">
            <Icon className="h-4 w-4" />
          </span>
          <div className="leading-tight">
            <h2 className="text-[13px] font-bold text-navy">{title}</h2>
            <p className="gov-eyebrow">{sub}</p>
          </div>
        </div>
        {aside}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

export default function AshaDashboard({
  blocks,
  dispatches,
  status,
  error,
  reload,
  user,
  onSignOut,
  lang,
  onLang,
  textScale,
  onTextScale,
  contrast,
  onContrast,
}: Props) {
  const str = STRINGS[lang];
  const d = DASH[lang];
  const [time, setTime] = useState<TimeKey>('epi22');

  useEffect(() => {
    const prev = document.title;
    document.title = `${d.ashaTitle} · NEERVANA`;
    return () => {
      document.title = prev;
    };
  }, [d.ashaTitle]);

  const agg = useMemo(() => aggregate(blocks, time), [blocks, time]);

  const stockAvg = useMemo(() => {
    if (blocks.length === 0) return 0;
    const sum = blocks.reduce((acc, b) => {
      const s = stockFor(b, time);
      return acc + (s.ors + s.zinc + s.antibiotics) / 3;
    }, 0);
    return sum / blocks.length;
  }, [blocks, time]);

  const caseRows = useMemo(
    () =>
      [...blocks]
        .map((b) => ({
          label: blockName(b, lang),
          sub: b.phc,
          value: snapshot(b, time).activeCases,
          hint: `${blockName(b, lang)} · ${snapshot(b, time).activeCases} ${d.cases}`,
        }))
        .sort((a, b) => b.value - a.value),
    [blocks, time, lang, d.cases],
  );

  const trend = useMemo(
    () =>
      TIME_KEYS.map((tk) => {
        const avg = blocks.length
          ? Math.round(blocks.reduce((acc, b) => acc + snapshot(b, tk).wqi, 0) / blocks.length)
          : 0;
        return { label: WINDOW_LABEL(str, tk), value: avg };
      }),
    [blocks, str],
  );

  const avgWqi = Math.round(agg.avgWqi);
  const msgs = dispatches[lang] ?? [];
  const ready = status === 'ready';

  return (
    <div className="gov-scroll flex h-screen w-screen flex-col overflow-y-auto bg-navy-tint">
      <TopUtilityBar
        str={str}
        textScale={textScale}
        onTextScale={onTextScale}
        contrast={contrast}
        onContrast={onContrast}
        lang={lang}
        onLang={onLang}
      />

      {/* Masthead — mirrors the command-centre Header construction */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 bg-navy-tint">
            <LayoutDashboard className="h-6 w-6 text-navy" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-extrabold tracking-tight text-navy">{d.ashaTitle}</h1>
              <span className="hidden text-gray-300 sm:inline">|</span>
              <span className="hidden text-[13px] font-semibold text-ink sm:inline">{str.portalTitle}</span>
            </div>
            <p className="mt-0.5 hidden items-center gap-1.5 text-[11px] text-muted sm:flex">
              <ShieldCheck className="h-3 w-3 text-india-green" />
              {str.district} · {d.ashaSub}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 md:flex">
            <a href="/" className="gov-focus rounded-md px-2.5 py-2 text-[12px] font-semibold text-muted hover:bg-panel hover:text-navy">
              {d.commandMap}
            </a>
            <a href="/advisory" className="gov-focus rounded-md px-2.5 py-2 text-[12px] font-semibold text-muted hover:bg-panel hover:text-navy">
              {d.villagerView}
            </a>
          </nav>
          <div className="hidden items-center gap-2 rounded-md border border-gray-200 bg-panel px-3 py-1.5 lg:flex">
            <div className="leading-tight">
              <div className="text-[9px] uppercase tracking-wide text-muted">{str.signedInAs}</div>
              <div className="text-[12px] font-semibold text-navy">{user?.displayName ?? '—'}</div>
            </div>
          </div>
          <button
            onClick={onSignOut}
            aria-label={str.signOut}
            className="gov-focus flex items-center gap-2 rounded-md bg-navy px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-navy-light"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden md:inline">{str.signOut}</span>
          </button>
        </div>
      </header>

      {/* Reporting-window filter row */}
      <div className="sticky top-16 z-20 flex flex-wrap items-center gap-2 border-b border-gray-200 bg-white/95 px-4 py-2.5 backdrop-blur">
        <span className="gov-eyebrow">{str.filterLabel}</span>
        <div className="flex rounded-md border border-gray-200 bg-panel p-0.5" role="group" aria-label={str.filterLabel}>
          {TIME_KEYS.map((tk) => (
            <button
              key={tk}
              onClick={() => setTime(tk)}
              aria-pressed={time === tk}
              className={`gov-focus rounded px-3 py-1 text-[12px] font-semibold transition-colors ${
                time === tk ? 'bg-navy text-white shadow-sm' : 'text-muted hover:text-navy'
              }`}
            >
              {WINDOW_LABEL(str, tk)}
            </button>
          ))}
        </div>
      </div>

      {ready ? (
        <main className="mx-auto w-full max-w-6xl space-y-4 px-4 py-5 sm:px-6">
          {/* Overview metric tiles */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <MetricTile icon={Activity} label={str.tipCases} value={fmt(agg.activeCases)} sub={`${WINDOW_LABEL(str, time)}`} />
            <MetricTile icon={TrendingUp} label={d.newCases} value={fmt(agg.newCases)} sub={`${fmt(agg.recovered)} ${d.recovered.toLowerCase()}`} />
            <MetricTile icon={Droplets} label={d.avgWqi} value={avgWqi} tone={wqiStatus(avgWqi)} sub={statusLabel(wqiStatus(avgWqi), str)} />
            <MetricTile icon={Package} label={d.stockHealth} value={`${Math.round(stockAvg)}%`} tone={stockStatus(stockAvg)} sub={statusLabel(stockStatus(stockAvg), str)} />
            <MetricTile icon={ClipboardList} label={d.sForms} value={fmt(agg.sForms)} sub={str.surveillanceSub} />
            <MetricTile icon={ClipboardList} label={d.pForms} value={fmt(agg.pForms)} />
          </div>

          {/* Block status table */}
          <Section icon={ClipboardList} title={d.blockStatusTitle} sub={d.blockStatusSub}>
            <div className="gov-scroll overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-wide text-muted">
                    <th className="border-b border-gray-200 px-3 py-2 font-semibold">{str.colBlock}</th>
                    <th className="border-b border-gray-200 px-3 py-2 font-semibold">{str.tipPhc}</th>
                    <th className="border-b border-gray-200 px-2 py-2 text-center font-semibold">{str.colCases}</th>
                    <th className="border-b border-gray-200 px-2 py-2 text-center font-semibold">{str.colWqi}</th>
                    <th className="border-b border-gray-200 px-3 py-2 text-center font-semibold">{str.colStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {blocks.map((b, i) => {
                    const s = snapshot(b, time);
                    const st = snapshotStatus(s);
                    return (
                      <tr key={b.id} className={`text-[12px] ${i % 2 === 0 ? 'bg-white' : 'bg-panel'}`}>
                        <td className="border-b border-gray-100 px-3 py-2 font-semibold text-ink">{blockName(b, lang)}</td>
                        <td className="border-b border-gray-100 px-3 py-2 text-muted">{b.phc}</td>
                        <td className="border-b border-gray-100 px-2 py-2 text-center font-semibold tabular-nums text-ink">{s.activeCases}</td>
                        <td className="border-b border-gray-100 px-2 py-2 text-center font-semibold tabular-nums text-ink">{s.wqi}</td>
                        <td className="border-b border-gray-100 px-3 py-2 text-center">
                          <StatusPill status={st} label={statusLabel(st, str)} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Two charts */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Section icon={Activity} title={d.casesByBlockTitle} sub={d.casesByBlockSub}>
              <HBarList rows={caseRows} unit={d.cases} />
            </Section>

            <Section icon={Droplets} title={d.wqiTrendTitle} sub={d.wqiTrendSub}>
              <WqiTrend points={trend} />
              <p className="mt-2 text-right text-[10px] text-muted">
                {/* markers are single-hue; the dashed guides mark the bands */}
                {d.thresholdSafe} · {d.thresholdAdvisory}
              </p>
            </Section>
          </div>

          {/* Medicine stock per PHC */}
          <Section icon={Package} title={d.medicineTitle} sub={d.medicineSub}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {blocks.map((b) => {
                const s = stockFor(b, time);
                return (
                  <div key={b.id} className="rounded-lg border border-gray-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-[12px] font-bold text-navy">{b.phc}</span>
                      <span className="text-[10px] text-muted">{blockName(b, lang)}</span>
                    </div>
                    <StockMeter label={str.ors} pct={s.ors} />
                    <StockMeter label={str.zinc} pct={s.zinc} />
                    <StockMeter label={str.antibiotics} pct={s.antibiotics} />
                  </div>
                );
              })}
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[9px] uppercase tracking-wide">
              {(['safe', 'warning', 'critical'] as Status[]).map((st) => {
                const StIcon = STATUS_ICON[st];
                const range = st === 'safe' ? '≥70%' : st === 'warning' ? '40–69%' : '<40%';
                return (
                  <span key={st} className="flex items-center gap-1" style={{ color: STATUS_TEXT[st] }}>
                    <StIcon className="h-3 w-3" style={{ color: STATUS_COLOR[st] }} aria-hidden="true" /> {range} {statusLabel(st, str)}
                  </span>
                );
              })}
            </div>
          </Section>

          {/* Dispatches */}
          <Section icon={Megaphone} title={d.dispatchesTitle} sub={str.dispatches}>
            {msgs.length === 0 ? (
              <p className="text-[12px] text-muted">{d.noDispatches}</p>
            ) : (
              <ul className="space-y-2">
                {msgs.map((m, i) => (
                  <li key={i} className="flex items-start gap-2 rounded-lg border border-gray-200 bg-saffron-tint px-3 py-2">
                    <Megaphone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-saffron-dark" />
                    <span className="text-[12px] leading-5 text-navy-dark">{m}</span>
                  </li>
                ))}
              </ul>
            )}
          </Section>

          <footer className="flex items-center justify-between py-4 text-[11px] text-muted">
            <span className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5" /> {str.portalTitle} · {d.ashaTitle}</span>
            <a href="/advisory" className="gov-focus font-semibold text-navy hover:text-navy-light">{d.villagerView} →</a>
          </footer>
        </main>
      ) : (
        <div className="grid flex-1 place-items-center p-6">
          <BootStatusView status={status} error={error} onRetry={reload} />
        </div>
      )}
    </div>
  );
}
