import { CalendarDays, CalendarRange, Clock } from 'lucide-react';
import type { ReactNode } from 'react';
import type { TimeKey } from '../../data/blocks';
import type { Strings } from '../../lib/i18n';

interface Props {
  time: TimeKey;
  onTime: (t: TimeKey) => void;
  str: Strings;
}

// Bottom segmented control — selects the reporting window applied to the 3D
// map and both data panels.
export default function TimeFilter({ time, onTime, str }: Props) {
  const options: Array<{ key: TimeKey; label: string; icon: ReactNode }> = [
    { key: '24h', label: str.t24, icon: <Clock className="h-4 w-4" /> },
    { key: '7d', label: str.t7, icon: <CalendarDays className="h-4 w-4" /> },
    { key: 'epi22', label: str.tEpi, icon: <CalendarRange className="h-4 w-4" /> },
  ];

  return (
    <div className="gov-panel flex w-full items-center justify-center gap-2 px-2 py-2 shadow-float lg:w-auto">
      <span className="gov-eyebrow ml-1 mr-1 hidden sm:inline">{str.filterLabel}</span>
      <div className="flex w-full items-center gap-1 rounded-lg bg-panel p-1 lg:w-auto">
        {options.map((opt) => {
          const active = time === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => onTime(opt.key)}
              aria-pressed={active}
              className={`gov-focus flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-2 text-[11px] font-semibold transition-all sm:gap-2 sm:px-3.5 sm:text-[12px] lg:flex-none ${
                active ? 'bg-navy text-white shadow-sm' : 'text-muted hover:bg-white hover:text-navy'
              }`}
            >
              <span className="hidden shrink-0 sm:inline-flex">{opt.icon}</span>
              <span className="whitespace-nowrap">{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
