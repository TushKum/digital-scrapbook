import { Megaphone } from 'lucide-react';
import type { Lang, Strings } from '../../lib/i18n';
import { DISPATCHES } from '../../lib/i18n';

interface Props {
  lang: Lang;
  str: Strings;
}

// Public notification ticker — a continuously scrolling marquee of official
// dispatches. The track is duplicated so the CSS translate loop is seamless.
export default function Ticker({ lang, str }: Props) {
  const items = DISPATCHES[lang];

  return (
    <div className="flex h-9 items-stretch border-b border-saffron/40 bg-saffron-tint">
      <div className="flex shrink-0 items-center gap-1.5 bg-saffron px-3 text-white">
        <Megaphone className="h-3.5 w-3.5" />
        <span className="text-[11px] font-bold uppercase tracking-wide">{str.dispatches}</span>
      </div>

      <div className="group relative flex-1 overflow-hidden">
        <div className="absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-saffron-tint to-transparent" />
        <div className="absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-saffron-tint to-transparent" />
        <div className="flex h-full w-max animate-marquee items-center group-hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center" aria-hidden={dup === 1}>
              {items.map((msg, i) => (
                <span key={`${dup}-${i}`} className="flex items-center">
                  <span className="mx-3 h-1.5 w-1.5 rounded-full bg-saffron-dark" />
                  <span className="whitespace-nowrap text-[12px] font-medium text-navy-dark">
                    {msg}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
