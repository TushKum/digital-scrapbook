import { CloudRain } from 'lucide-react';
import type { Lang } from '../../lib/i18n';
import { RAINFALL_WEEKLY } from '../../data/environmental';

// Compact weekly rainfall bar strip (single-hue magnitude; onset week accented
// + labelled, never colour alone). Data is REAL — NASA POWER.
export default function RainfallTrend({ lang }: { lang: Lang }) {
  const max = Math.max(...RAINFALL_WEEKLY.map((w) => w.mm));
  return (
    <div className="gov-panel border border-gray-200 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <CloudRain className="h-4 w-4 text-navy" aria-hidden="true" />
          <span className="text-[12px] font-bold text-navy">
            {lang === 'PA' ? 'ਹਫ਼ਤਾਵਾਰੀ ਮੀਂਹ' : 'Weekly rainfall'}
          </span>
        </div>
        <span className="rounded-full bg-india-greenTint px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-india-green">
          {lang === 'PA' ? 'ਅਸਲ · NASA POWER' : 'REAL · NASA POWER'}
        </span>
      </div>

      <div className="flex h-16 items-end gap-1">
        {RAINFALL_WEEKLY.map((w) => (
          <div key={w.isoWeek} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full flex-1 items-end">
              <div
                className="w-full rounded-t"
                style={{
                  height: `${Math.max(6, (w.mm / max) * 100)}%`,
                  backgroundColor: w.onset ? '#e07e1d' : '#003366',
                }}
                title={`${w.label}: ${w.mm} mm`}
              />
            </div>
            <span className={`text-[8px] ${w.onset ? 'font-bold text-saffron-dark' : 'text-muted'}`}>
              {w.label}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-2 text-[10px] leading-4 text-muted">
        {lang === 'PA'
          ? 'ਸਿਖਰ 102 ਮਿਮੀ — ਜੂਨ 28 ਪ੍ਰਕੋਪ ਵਾਲੇ ਹਫ਼ਤੇ (W26)। >50 ਮਿਮੀ ਵਾਲੇ ਦਿਨ: 0।'
          : 'Peaked 102 mm the week of the Jun 28 onset (W26). Heavy-rain days (>50 mm): 0.'}
      </p>
    </div>
  );
}
