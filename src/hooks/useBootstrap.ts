import { useCallback, useEffect, useState } from 'react';
import type { Block } from '../data/blocks';
import type { Lang } from '../lib/i18n';
import { fetchBootstrap } from '../lib/api';

export type BootStatus = 'loading' | 'ready' | 'error';

interface BootState {
  status: BootStatus;
  blocks: Block[];
  dispatches: Record<Lang, string[]>;
  error: string | null;
}

const EMPTY_DISPATCHES: Record<Lang, string[]> = { EN: [], PA: [] };

// Loads the surveillance dataset from the backend with loading/error states and
// a manual `reload()` for retry.
export function useBootstrap() {
  const [state, setState] = useState<BootState>({
    status: 'loading',
    blocks: [],
    dispatches: EMPTY_DISPATCHES,
    error: null,
  });

  const load = useCallback((signal?: AbortSignal) => {
    setState((s) => ({ ...s, status: 'loading', error: null }));
    fetchBootstrap(signal)
      .then((data) => {
        if (signal?.aborted) return;
        setState({
          status: 'ready',
          blocks: data.blocks,
          dispatches: data.dispatches,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (signal?.aborted) return;
        setState((s) => ({
          ...s,
          status: 'error',
          error: err instanceof Error ? err.message : 'Unknown error',
        }));
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return { ...state, reload: () => load() };
}
