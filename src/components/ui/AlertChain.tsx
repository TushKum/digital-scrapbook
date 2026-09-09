import { Check, ClipboardCheck, OctagonAlert } from 'lucide-react';
import type { Lang } from '../../lib/i18n';
import { PRIMARY_ALERT, STAGE_LABEL } from '../../data/environmental';

function fmtTime(iso: string, lang: Lang): string {
  return new Date(iso).toLocaleString(lang === 'PA' ? 'en-IN' : 'en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

// Alert + accountability chain (acknowledge -> assign -> act -> verify -> close)
// for the critical lead block. Rule-based / demo reconstruction — badge says so.
export default function AlertChain({ lang }: { lang: Lang }) {
  const a = PRIMARY_ALERT;
  const name = lang === 'PA' ? a.blockNamePa : a.blockName;
  const driver = lang === 'PA' ? a.driverPa : a.driverEn;
  const last = a.chain[a.chain.length - 1];

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
          {lang === 'PA' ? 'ਡੈਮੋ · ਨਿਯਮ-ਆਧਾਰਿਤ' : 'DEMO · rule-based'}
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
        <span className="text-muted">
          {lang === 'PA' ? 'ਜੋਖਮ' : 'Risk'}: <span className="font-bold text-ink">{a.riskScore}</span>
        </span>
      </div>

      <ol className="space-y-2.5">
        {a.chain.map((s) => (
          <li key={s.stage} className="flex gap-2.5">
            <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-india-green text-white">
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>
            <div className="-mt-px leading-tight">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[11px] font-bold text-navy">{STAGE_LABEL[s.stage][lang]}</span>
                <span className="text-[9px] tabular-nums text-muted">{fmtTime(s.at, lang)}</span>
              </div>
              <div className="text-[10px] font-medium text-ink">{lang === 'PA' ? s.actorPa : s.actor}</div>
              <div className="text-[10px] text-muted">{lang === 'PA' ? s.notePa : s.note}</div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-2.5 flex items-center gap-1.5 border-t border-gray-200 pt-2 text-[10px] font-semibold text-india-green">
        <ClipboardCheck className="h-3.5 w-3.5" aria-hidden="true" />
        {lang === 'PA' ? 'ਬੰਦ ਕੀਤਾ' : 'Closed'} · {fmtTime(last.at, lang)}
      </div>
    </div>
  );
}
