import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props {
  status: 'loading' | 'error';
  error: string | null;
  onRetry: () => void;
}

// Central boot gate shown while the surveillance dataset is fetched from the
// backend, or when the API is unreachable.
export default function BootStatus({ status, error, onRetry }: Props) {
  return (
    <div className="gov-panel w-[28rem] max-w-[calc(100vw-2rem)] p-7 text-center shadow-float">
      {status === 'loading' ? (
        <>
          <div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-[3px] border-navy/15 border-t-navy" />
          <h2 className="text-[15px] font-bold text-navy">Connecting to Surveillance Gateway</h2>
          <p className="mt-1 text-[12px] text-muted">
            Fetching block-level IDSP, water-quality &amp; stock data from the NEERVANA API…
          </p>
          <code className="mt-3 inline-block rounded bg-panel px-2 py-1 font-mono text-[11px] text-muted">
            GET /api/blocks · /api/dispatches
          </code>
        </>
      ) : (
        <>
          <div className="mx-auto mb-3 grid h-11 w-11 place-items-center rounded-full bg-critical-tint text-critical">
            <AlertCircle className="h-6 w-6" />
          </div>
          <h2 className="text-[15px] font-bold text-navy">Surveillance API Unreachable</h2>
          <p className="mt-1 text-[12px] text-muted">
            Could not load district data. Ensure the backend is running.
          </p>
          {error && (
            <code className="mt-2 inline-block max-w-full overflow-hidden text-ellipsis rounded bg-critical-tint px-2 py-1 font-mono text-[10px] text-critical">
              {error}
            </code>
          )}
          <div className="mt-4 flex items-center justify-center gap-2">
            <button
              onClick={onRetry}
              className="gov-focus flex items-center gap-2 rounded-md bg-navy px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-navy-light"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </button>
          </div>
          <p className="mt-3 font-mono text-[10px] text-muted">
            dev: <span className="text-ink">npm run dev</span> starts web + api together
          </p>
        </>
      )}
    </div>
  );
}
