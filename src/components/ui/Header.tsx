import { useEffect, useState } from 'react';
import { Landmark, LayoutDashboard, LogOut, RefreshCw, ShieldCheck, UserCircle2 } from 'lucide-react';
import type { Strings } from '../../lib/i18n';
import type { AuthUser } from '../../lib/api';

interface Props {
  str: Strings;
  user: AuthUser | null;
  onSignOut: () => void;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}

// Primary masthead: state emblem placeholder + portal identity on the left,
// sync status and the nodal-officer login on the right.
export default function Header({ str, user, onSignOut }: Props) {
  const now = useClock();
  const timeStr = now.toLocaleTimeString('en-IN', { hour12: false });
  const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4">
      <div className="flex items-center gap-3">
        {/* State emblem placeholder */}
        <div className="grid h-11 w-11 place-items-center rounded-full border-2 border-navy/20 bg-navy-tint">
          <Landmark className="h-6 w-6 text-navy" />
        </div>
        <div className="leading-tight">
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-extrabold tracking-tight text-navy">
              {str.portalTitle}
            </h1>
            <span className="hidden text-gray-300 sm:inline">|</span>
            <span className="hidden text-[13px] font-semibold text-ink sm:inline">
              {str.portalSub}
            </span>
          </div>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-muted">
            <ShieldCheck className="h-3 w-3 text-india-green" />
            {str.district} · {str.mapCaption}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <div className="flex items-center justify-end gap-1.5 text-[12px] font-semibold tabular-nums text-ink">
            <RefreshCw className="h-3 w-3 animate-pulse-dot text-india-green" />
            {timeStr} IST
          </div>
          <div className="text-[10px] text-muted">
            {str.lastUpdated} · {dateStr}
          </div>
        </div>
        <a
          href="/asha"
          aria-label="ASHA View"
          className="gov-focus hidden items-center gap-1.5 rounded-md border border-gray-200 bg-panel px-3 py-2 text-[12px] font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-navy-tint md:flex"
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="hidden lg:inline">ASHA View</span>
        </a>
        <div className="hidden items-center gap-2 rounded-md border border-gray-200 bg-panel px-3 py-1.5 lg:flex">
          <UserCircle2 className="h-5 w-5 text-navy" />
          <div className="leading-tight">
            <div className="text-[9px] uppercase tracking-wide text-muted">{str.signedInAs}</div>
            <div className="text-[12px] font-semibold text-navy">{user?.displayName ?? '—'}</div>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="gov-focus flex items-center gap-2 rounded-md bg-navy px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm transition-colors hover:bg-navy-light"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">{str.signOut}</span>
        </button>
      </div>
    </header>
  );
}
