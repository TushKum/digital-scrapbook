import { useEffect, useMemo, useState } from 'react';
import type { TimeKey } from './data/blocks';
import type { Lang } from './lib/i18n';
import { STRINGS } from './lib/i18n';
import { aggregate } from './lib/metrics';
import { useBootstrap } from './hooks/useBootstrap';
import { useAuth } from './hooks/useAuth';
import TopUtilityBar from './components/ui/TopUtilityBar';
import Header from './components/ui/Header';
import Ticker from './components/ui/Ticker';
import SurveillancePanel from './components/ui/SurveillancePanel';
import ResourcePanel from './components/ui/ResourcePanel';
import TimeFilter from './components/ui/TimeFilter';
import ResponseBoard from './components/ui/ResponseBoard';
import BootStatus from './components/ui/BootStatus';
import LoginPage from './components/ui/LoginPage';
import MilkScreeningPage from './components/verticals/MilkScreeningPage';
import VillagerAdvisory from './components/dashboards/VillagerAdvisory';
import AshaDashboard from './components/dashboards/AshaDashboard';
import GlassLoginPage from './components/GlassLoginPage';
import IntegrationPage from './components/IntegrationPage';
import NotFound from './components/ui/NotFound';

const FONT_PX = [14, 16, 18];

// Public routes served without authentication. Navigation is plain <a href>
// full-page loads; the SPA fallback (vite dev + Vercel routes) returns
// index.html for any path, so deep links work.
const PUBLIC_ROUTES: Record<string, () => React.JSX.Element> = {
  '/verticals/milk-screening': () => <MilkScreeningPage />,
  '/advisory': () => <VillagerAdvisory />,
  '/glass-login': () => <GlassLoginPage />,
  '/integration': () => <IntegrationPage />,
};

// Authenticated routes (rendered only once signed in).
const ASHA_ROUTE = '/asha';

export default function App() {
  const [time, setTime] = useState<TimeKey>('epi22');
  const [lang, setLang] = useState<Lang>('EN');
  const [textScale, setTextScale] = useState(1);
  const [contrast, setContrast] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const auth = useAuth();
  const authed = auth.status === 'authenticated';

  // Public pages bypass the auth gate entirely. Normalise trailing slashes so
  // pasted links like /verticals/milk-screening/ still resolve.
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  const publicPage = PUBLIC_ROUTES[path];

  // Any path that isn't a known route is a 404 (rendered regardless of auth;
  // vercel.json serves this with a real HTTP 404 status).
  const isKnownRoute = path === '/' || path === ASHA_ROUTE || path in PUBLIC_ROUTES;

  // Surveillance dataset loads from the backend once authenticated.
  const { status, blocks, dispatches, error, reload } = useBootstrap(authed);

  // Accessibility: scale the rem base + toggle high-contrast on the document.
  useEffect(() => {
    document.documentElement.style.fontSize = `${FONT_PX[textScale] ?? 16}px`;
    return () => {
      document.documentElement.style.fontSize = '';
    };
  }, [textScale]);

  useEffect(() => {
    document.documentElement.setAttribute('data-contrast', contrast ? 'true' : 'false');
    return () => {
      document.documentElement.removeAttribute('data-contrast');
    };
  }, [contrast]);

  const str = STRINGS[lang];
  const agg = useMemo(() => aggregate(blocks, time), [blocks, time]);
  const ready = status === 'ready';

  // Unknown route → public 404 page (rendered after hooks to keep hook order
  // stable across routes).
  if (!isKnownRoute) {
    return <NotFound />;
  }

  // Public vertical page (no sign-in required).
  if (publicPage) {
    return publicPage();
  }

  // Restoring a stored session.
  if (auth.status === 'checking') {
    return (
      <main className="grid h-screen w-screen place-items-center bg-navy-tint">
        <div className="flex flex-col items-center gap-3">
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-navy/20 border-t-navy" />
          <p className="text-sm font-medium text-muted">Restoring session…</p>
        </div>
      </main>
    );
  }

  // Auth gate.
  if (!authed) {
    return (
      <LoginPage
        str={str}
        error={auth.loginError}
        loading={auth.loginPending}
        onSignIn={auth.login}
      />
    );
  }

  // Authenticated ASHA field dashboard — fed by this shell's data + chrome so
  // there is no duplicate fetch or accessibility-effect.
  if (path === ASHA_ROUTE) {
    return (
      <AshaDashboard
        blocks={blocks}
        dispatches={dispatches}
        status={status}
        error={error}
        reload={reload}
        user={auth.user}
        onSignOut={auth.logout}
        lang={lang}
        onLang={setLang}
        textScale={textScale}
        onTextScale={setTextScale}
        contrast={contrast}
        onContrast={setContrast}
      />
    );
  }

  return (
    <main className="relative flex h-screen w-screen flex-col overflow-hidden bg-panel lg:block">
      {/* Top stack: utility strip + masthead + ticker. Fixed at the top on
          mobile (in-flow, non-scrolling); absolutely pinned on desktop. */}
      <div className="z-30 shrink-0 lg:absolute lg:inset-x-0 lg:top-0">
        <TopUtilityBar
          str={str}
          textScale={textScale}
          onTextScale={setTextScale}
          contrast={contrast}
          onContrast={setContrast}
          lang={lang}
          onLang={setLang}
        />
        <Header str={str} user={auth.user} onSignOut={auth.logout} />
        <Ticker messages={dispatches[lang]} str={str} />
      </div>

      {ready ? (
        /* Mobile: one vertical scroll column (panels stacked full-width).
           Desktop (lg): `display:contents` dissolves this wrapper so each panel
           positions absolutely against <main>, restoring the wall layout. */
        <div className="gov-scroll flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3 lg:contents">
          {/* Reporting-window filter — top of the mobile stack; floating
              bottom-centre on desktop. */}
          <div className="lg:absolute lg:bottom-5 lg:left-1/2 lg:z-20 lg:-translate-x-1/2">
            <TimeFilter time={time} onTime={setTime} str={str} />
          </div>

          {/* Centre column — priority response board (replaced the 3D scene). */}
          <div className="lg:absolute lg:bottom-[4.75rem] lg:left-[22.5rem] lg:right-[22.5rem] lg:top-[8.75rem] lg:z-10">
            <ResponseBoard
              blocks={blocks}
              time={time}
              lang={lang}
              str={str}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          </div>

          {/* Left surveillance panel */}
          <div className="lg:absolute lg:bottom-4 lg:left-4 lg:top-[8.75rem] lg:z-20">
            <SurveillancePanel
              blocks={blocks}
              time={time}
              lang={lang}
              str={str}
              agg={agg}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          </div>

          {/* Right resource panel */}
          <div className="lg:absolute lg:bottom-4 lg:right-4 lg:top-[8.75rem] lg:z-20">
            <ResourcePanel
              blocks={blocks}
              time={time}
              lang={lang}
              str={str}
              selectedId={selectedId}
              hoveredId={hoveredId}
              onSelect={setSelectedId}
              onHover={setHoveredId}
            />
          </div>
        </div>
      ) : (
        /* Boot gate while the API is loading / unreachable */
        <div className="grid flex-1 place-items-center p-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:top-[8.75rem] lg:z-20">
          <BootStatus status={status} error={error} onRetry={reload} />
        </div>
      )}
    </main>
  );
}
