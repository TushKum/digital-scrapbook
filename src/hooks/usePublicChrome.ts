import { useEffect, useState } from 'react';
import type { Lang } from '../lib/i18n';

const FONT_PX = [14, 16, 18];

// Statutory accessibility chrome (text size, high contrast, language) for
// public pages that render outside the authenticated App shell. Mirrors the
// exact behaviour App.tsx applies for the dashboard: rem-base scaling and the
// data-contrast attribute on <html>.
export function usePublicChrome() {
  const [textScale, setTextScale] = useState(1);
  const [contrast, setContrast] = useState(false);
  const [lang, setLang] = useState<Lang>('EN');

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

  return { textScale, setTextScale, contrast, setContrast, lang, setLang };
}
