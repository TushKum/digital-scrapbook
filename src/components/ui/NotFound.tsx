import { AlertTriangle, ArrowRight, Landmark } from 'lucide-react';

// Public 404 page. Rendered by App for any unknown route; vercel.json serves
// it with a real HTTP 404 status (not the 200 the SPA fallback used to give).
export default function NotFound() {
  const path = typeof window !== 'undefined' ? window.location.pathname : '';
  const links = [
    { href: '/', label: 'Command Centre' },
    { href: '/advisory', label: 'Village Water & Health Advisory' },
    { href: '/verticals/milk-screening', label: 'Milk Adulteration Screening' },
  ];
  return (
    <main className="grid min-h-screen place-items-center bg-navy-tint px-4 py-8">
      <div className="gov-panel w-full max-w-md space-y-6 px-8 py-10 text-center shadow-float">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-saffron-tint text-saffron-dark">
          <AlertTriangle className="h-7 w-7" />
        </div>
        <div>
          <p className="text-5xl font-extrabold tracking-tight text-navy">404</p>
          <h1 className="mt-2 text-lg font-bold text-ink">Page not found</h1>
          <p className="mt-1 break-all text-sm text-muted">
            No page exists at <span className="font-mono text-ink">{path}</span>.
          </p>
        </div>
        <div className="space-y-2 border-t border-gray-200 pt-4 text-left">
          <p className="gov-eyebrow">Go to</p>
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="gov-focus flex items-center justify-between rounded-lg border border-gray-200 bg-panel px-3 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-navy-tint"
            >
              {l.label}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          ))}
        </div>
        <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
          <Landmark className="h-3.5 w-3.5" />
          NEERVANA · Patiala District
        </p>
      </div>
    </main>
  );
}
