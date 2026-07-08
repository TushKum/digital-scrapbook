import { useEffect } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  Milk,
  Landmark,
  FlaskConical,
  Gauge,
  HeartHandshake,
  LineChart,
  LogIn,
  Megaphone,
  Route,
  ShieldCheck,
} from 'lucide-react';
import { CpuArchitecture } from '../ui/cpu-architecture';
import TopUtilityBar from '../ui/TopUtilityBar';
import { usePublicChrome } from '../../hooks/usePublicChrome';
import { STRINGS } from '../../lib/i18n';
import { STATUS_COLOR, STATUS_TINT } from '../../lib/metrics';
import {
  BUSINESS_MODEL,
  HERO,
  HERO_STATS,
  IMPACT_KPIS,
  MARKET_FACTS,
  MARKET_NOTE,
  MARKET_TIERS,
  OPEN_ITEMS,
  PROBLEM,
  ROADMAP,
  SCALE_LADDER,
  SDGS,
  SOLUTION,
  SOURCE_LABEL,
  TICKER_FACTS,
  type SourceTag,
} from '../../data/milkVertical';

// Official status colours imported from the dashboard's single source of
// truth (lib/metrics): verified → safe (india green), estimate → warning
// (saffron). Estimate text uses the saffron-dark token for AA contrast on
// the tint; the dot keeps the canonical saffron.
const TAG_DOT: Record<SourceTag, string> = {
  verified: STATUS_COLOR.safe,
  estimate: STATUS_COLOR.warning,
};
const TAG_TEXT: Record<SourceTag, string> = {
  verified: STATUS_COLOR.safe,
  estimate: '#e07e1d', // tailwind saffron.dark
};
const TAG_TINT: Record<SourceTag, string> = {
  verified: STATUS_TINT.safe,
  estimate: STATUS_TINT.warning,
};

/** Chip identical in construction to the dashboard's status chips. The full
 *  source wording is exposed to AT and tooltips via SOURCE_LABEL. */
function SourceBadge({ tag, label }: { tag: SourceTag; label?: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
      style={{ background: TAG_TINT[tag], color: TAG_TEXT[tag] }}
      title={SOURCE_LABEL[tag]}
      aria-label={label ?? SOURCE_LABEL[tag]}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: TAG_DOT[tag] }} />
      {label ?? (tag === 'verified' ? 'Verified' : 'Estimate')}
    </span>
  );
}

/** Section shell mirroring the dashboard panel header idiom. */
function Section({
  icon: Icon,
  title,
  eyebrow,
  children,
}: {
  icon: typeof Milk;
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section className="gov-panel animate-fade-in overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
        <span className="grid h-7 w-7 place-items-center rounded bg-navy-tint text-navy">
          <Icon className="h-4 w-4" />
        </span>
        <div className="leading-tight">
          <h2 className="text-[13px] font-bold text-navy">{title}</h2>
          <p className="gov-eyebrow">{eyebrow}</p>
        </div>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </section>
  );
}

