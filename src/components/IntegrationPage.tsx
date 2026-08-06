import {
  Activity,
  ArrowRight,
  CloudRain,
  Database,
  Droplets,
  GitMerge,
  Landmark,
  Layers,
  Network,
  ShieldCheck,
  Waves,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { STRINGS } from '../lib/i18n';
import { usePublicChrome } from '../hooks/usePublicChrome';
import TopUtilityBar from './ui/TopUtilityBar';

// Integration status — honest about what's live vs. pending a data-sharing MoU.
type IntStatus = 'available' | 'pending' | 'planned';
const STATUS_TINT: Record<IntStatus, string> = { available: '#e7f4e5', pending: '#fff3e6', planned: '#e6eef5' };
const STATUS_TEXT: Record<IntStatus, string> = { available: '#138808', pending: '#e07e1d', planned: '#003366' };
const STATUS_DOT: Record<IntStatus, string> = { available: '#138808', pending: '#FF9933', planned: '#003366' };
const STATUS_LABEL: Record<IntStatus, string> = {
  available: 'Public data',
  pending: 'Pending MoU',
  planned: 'Planned',
};

function StatusTag({ s }: { s: IntStatus }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase"
      style={{ background: STATUS_TINT[s], color: STATUS_TEXT[s] }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: STATUS_DOT[s] }} />
      {STATUS_LABEL[s]}
    </span>
  );
}

interface SourceRow {
  icon: LucideIcon;
  name: string;
  owner: string;
  provides: string;
  status: IntStatus;
}

// Upstream government systems NEERVANA ingests (it does not replace them).
const SOURCES: SourceRow[] = [
  { icon: Activity, name: 'IHIP / IDSP', owner: 'Dept. of Health & Family Welfare · NCDC', provides: 'Disease cases (ADD, cholera, enteric fever, hepatitis), IDSP S & P forms, outbreak / RRT reports', status: 'pending' },
  { icon: Droplets, name: 'WQMIS / FTK (JJM)', owner: 'DWSS · Ministry of Jal Shakti', provides: 'Water-quality tests — bacteriological + chemical, Field Test Kit and lab, source-level', status: 'pending' },
  { icon: CloudRain, name: 'IMD rainfall', owner: 'India Meteorological Dept.', provides: 'Daily block-level rainfall — the strongest single predictor of contamination', status: 'available' },
  { icon: Waves, name: 'CGWB / India-WRIS', owner: 'Central Ground Water Board', provides: 'Groundwater level — the ingress driver after monsoon rain', status: 'available' },
  { icon: Network, name: 'Field sensors (upsell)', owner: 'ESP32 · CSIR-CSIO · MeitY vendors', provides: 'On-site density/pH/conductivity at the top 5–10% of villages the model flags', status: 'planned' },
];

// Downstream — the EXISTING response chain NEERVANA feeds; nothing here is replaced.
const RESPONSE = [
  { icon: ShieldCheck, name: 'PHC / Medical Officer', detail: 'Treatment, case management, ORS/zinc' },
  { icon: Activity, name: 'Block MO / Rapid Response Team', detail: 'Field investigation, line-listing' },
  { icon: Droplets, name: 'DWSS', detail: 'Chlorination, source remediation' },
];

// The official reporting hierarchy NEERVANA mirrors — each level sees its own view.
const HIERARCHY = [
  { level: 'ANM / ASHA', role: 'Field reporting + villager advisory delivery' },
  { level: 'PHC Medical Officer', role: 'Block cases + medicine stock' },
  { level: 'Block Medical Officer', role: 'Block-level surveillance + response' },
  { level: 'District Civil Surgeon', role: 'District command view' },
  { level: 'State Surveillance Unit', role: 'IDSP / IHIP state rollup' },
];

