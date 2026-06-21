import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { TimeKey } from '../data/blocks';
import { BLOCKS } from '../data/blocks';
import type { Lang, Strings } from '../lib/i18n';
import MapTerrain from './three/MapTerrain';
import BlockMarker from './three/BlockMarker';

interface SceneProps {
  time: TimeKey;
  lang: Lang;
  str: Strings;
  selectedId: string | null;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}

export default function Scene({
  time,
  lang,
  str,
  selectedId,
  hoveredId,
  onHover,
  onSelect,
}: SceneProps) {
  return (
    <Canvas
      className="absolute inset-0"
      shadows
      dpr={[1, 2]}
      gl={{ antialias: true, preserveDrawingBuffer: false }}
      onPointerMissed={() => onSelect(null)}
    >
      <color attach="background" args={['#e9eff6']} />

      <PerspectiveCamera makeDefault position={[0, 17, 24]} fov={36} near={0.1} far={200} />

      {/* bright daylight rig */}
      <ambientLight intensity={0.85} />
      <hemisphereLight intensity={0.55} color="#ffffff" groundColor="#cfd8e3" />
      <directionalLight
        position={[14, 20, 10]}
        intensity={1.6}
        color="#fffaf2"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-24}
        shadow-camera-right={24}
        shadow-camera-top={24}
        shadow-camera-bottom={-24}
        shadow-camera-near={1}
        shadow-camera-far={80}
        shadow-bias={-0.0004}
      />
      <directionalLight position={[-12, 10, -8]} intensity={0.35} color="#dce7f2" />

      <Suspense fallback={null}>
        <MapTerrain />
        {BLOCKS.map((block) => (
          <BlockMarker
            key={block.id}
            block={block}
            time={time}
            lang={lang}
            str={str}
            selected={selectedId === block.id}
            hovered={hoveredId === block.id}
            onHover={onHover}
            onSelect={onSelect}
          />
        ))}
      </Suspense>

      <OrbitControls
        makeDefault
        enablePan
        enableDamping
        dampingFactor={0.08}
        minDistance={9}
        maxDistance={40}
        maxPolarAngle={Math.PI * 0.46}
        target={[0, 0.8, 1]}
      />

      <AdaptiveDpr pixelated />
    </Canvas>
  );
}
