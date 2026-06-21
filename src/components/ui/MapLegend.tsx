import { Navigation } from 'lucide-react';
import type { Strings } from '../../lib/i18n';
import type { Aggregate } from '../../lib/metrics';
import { STATUS_COLOR } from '../../lib/metrics';

interface Props {
  str: Strings;
  agg: Aggregate;
}

// Floating GIS legend + status tally + compass, anchored over the map.
export default function MapLegend({ str, agg }: Props) {
  const items: Array<{ status: 'safe' | 'warning' | 'critical'; label: string; count: number }> = [
    { status: 'critical', label: str.statusCritical, count: agg.counts.critical },
    { status: 'warning', label: str.statusWarning, count: agg.counts.warning },
    { status: 'safe', label: str.statusSafe, count: agg.counts.safe },
  ];

  return (
    <div className="gov-panel flex items-stretch overflow-hidden">
      <div className="flex flex-col justify-center gap-1.5 px-3 py-2">
        <span className="gov-eyebrow">{str.legend}</span>
        <div className="flex items-center gap-3">
          {items.map((it) => (
            <span key={it.status} className="flex items-center gap-1.5 text-[11px] font-medium text-ink">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: STATUS_COLOR[it.status] }} />
              {it.label}
              <span className="rounded bg-gray-100 px-1 text-[10px] font-bold tabular-nums text-muted">
                {it.count}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center border-l border-gray-200 px-3">
        <Navigation className="h-4 w-4 text-navy" style={{ transform: 'rotate(-45deg)' }} />
        <span className="text-[9px] font-bold text-navy">N</span>
      </div>
    </div>
  );
}
