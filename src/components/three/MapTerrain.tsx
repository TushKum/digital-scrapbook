import { useMemo } from 'react';
import { Grid, Line, RoundedBox } from '@react-three/drei';
import { CatmullRomCurve3, Vector3 } from 'three';
import { CANAL_PATH } from '../../data/blocks';

// Clean "clay-model" GIS base for Patiala district: a soft off-white plinth, a
// light topographic grid and a stylised canal branch for geographic context.
export default function MapTerrain() {
  const canalPoints = useMemo(() => {
    const pts = CANAL_PATH.map(([x, z]) => new Vector3(x, 0.06, z));
    const curve = new CatmullRomCurve3(pts);
    return curve.getPoints(60);
  }, []);

  return (
    <group>
      {/* district plinth */}
      <RoundedBox
        args={[34, 0.8, 30]}
        radius={0.5}
        smoothness={4}
        position={[0, -0.4, 1]}
        receiveShadow
      >
        <meshStandardMaterial color="#f3f5f8" metalness={0} roughness={0.95} />
      </RoundedBox>

      {/* subtle inner mat to lift the markers off the plinth */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 1]} receiveShadow>
        <planeGeometry args={[31, 27]} />
        <meshStandardMaterial color="#fcfdfe" roughness={1} metalness={0} />
      </mesh>

      {/* topographic survey grid */}
      <Grid
        position={[0, 0.02, 1]}
        args={[31, 27]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#d7dde5"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#aeb8c4"
        fadeDistance={60}
        fadeStrength={1}
        infiniteGrid={false}
      />

      {/* canal branch */}
      <Line points={canalPoints} color="#6aa9d8" lineWidth={2.4} transparent opacity={0.75} />
      <Line points={canalPoints} color="#bcdcf2" lineWidth={5} transparent opacity={0.35} />
    </group>
  );
}
