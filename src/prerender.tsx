// Prerender entry (used by scripts/prerender.mjs at build time). Renders the
// fully-static public pages to HTML strings so those routes ship real content
// instead of an empty JS-only shell. Only pages with no data/auth dependency
// are listed here; data-driven and 3D pages stay client-rendered.
import { renderToString } from 'react-dom/server';
import type { ReactElement } from 'react';
import MilkScreeningPage from './components/verticals/MilkScreeningPage';
import GlassLoginPage from './components/GlassLoginPage';
import IntegrationPage from './components/IntegrationPage';

const ROUTES: Record<string, () => ReactElement> = {
  '/verticals/milk-screening': () => <MilkScreeningPage />,
  '/glass-login': () => <GlassLoginPage />,
  '/integration': () => <IntegrationPage />,
};

export const PRERENDER_ROUTES = Object.keys(ROUTES);

export function renderRoute(route: string): string {
  const Page = ROUTES[route];
  return Page ? renderToString(Page()) : '';
}
