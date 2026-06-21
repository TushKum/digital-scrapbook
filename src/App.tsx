import { useEffect, useMemo, useState } from 'react';
import type { TimeKey } from './data/blocks';
import { BLOCKS } from './data/blocks';
import type { Lang } from './lib/i18n';
import { STRINGS } from './lib/i18n';
import { aggregate } from './lib/metrics';
import Scene from './components/Scene';
import TopUtilityBar from './components/ui/TopUtilityBar';
import Header from './components/ui/Header';
import Ticker from './components/ui/Ticker';
import SurveillancePanel from './components/ui/SurveillancePanel';
import ResourcePanel from './components/ui/ResourcePanel';
import TimeFilter from './components/ui/TimeFilter';
import MapLegend from './components/ui/MapLegend';

const FONT_PX = [14, 16, 18];

export default function App() {
  const [time, setTime] = useState<TimeKey>('epi22');
  const [lang, setLang] = useState<Lang>('EN');
  const [textScale, setTextScale] = useState(1);
  const [contrast, setContrast] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

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
  const agg = useMemo(() => aggregate(BLOCKS, time), [time]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-white">
      {/* 3D GIS map — full-bleed base viewport */}
      <Scene
        time={time}
        lang={lang}
        str={str}
        selectedId={selectedId}
        hoveredId={hoveredId}
        onHover={setHoveredId}
        onSelect={setSelectedId}
      />

      {/* Top stack: utility strip + masthead + ticker */}
      <div className="absolute inset-x-0 top-0 z-30">
        <TopUtilityBar
          str={str}
          textScale={textScale}
          onTextScale={setTextScale}
          contrast={contrast}
          onContrast={setContrast}
          lang={lang}
          onLang={setLang}
        />
        <Header str={str} />
        <Ticker lang={lang} str={str} />
      </div>

      {/* Left surveillance panel */}
      <div className="absolute bottom-4 left-4 top-[8.75rem] z-20">
        <SurveillancePanel
          blocks={BLOCKS}
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
      <div className="absolute bottom-4 right-4 top-[8.75rem] z-20">
        <ResourcePanel
          blocks={BLOCKS}
          time={time}
          lang={lang}
          str={str}
          selectedId={selectedId}
          hoveredId={hoveredId}
          onSelect={setSelectedId}
          onHover={setHoveredId}
        />
      </div>

      {/* Floating map legend + compass */}
      <div className="absolute left-1/2 top-[9.25rem] z-20 -translate-x-1/2">
        <MapLegend str={str} agg={agg} />
      </div>

      {/* Bottom reporting-window filter */}
      <div className="absolute bottom-5 left-1/2 z-20 -translate-x-1/2">
        <TimeFilter time={time} onTime={setTime} str={str} />
      </div>
    </main>
  );
}