function Section({ icon: Icon, title, sub, children }: { icon: LucideIcon; title: string; sub: string; children: React.ReactNode }) {
  return (
    <section className="gov-panel animate-fade-in overflow-hidden">
      <div className="flex items-center gap-2 border-b border-gray-200 px-4 py-3">
        <span className="grid h-7 w-7 place-items-center rounded bg-navy-tint text-navy"><Icon className="h-4 w-4" /></span>
        <div className="leading-tight"><h2 className="text-[13px] font-bold text-navy">{title}</h2><p className="gov-eyebrow">{sub}</p></div>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

export default function IntegrationPage() {
  const chrome = usePublicChrome();
  const str = STRINGS[chrome.lang];

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

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 bg-navy-tint"><Landmark className="h-6 w-6 text-navy" /></div>
          <div className="leading-tight">
            <div className="flex items-center gap-2">
              <p className="text-[17px] font-extrabold tracking-tight text-navy">NEERVANA</p>
              <span className="hidden text-gray-300 sm:inline">|</span>
              <span className="hidden text-[13px] font-semibold text-ink sm:inline">Data Sources &amp; Integration</span>
            </div>
            <p className="mt-0.5 hidden items-center gap-1.5 text-[11px] text-muted sm:flex"><ShieldCheck className="h-3 w-3 text-india-green" /> Decision-support that strengthens IDSP &amp; JJM — it does not replace them</p>
          </div>
        </div>
        <a href="/" className="gov-focus rounded-md bg-navy px-3.5 py-2 text-[12px] font-semibold text-white hover:bg-navy-light">Command Centre</a>
      </header>

      <main className="mx-auto w-full max-w-5xl space-y-5 px-4 py-6 sm:px-6">
        {/* Positioning */}
        <section className="gov-panel animate-fade-in p-6 sm:p-8">
          <p className="gov-eyebrow-lg">A layer, not a parallel system</p>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-navy sm:text-3xl">NEERVANA fuses data the government already collects.</h1>
          <p className="mt-3 max-w-3xl text-[15px] leading-7 text-ink">
            It ingests disease reports (IHIP/IDSP), water-quality tests (WQMIS/FTK) and rainfall (IMD), correlates
            them into a same-day, village-level risk alert, and routes that alert into the <span className="font-semibold text-navy">existing</span> PHC / DWSS response chain.
            No department is asked to run a second system, and NEERVANA is <span className="font-semibold text-navy">decision-support, not the decision-maker</span>.
          </p>
        </section>

        {/* Fusion flow */}
        <Section icon={GitMerge} title="How it plugs in" sub="Existing sources → fusion layer → existing response">
          <div className="grid items-stretch gap-3 lg:grid-cols-[1fr_auto_auto_auto_1fr]">
            {/* Sources */}
            <div className="rounded-lg border border-gray-200 bg-panel p-3">
              <p className="gov-eyebrow mb-2">Government sources</p>
              <ul className="space-y-1.5">
                {SOURCES.map((s) => (
                  <li key={s.name} className="flex items-center gap-2 text-[12px]">
                    <s.icon className="h-3.5 w-3.5 shrink-0 text-navy" />
                    <span className="font-semibold text-ink">{s.name}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden items-center justify-center lg:flex"><ArrowRight className="h-5 w-5 text-muted" /></div>
            {/* Fusion */}
            <div className="grid place-items-center rounded-lg border-2 border-navy bg-navy px-4 py-3 text-center text-white">
              <Layers className="h-6 w-6" />
              <p className="mt-1 text-[13px] font-extrabold leading-tight">NEERVANA<br />fusion + alert</p>
            </div>
            <div className="hidden items-center justify-center lg:flex"><ArrowRight className="h-5 w-5 text-muted" /></div>
            {/* Response */}
            <div className="rounded-lg border border-gray-200 bg-panel p-3">
              <p className="gov-eyebrow mb-2">Existing response</p>
              <ul className="space-y-1.5">
                {RESPONSE.map((r) => (
                  <li key={r.name} className="flex items-center gap-2 text-[12px]">
                    <r.icon className="h-3.5 w-3.5 shrink-0 text-india-green" />
                    <span className="font-semibold text-ink">{r.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        {/* Source detail table */}
        <Section icon={Database} title="Source systems" sub="What NEERVANA ingests, and the integration status">
          <div className="gov-scroll overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <thead className="bg-panel">
                <tr className="text-[10px] uppercase tracking-wide text-muted">
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">System</th>
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Owner</th>
                  <th className="border-b border-gray-200 px-3 py-2 font-semibold">Provides</th>
                  <th className="border-b border-gray-200 px-3 py-2 text-center font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {SOURCES.map((s, i) => (
                  <tr key={s.name} className={`text-[12px] ${i % 2 ? 'bg-panel' : 'bg-white'}`}>
                    <td className="border-b border-gray-100 px-3 py-2 font-semibold text-navy"><span className="flex items-center gap-1.5"><s.icon className="h-3.5 w-3.5" />{s.name}</span></td>
                    <td className="border-b border-gray-100 px-3 py-2 text-muted">{s.owner}</td>
                    <td className="border-b border-gray-100 px-3 py-2 leading-5 text-ink">{s.provides}</td>
                    <td className="border-b border-gray-100 px-3 py-2 text-center"><StatusTag s={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-[12px] font-medium text-muted">
            "Pending MoU" = ready to integrate once a data-sharing agreement with the district is signed. The current
            build runs on published + seeded demonstration data — not a live government feed.
          </p>
        </Section>

        {/* Reporting hierarchy */}
        <Section icon={Network} title="Mirrors your reporting hierarchy" sub="Each level sees only the view it needs">
          <ol className="flex flex-col gap-2 md:flex-row md:items-stretch">
            {HIERARCHY.map((h, i) => (
              <li key={h.level} className="flex flex-1 items-center gap-2">
                <div className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-2.5">
                  <p className="text-[12px] font-bold text-navy">{h.level}</p>
                  <p className="mt-0.5 text-[11px] leading-4 text-muted">{h.role}</p>
                </div>
                {i < HIERARCHY.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted md:block" />}
              </li>
            ))}
          </ol>
        </Section>

        {/* Governance */}
        <Section icon={ShieldCheck} title="Data governance" sub="Built for a government reviewer">
          <ul className="grid gap-2 sm:grid-cols-2">
            {[
              ['Government owns the data', 'NEERVANA is the processor; the district / state is the data owner and fiduciary.'],
              ['DPDP Act 2023', 'Consent, purpose limitation and a full audit trail on identifiable villager data.'],
              ['Decision-support only', 'It flags and routes; a human officer decides and acts. Confirmation is always at an accredited lab.'],
              ['Data residency: India (target)', 'Production data to be hosted in-country under the data-sharing MoU.'],
            ].map(([t, d]) => (
              <li key={t} className="rounded-lg border border-gray-200 bg-panel px-3.5 py-3">
                <p className="text-[13px] font-bold text-navy">{t}</p>
                <p className="mt-0.5 text-[12px] leading-5 text-muted">{d}</p>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-muted">Full institutional plan (governance, validation, procurement, sustainability) in GOVERNMENT_READINESS.md.</p>
        </Section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-navy/10 py-6 text-[11px] text-muted">
          <span className="flex items-center gap-1.5"><Landmark className="h-3.5 w-3.5" /> NEERVANA · Patiala District</span>
          <a href="/advisory" className="gov-focus font-semibold text-navy hover:text-navy-light">Villager advisory →</a>
        </footer>
      </main>
    </div>
  );
}
