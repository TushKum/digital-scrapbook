// ──────────────────────────────────────────────────────────────────────────
// Client for the NEERVANA surveillance API. In dev, requests hit same-origin
// `/api/*` which Vite proxies to the Express backend; in production set
// VITE_API_URL to the deployed API origin. A bearer token (from login) is
// attached automatically and persisted to localStorage.
// ──────────────────────────────────────────────────────────────────────────
import type { Block } from '../data/blocks';
import type { Lang } from './i18n';

const BASE = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '');
const TOKEN_KEY = 'neervana.token';

let authToken: string | null = readStoredToken();

function readStoredToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  authToken = token;
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable — keep in-memory token only */
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

// Error carrying the HTTP status + the API's machine code/message.
export class ApiError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  signal?: AbortSignal;
}

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (opts.body !== undefined) headers['Content-Type'] = 'application/json';
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const res = await fetch(`${BASE}${path}`, {
    method: opts.method ?? 'GET',
    signal: opts.signal,
    headers,
    body: opts.body !== undefined ? JSON.stringify(opts.body) : undefined,
  });

  if (!res.ok) {
    let message = `${res.status} ${res.statusText}`;
    let code = 'http_error';
    try {
      const j = (await res.json()) as { error?: string; message?: string };
      if (j.message) message = j.message;
      if (j.error) code = j.error;
    } catch {
      /* non-JSON error body */
    }
    throw new ApiError(res.status, code, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ── auth ────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  username: string;
  displayName: string;
  role: string;
}

export async function login(username: string, password: string): Promise<{ token: string; user: AuthUser }> {
  return request<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: { username, password },
  });
}

export async function fetchMe(signal?: AbortSignal): Promise<AuthUser> {
  const r = await request<{ user: AuthUser }>('/api/auth/me', { signal });
  return r.user;
}

// ── surveillance data ─────────────────────────────────────────────────────
export function fetchBlocks(signal?: AbortSignal): Promise<Block[]> {
  return request<Block[]>('/api/blocks', { signal });
}

export function fetchDispatches(signal?: AbortSignal): Promise<Record<Lang, string[]>> {
  return request<Record<Lang, string[]>>('/api/dispatches', { signal });
}

export interface Bootstrap {
  blocks: Block[];
  dispatches: Record<Lang, string[]>;
}

// Single round-trip used on app load.
export async function fetchBootstrap(signal?: AbortSignal): Promise<Bootstrap> {
  const [blocks, dispatches] = await Promise.all([fetchBlocks(signal), fetchDispatches(signal)]);
  return { blocks, dispatches };
}
