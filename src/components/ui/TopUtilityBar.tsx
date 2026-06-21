import { Contrast, Languages } from 'lucide-react';
import type { Lang, Strings } from '../../lib/i18n';

interface Props {
  str: Strings;
  textScale: number;
  onTextScale: (n: number) => void;
  contrast: boolean;
  onContrast: (v: boolean) => void;
  lang: Lang;
  onLang: (l: Lang) => void;
}

// Thin official utility strip: government identity on the left, statutory
// accessibility controls (text size, high contrast, language) on the right.
export default function TopUtilityBar({
  str,
  textScale,
  onTextScale,
  contrast,
  onContrast,
  lang,
  onLang,
}: Props) {
  return (
    <div className="flex h-8 items-center justify-between bg-navy-dark px-4 text-white">
      <p className="truncate text-[11px] font-medium tracking-wide text-white/85">
        {str.govtLine}
      </p>

      <div className="flex items-center gap-3">
        {/* Text size A- A A+ */}
        <div className="flex items-center gap-1" aria-label={str.textSize}>
          <span className="mr-1 hidden text-[10px] uppercase tracking-wide text-white/60 sm:inline">
            {str.textSize}
          </span>
          {[
            { i: 0, label: 'A-', cls: 'text-[10px]' },
            { i: 1, label: 'A', cls: 'text-[12px]' },
            { i: 2, label: 'A+', cls: 'text-[14px]' },
          ].map((b) => (
            <button
              key={b.i}
              onClick={() => onTextScale(b.i)}
              aria-pressed={textScale === b.i}
              className={`gov-focus grid h-5 w-6 place-items-center rounded leading-none ${b.cls} ${
                textScale === b.i ? 'bg-white text-navy' : 'text-white/80 hover:bg-white/15'
              }`}
            >
              {b.label}
            </button>
          ))}
        </div>

        <span className="h-4 w-px bg-white/25" />

        {/* High contrast */}
        <button
          onClick={() => onContrast(!contrast)}
          aria-pressed={contrast}
          className={`gov-focus flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] ${
            contrast ? 'bg-white text-navy' : 'text-white/80 hover:bg-white/15'
          }`}
          title={str.highContrast}
        >
          <Contrast className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{str.highContrast}</span>
        </button>

        <span className="h-4 w-px bg-white/25" />

        {/* Language EN / PA */}
        <div className="flex items-center gap-1" aria-label={str.language}>
          <Languages className="h-3.5 w-3.5 text-white/70" />
          {(['EN', 'PA'] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => onLang(l)}
              aria-pressed={lang === l}
              className={`gov-focus rounded px-1.5 py-0.5 text-[11px] font-semibold ${
                lang === l ? 'bg-white text-navy' : 'text-white/80 hover:bg-white/15'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
