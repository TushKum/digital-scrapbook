import { ArrowRight, Droplets, Key, LayoutDashboard, Milk, ShieldCheck, User } from 'lucide-react';
import { useState } from 'react';
import type { Strings } from '../../lib/i18n';
import { CpuArchitecture } from './cpu-architecture';

interface Props {
  str: Strings;
  error?: string | null;
  loading?: boolean;
  onSignIn: (username: string, password: string) => void;
}

export default function LoginPage({ str, error, loading = false, onSignIn }: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="grid min-h-screen place-items-center bg-navy-tint px-4 py-8">
      <div className="gov-panel w-full max-w-md space-y-8 border-navy/10 bg-white px-8 py-10 shadow-float">
        <div className="flex items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-navy text-white">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="gov-eyebrow-lg">{str.portalSub}</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-navy">
              {str.loginTitle}
            </h1>
          </div>
        </div>

        <div className="flex justify-center">
          <CpuArchitecture 
            width="120" 
            height="120" 
            text="SECURE"
            className="text-navy"
          />
        </div>

        <p className="text-sm leading-6 text-ink">{str.loginPrompt}</p>

        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            onSignIn(username, password);
          }}
        >
          <label className="grid gap-2 text-sm font-semibold text-ink">
            {str.username}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-panel px-3 py-2 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/20">
              <User className="h-4 w-4 text-muted" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder={str.usernamePlaceholder}
                className="w-full bg-transparent text-sm text-ink outline-none"
                autoComplete="username"
              />
            </div>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-ink">
            {str.password}
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-panel px-3 py-2 focus-within:border-navy focus-within:ring-2 focus-within:ring-navy/20">
              <Key className="h-4 w-4 text-muted" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={str.passwordPlaceholder}
                className="w-full bg-transparent text-sm text-ink outline-none"
                autoComplete="current-password"
              />
            </div>
          </label>

          {error ? <p className="text-sm text-critical">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="gov-focus flex w-full items-center justify-center gap-2 rounded-md bg-navy px-4 py-3 text-sm font-semibold text-white transition hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {loading ? str.loginPending : str.loginButton}
          </button>

          <p className="text-xs leading-5 text-muted">{str.loginHint}</p>
        </form>

        {/* Public entry points — no sign-in required */}
        <div className="space-y-2 border-t border-gray-200 pt-4">
          <p className="gov-eyebrow">Public Access</p>
          <a
            href="/advisory"
            className="gov-focus flex items-center justify-between rounded-lg border border-india-green/30 bg-india-greenTint px-3 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-india-green/50"
          >
            <span className="flex items-center gap-2">
              <Droplets className="h-4 w-4 text-india-green" aria-hidden="true" />
              Village Water &amp; Health Advisory
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="/verticals/milk-screening"
            className="gov-focus flex items-center justify-between rounded-lg border border-gray-200 bg-panel px-3 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-navy-tint"
          >
            <span className="flex items-center gap-2">
              <Milk className="h-4 w-4 text-navy" aria-hidden="true" />
              Milk Adulteration Screening
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href="/asha"
            className="gov-focus flex items-center justify-between rounded-lg border border-gray-200 bg-panel px-3 py-2.5 text-sm font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-navy-tint"
          >
            <span className="flex items-center gap-2">
              <LayoutDashboard className="h-4 w-4 text-navy" aria-hidden="true" />
              ASHA Field Dashboard
            </span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>
  );
}
