// ──────────────────────────────────────────────────────────────────────────
// Client for the NEERVANA surveillance API. In dev, requests hit same-origin
// `/api/*` which Vite proxies to the Express backend; in production set
// VITE_API_URL to the deployed API origin.
// ──────────────────────────────────────────────────────────────────────────
import type { Block } from '../data/blocks';
import type { Lang } from './i18n';

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`API ${path} failed: ${res.status} ${res.statusText}`);
  }
  return (await res.json()) as T;
}

export interface HealthResponse {
  status: string;
  service: string;
  district: string;
  blocks: number;
  time: string;
}

export function fetchHealth(signal?: AbortSignal): Promise<HealthResponse> {
  return getJson<HealthResponse>('/api/health', signal);
}

export function fetchBlocks(signal?: AbortSignal): Promise<Block[]> {
  return getJson<Block[]>('/api/blocks', signal);
}

export function fetchDispatches(signal?: AbortSignal): Promise<Record<Lang, string[]>> {
  return getJson<Record<Lang, string[]>>('/api/dispatches', signal);
}

export interface Bootstrap {
  blocks: Block[];
  dispatches: Record<Lang, string[]>;
}

// Single round-trip used on app load.
export async function fetchBootstrap(signal?: AbortSignal): Promise<Bootstrap> {
  const [blocks, dispatches] = await Promise.all([
    fetchBlocks(signal),
    fetchDispatches(signal),
  ]);
  return { blocks, dispatches };
}
