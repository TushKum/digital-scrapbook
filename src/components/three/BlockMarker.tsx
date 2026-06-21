import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { ThreeEvent } from '@react-three/fiber';
import { Html, RoundedBox } from '@react-three/drei';
import { Color, Group, Mesh, MeshStandardMaterial } from 'three';
import type { Block, TimeKey } from '../../data/blocks';
import type { Lang, Strings } from '../../lib/i18n';
import {
  blockName,
  caseIntensity,
  snapshot,
  snapshotStatus,
  STATUS_COLOR,
  statusLabel,
  wqiStatus,
} from '../../lib/metrics';

interface Props {
  block: Block;
  time: TimeKey;
  lang: Lang;
  str: Strings;
  selected: boolean;
  hovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: (id: string | null) => void;
}

const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

export default function BlockMarker({
  block,
  time,
  lang,
  str,
  selected,
  hovered,
  onHover,
  onSelect,
}: Props) {
  const plateRef = useRef<Mesh>(null);
  const stemRef = useRef<Mesh>(null);
  const headGroupRef = useRef<Group>(null);
  const headRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  const barHRef = useRef(0.6);
  const headScaleRef = useRef(1);
  const plateColorRef = useRef(new Color('#ffffff'));

  const [x, z] = block.position;
  const [aw, ad] = block.area;
  const s = snapshot(block, time);
  const status = snapshotStatus(s);
  const statusColor = useMemo(() => new Color(STATUS_COLOR[status]), [status]);
  const intensity = caseIntensity(s);
  const active = hovered || selected;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const targetH = 0.5 + intensity * 2.6;
    barHRef.current = damp(barHRef.current, targetH, 7, dt);
    const h = barHRef.current;

    headScaleRef.current = damp(headScaleRef.current, active ? 1.28 : 1, 10, dt);

    if (stemRef.current) {
      stemRef.current.scale.y = h;
      stemRef.current.position.y = h / 2;
    }
    if (headGroupRef.current) {
      headGroupRef.current.position.y = h + (active ? 0.12 : 0);
    }
    if (headRef.current) {
      headRef.current.scale.setScalar(headScaleRef.current);
    }

    // plate tint: white → status colour, stronger when active
    const targetTint = new Color('#ffffff').lerp(statusColor, active ? 0.34 : 0.18);
    plateColorRef.current.lerp(targetTint, 1 - Math.exp(-9 * dt));
    if (plateRef.current) {
      const mat = plateRef.current.material as MeshStandardMaterial;
      mat.color.copy(plateColorRef.current);
      plateRef.current.position.y = damp(plateRef.current.position.y, active ? 0.26 : 0.2, 9, dt);
    }
    if (ringRef.current) {
      const target = selected ? 1.12 : 1;
      const sc = damp(ringRef.current.scale.x, target, 9, dt);
      ringRef.current.scale.set(sc, sc, sc);
      (ringRef.current.material as MeshStandardMaterial).opacity = selected ? 1 : 0.85;
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(block.id);
    document.body.style.cursor = 'pointer';
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    onHover(null);
    document.body.style.cursor = 'auto';
  };
  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(selected ? null : block.id);
  };

  const wqiColor = STATUS_COLOR[wqiStatus(s.wqi)];

  return (
    <group position={[x, 0, z]}>
      {/* footprint plate (clay tile) */}
      <RoundedBox
        ref={plateRef}
        args={[aw, 0.4, ad]}
        radius={0.12}
        smoothness={4}
        position={[0, 0.2, 0]}
        castShadow
        receiveShadow
        onPointerOver={onOver}
        onPointerOut={onOut}
        onClick={onClick}
      >
        <meshStandardMaterial color="#ffffff" roughness={0.85} metalness={0} />
      </RoundedBox>

      {/* status footprint ring */}
      <mesh ref={ringRef} position={[0, 0.405, 0]} rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
        <ringGeometry args={[Math.min(aw, ad) * 0.34, Math.min(aw, ad) * 0.4, 48]} />
        <meshStandardMaterial color={STATUS_COLOR[status]} transparent opacity={0.85} roughness={0.6} />
      </mesh>

      {/* proportional pin (height ∝ active cases) */}
      <group position={[0, 0.4, 0]}>
        <mesh ref={stemRef} position={[0, 0.3, 0]} castShadow raycast={() => null}>
          <cylinderGeometry args={[0.05, 0.05, 1, 12]} />
          <meshStandardMaterial color="#003366" roughness={0.5} metalness={0.1} />
        </mesh>

        <group ref={headGroupRef} position={[0, 0.6, 0]}>
          <mesh ref={headRef} castShadow onPointerOver={onOver} onPointerOut={onOut} onClick={onClick}>
            <sphereGeometry args={[0.26, 24, 24]} />
            <meshStandardMaterial color={STATUS_COLOR[status]} roughness={0.35} metalness={0.05} />
          </mesh>
          {/* white collar ring for the official map-pin look */}
          <mesh rotation={[Math.PI / 2, 0, 0]} raycast={() => null}>
            <torusGeometry args={[0.27, 0.035, 12, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </mesh>

          {/* hover / selected detail tooltip */}
          {active && (
            <Html position={[0, 0.55, 0]} center distanceFactor={11} zIndexRange={[40, 0]} style={{ pointerEvents: 'none' }}>
              <div className="w-52 animate-fade-in rounded-lg border border-gray-200 bg-white p-2.5 text-left shadow-float">
                <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-1.5">
                  <span className="text-[13px] font-bold text-navy">{blockName(block, lang)}</span>
                  <span
                    className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white"
                    style={{ background: STATUS_COLOR[status] }}
                  >
                    {statusLabel(status, str)}
                  </span>
                </div>
                <dl className="mt-1.5 space-y-1">
                  <Row label={str.tipCases} value={`${s.activeCases}`} />
                  <Row label={str.tipWqi} value={`${s.wqi}/100`} valueColor={wqiColor} />
                  <Row label={str.tipTurbidity} value={`${s.turbidity} NTU`} />
                  <Row label={str.tipPhc} value={block.phc} small />
                </dl>
              </div>
            </Html>
          )}
        </group>
      </group>

      {/* always-on block label */}
      <Html position={[0, 0.16, ad * 0.5 + 0.4]} center distanceFactor={13} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div
          className="whitespace-nowrap rounded border bg-white/95 px-1.5 py-0.5 text-[10px] font-semibold text-navy shadow-sm"
          style={{ borderColor: active ? STATUS_COLOR[status] : '#e5e7eb' }}
        >
          {blockName(block, lang)}
        </div>
      </Html>
    </group>
  );
}

function Row({
  label,
  value,
  valueColor,
  small,
}: {
  label: string;
  value: string;
  valueColor?: string;
  small?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <dt className="text-[10px] text-muted">{label}</dt>
      <dd
        className={`font-semibold ${small ? 'text-[10px]' : 'text-[11px]'}`}
        style={{ color: valueColor ?? '#1f2937' }}
      >
        {value}
      </dd>
    </div>
  );
}