export default function MilkScreeningPage() {
  // Statutory accessibility chrome (text size / contrast / language), same
  // behaviour as the authenticated shell.
  const chrome = usePublicChrome();
  const str = STRINGS[chrome.lang];

  // Route-scoped document title, restored on unmount.
  useEffect(() => {
    const prev = document.title;
    document.title = 'Milk Adulteration Screening · NEERVANA';
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="gov-scroll h-screen w-screen overflow-y-auto bg-navy-tint">
      {/* Statutory utility strip — identical to the dashboard's */}
      <TopUtilityBar
        str={str}
        textScale={chrome.textScale}
        onTextScale={chrome.setTextScale}
        contrast={chrome.contrast}
        onContrast={chrome.setContrast}
        lang={chrome.lang}
        onLang={chrome.setLang}
      />

      {/* Masthead — same construction as the dashboard Header. The page's sole
          <h1> lives in the hero; the site name here is presentational. */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 bg-navy-tint">
            <Landmark className="h-6 w-6 text-navy" />
          </div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <p className="text-[17px] font-extrabold tracking-tight text-navy">NEERVANA</p>
              <span className="hidden text-gray-300 sm:inline">|</span>
              <span className="hidden text-[13px] font-semibold text-ink sm:inline">Product Verticals</span>
            </div>
            <p className="mt-0.5 hidden items-center gap-1.5 text-[11px] text-muted sm:flex">
              <ShieldCheck className="h-3 w-3 text-india-green" />
              Screening & traceability infrastructure for public-interest supply chains
            </p>
          </div>
        </div>
        <a
          href="/"
          className="gov-focus flex items-center gap-2 rounded-md bg-navy px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-navy-light"
        >
          <LogIn className="h-4 w-4" />
          <span className="hidden md:inline">Officer Sign-in</span>
        </a>
      </header>

      {/* Vertical navigation — tab strip, same official look as the panels */}
      <nav aria-label="Product verticals" className="border-b border-gray-200 bg-white px-4">
        <div className="mx-auto flex max-w-6xl gap-1 text-[12px] font-semibold">
          <a
            href="/"
            className="gov-focus border-b-2 border-transparent px-3 py-2.5 text-muted transition-colors hover:text-navy"
          >
            Water — Epidemiological Surveillance
          </a>
          <a
            href="/verticals/milk-screening"
            aria-current="page"
            className="gov-focus border-b-2 border-navy px-3 py-2.5 text-navy"
          >
            Milk Adulteration Screening
          </a>
        </div>
      </nav>

      {/* Key-facts marquee — mirrors the dashboard Ticker construction (navy
          variant; verified facts only, duplicated track for a seamless loop) */}
      <div className="flex h-9 items-stretch border-b border-navy/20 bg-navy-tint">
        <div className="flex shrink-0 items-center gap-1.5 bg-navy px-3 text-white">
          <Megaphone className="h-3.5 w-3.5" />
          <span className="text-[11px] font-bold uppercase tracking-wide">Key Facts</span>
        </div>
        <div className="group relative flex-1 overflow-hidden">
          <div className="absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-navy-tint to-transparent" />
          <div className="absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-navy-tint to-transparent" />
          <div className="flex h-full w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
            {[0, 1].map((dup) => (
              <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
                {TICKER_FACTS.map((msg, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center">
                    <span className="mx-3 h-1.5 w-1.5 rounded-full bg-navy" />
                    <span className="whitespace-nowrap text-[12px] font-medium text-navy-dark">{msg}</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        {/* 1 · HERO */}
        <section className="gov-panel animate-fade-in overflow-hidden">
          <div className="grid gap-6 px-5 py-8 sm:px-8 md:grid-cols-[1fr_auto] md:items-center">
            <div className="space-y-4">
              <p className="gov-eyebrow-lg">{HERO.eyebrow}</p>
              <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{HERO.title}</h1>
              <p className="max-w-2xl text-[15px] leading-7 text-ink">{HERO.oneLiner}</p>
              <div className="flex items-start gap-2 rounded-lg border border-saffron/40 bg-saffron-tint px-3.5 py-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-saffron-dark" />
                <p className="text-[13px] font-medium leading-6 text-ink">{HERO.disclaimer}</p>
              </div>
            </div>
            <div className="hidden justify-center md:flex">
              <CpuArchitecture width="180" height="180" text="SCREEN" className="text-navy" />
            </div>
          </div>
          {/* Verified stat strip — official figures only, tabular numerals */}
          <div className="grid grid-cols-2 divide-gray-200 border-t border-gray-200 bg-panel sm:grid-cols-4 sm:divide-x">
            {HERO_STATS.map((s) => (
              <div key={s.label} className="px-4 py-3.5">
                <p className="text-xl font-extrabold tabular-nums tracking-tight text-navy">{s.value}</p>
                <p className="mt-0.5 text-[11px] leading-4 text-muted">{s.label}</p>
                <div className="mt-1.5">
                  <SourceBadge tag={s.source} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2 · THE PROBLEM */}
        <Section icon={AlertTriangle} title="The Problem" eyebrow="Documented, economically painful">
          <p className="max-w-3xl text-[13px] leading-6 text-ink">{PROBLEM.intro}</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {PROBLEM.adulterants.map((a) => (
              <div key={a.name} className="rounded-lg border border-gray-200 bg-panel px-3.5 py-3">
                <p className="text-[13px] font-bold text-navy">{a.name}</p>
                <p className="mt-0.5 text-[12px] leading-5 text-muted">{a.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-start gap-2 rounded-lg border border-navy/15 bg-navy-tint px-3.5 py-3">
            <p className="flex-1 text-[13px] font-semibold leading-6 text-navy">{PROBLEM.wedge.text}</p>
            <SourceBadge tag={PROBLEM.wedge.source} />
          </div>
        </Section>

        {/* 3 · THE SOLUTION */}
        <Section icon={FlaskConical} title="The Solution — How It Works" eyebrow="Data + traceability layer, not new milk chemistry">
          <p className="max-w-3xl text-[13px] leading-6 text-ink">{SOLUTION.intro}</p>

          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {SOLUTION.steps.map((s, i) => (
              <div key={s.title} className="rounded-lg border border-gray-200 bg-panel px-3.5 py-3">
                <div className="flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="text-[13px] font-bold text-navy">{s.title}</p>
                </div>
                <p className="mt-2 text-[12px] leading-5 text-muted">{s.detail}</p>
              </div>
            ))}
          </div>

          {/* Sensing table — the official tabular look from the dashboard */}
          <div className="gov-scroll mt-5 overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead className="bg-panel">
                <tr className="text-[10px] uppercase tracking-wide text-muted">
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Parameter</th>
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Method</th>
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Screens for</th>
                </tr>
              </thead>
              <tbody>
                {SOLUTION.sensing.map((row, i) => (
                  <tr key={row.parameter} className={`text-[12px] ${i % 2 === 0 ? 'bg-white' : 'bg-panel'}`}>
                    <td className="border-b border-gray-100 px-3 py-2 font-semibold text-ink">{row.parameter}</td>
                    <td className="border-b border-gray-100 px-3 py-2 text-ink">{row.method}</td>
                    <td className="border-b border-gray-100 px-3 py-2 text-ink">{row.screensFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-lg border border-saffron/40 bg-saffron-tint px-3.5 py-3">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-saffron-dark" />
            <p className="text-[13px] font-medium leading-6 text-ink">{SOLUTION.honesty}</p>
          </div>
        </Section>

        {/* 4 · MARKET */}
        <Section icon={LineChart} title="Market — Patiala Beachhead" eyebrow="Bottom-up · sourced facts vs estimates">
          {/* Badge legend */}
          <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted">
            <span className="flex items-center gap-1.5">
              <SourceBadge tag="verified" /> {SOURCE_LABEL.verified}
            </span>
            <span className="flex items-center gap-1.5">
              <SourceBadge tag="estimate" /> {SOURCE_LABEL.estimate}
            </span>
          </div>

          {/* Facts table */}
          <div className="gov-scroll overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead className="bg-panel">
                <tr className="text-[10px] uppercase tracking-wide text-muted">
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Fact</th>
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Detail</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-center font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {MARKET_FACTS.map((f, i) => (
                  <tr key={f.label} className={`text-[12px] ${i % 2 === 0 ? 'bg-white' : 'bg-panel'}`}>
                    <td className="border-b border-gray-100 px-3 py-2 font-semibold text-ink">{f.label}</td>
                    <td className="border-b border-gray-100 px-3 py-2 leading-5 text-ink">{f.value}</td>
                    <td className="border-b border-gray-100 px-3 py-2 text-center">
                      <SourceBadge tag={f.source} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* TAM / SAM / SOM */}
          <div className="mt-6">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-[13px] font-bold text-navy">TAM · SAM · SOM (Patiala milkshed)</h3>
              <SourceBadge tag="estimate" />
            </div>
            <div className="grid gap-2 md:grid-cols-3">
              {MARKET_TIERS.map((t) => (
                <div key={t.key} className="rounded-lg border border-gray-200 bg-white px-3.5 py-3 shadow-panel">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-[13px] font-extrabold tracking-tight text-navy">{t.key}</p>
                    <p className="gov-eyebrow text-right">{t.scope}</p>
                  </div>
                  <p className="mt-2 text-[15px] font-bold tabular-nums text-ink">{t.hardware}</p>
                  <p className="text-[12px] font-semibold tabular-nums text-muted">+ {t.recurring}</p>
                  <div className="mt-3 h-2 w-full rounded-full bg-navy-tint">
                    <div
                      className="h-2 rounded-full bg-navy"
                      style={{ width: `${t.barPct}%` }}
                      role="img"
                      aria-label={`${t.key} relative size ${t.barPct}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[12px] font-semibold text-muted">{MARKET_NOTE}</p>
          </div>

          {/* Scale ladder */}
          <div className="mt-6 rounded-lg border border-navy/15 bg-navy-tint px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-[13px] font-bold text-navy">Scale ladder</h3>
              <SourceBadge tag={SCALE_LADDER.source} label={SCALE_LADDER.ceilingTag} />
              <SourceBadge tag={SCALE_LADDER.source} />
            </div>
            <ol className="mt-3 flex flex-col gap-2 md:flex-row md:items-center">
              {SCALE_LADDER.steps.map((s, i) => (
                <li key={s} className="flex items-center gap-2 text-[12px] font-semibold text-ink">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-navy text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  {s}
                  {i < SCALE_LADDER.steps.length - 1 && (
                    <ArrowRight className="hidden h-3.5 w-3.5 text-muted md:block" />
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12px] leading-5 text-ink">{SCALE_LADDER.ceiling}</p>
          </div>
        </Section>

        {/* 5 · BUSINESS MODEL */}
        <Section icon={Banknote} title="Business Model" eyebrow="Recurring revenue · union-level sales">
          <div className="grid gap-2 sm:grid-cols-2">
            {BUSINESS_MODEL.points.map((p) => (
              <div key={p.title} className="rounded-lg border border-gray-200 bg-panel px-3.5 py-3">
                <p className="text-[13px] font-bold text-navy">{p.title}</p>
                <p className="mt-1 text-[12px] leading-5 text-muted">{p.detail}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-navy/15 bg-navy-tint px-3.5 py-3">
            <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-navy" />
            <p className="text-[13px] font-semibold leading-6 text-navy">{BUSINESS_MODEL.moat}</p>
          </div>
        </Section>

        {/* 6 · IMPACT */}
        <Section icon={HeartHandshake} title="Impact" eyebrow="Enactus-facing · KPI values pending pilot">
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {IMPACT_KPIS.map((k) => (
              <div key={k.label} className="rounded-lg border border-gray-200 bg-white px-3.5 py-3 shadow-panel">
                <p className="gov-eyebrow">{k.label}</p>
                <p className="mt-1.5 text-[15px] font-bold tabular-nums text-muted">{k.value}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <p className="text-[12px] font-semibold text-muted">SDG alignment:</p>
            {SDGS.map((s) => (
              <span
                key={s.n}
                className="inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-navy-tint px-2.5 py-1 text-[10px] font-bold uppercase text-navy"
              >
                SDG {s.n} · {s.label}
              </span>
            ))}
          </div>
        </Section>

        {/* 7 · ROADMAP */}
        <Section icon={Route} title="Roadmap" eyebrow="Verka-anchored phases">
          <ol className="space-y-2">
            {ROADMAP.map((r, i) => (
              <li key={r.phase} className={`flex gap-3 rounded-lg px-3.5 py-3 ${i % 2 === 0 ? 'bg-white' : 'bg-panel'} border border-gray-200`}>
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-navy text-[11px] font-bold text-white">
                  {i}
                </span>
                <div>
                  <p className="text-[13px] font-bold text-navy">
                    {r.phase} — {r.title}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-5 text-muted">{r.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        {/* Open items — honest placeholders, never invented */}
        <section className="gov-panel px-4 py-4 sm:px-5">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded bg-saffron-tint text-saffron-dark">
              <Gauge className="h-4 w-4" />
            </span>
            <h2 className="text-[13px] font-bold text-navy">Open items — to confirm with Verka</h2>
          </div>
          <ul className="mt-3 space-y-1.5">
            {OPEN_ITEMS.map((o) => (
              <li key={o} className="flex items-start gap-2 text-[12px] leading-5 text-ink">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
                {o}
              </li>
            ))}
          </ul>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 py-6 text-[11px] text-muted">
          <p className="flex items-center gap-1.5">
            <Landmark className="h-3.5 w-3.5" />
            NEERVANA · Product Verticals
          </p>
          <a href="/" className="gov-focus flex items-center gap-1 font-semibold text-navy hover:text-navy-light">
            Water surveillance dashboard <ArrowRight className="h-3 w-3" />
          </a>
        </footer>
      </main>
    </div>
  );
}
