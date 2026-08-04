import { Info } from 'lucide-react';

// Honest provenance footer for any screen that renders figures. The data is a
// seeded demonstration dataset (not live field surveillance), and this says so
// plainly with the source, method and build date — so numbers can't read as
// undated/unsourced mock data pretending to be real.
export default function DataProvenance({ className = '' }: { className?: string }) {
  const built = typeof __BUILD_TIME__ === 'string' ? __BUILD_TIME__ : '—';
  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-gray-200 bg-panel px-3 py-2.5 text-[11px] leading-4 text-muted ${className}`}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <p>
        <span className="font-semibold text-ink">Demonstration data.</span>{' '}
        Seeded sample dataset for Patiala district blocks — not live field surveillance.{' '}
        <span className="whitespace-nowrap">Source: NEERVANA seed (server/src/db/seed).</span>{' '}
        <span className="whitespace-nowrap">Method: static values per reporting window (24h / 7d / Epi-Week 22).</span>{' '}
        <span className="whitespace-nowrap">Build: {built}.</span>
      </p>
    </div>
  );
}
