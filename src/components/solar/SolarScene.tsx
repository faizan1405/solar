import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export type ScrollState = { target: number; current: number };

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const range = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const C = {
  concrete: "#e7e3d7",
  concreteDark: "#cfcabb",
  glass: "#1d2a2a",
  wood: "#9a6a43",
  panel: "#16233a",
  frame: "#c9ccd0",
  ground: "#ece9dc",
  lawn: "#a9b48c",
  sun: "#f6c445",
  volt: "#b6f24a",
};

const ROOF_Y = 4.75;
const SUN_POS = new THREE.Vector3(-9, 13, -7);
const ROOF_CENTER = new THREE.Vector3(0.3, ROOF_Y + 0.4, 0);

// Camera keyframes: [progress, position, lookAt]
const CAM: [number, [number, number, number], [number, number, number]][] = [
  [0, [15, 5, 19], [0, 2.6, 0]],
  [0.3, [10, 10, 12], [0, 4, 0]],
  [0.55, [3, 12, 13], [-1, 5, 0]],
  [0.8, [12, 4.5, 11], [0, 2.4, 0]],
  [1, [-14, 7, 18], [0, 2.8, 0]],
];

function camAt(p: number) {
  let i = 0;
  while (i < CAM.length - 2 && p > CAM[i + 1]![0]) i++;
  const [p0, a0, l0] = CAM[i]!;
  const [p1, a1, l1] = CAM[i + 1]!;
  const t = THREE.MathUtils.smoothstep(p, p0, p1);
  const pos = new THREE.Vector3(...a0).lerp(new THREE.Vector3(...a1), t);
  const look = new THREE.Vector3(...l0).lerp(new THREE.Vector3(...l1), t);
  return { pos, look };
}

function House() {
  return (
    <group>
      {/* plinth */}
      <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
        <boxGeometry args={[9, 0.2, 6]} />
        <meshStandardMaterial color={C.concreteDark} roughness={0.9} />
      </mesh>
      {/* ground floor */}
      <mesh position={[-0.6, 1.35, 0]} castShadow receiveShadow>
        <boxGeometry args={[6.2, 2.3, 4.2]} />
        <meshStandardMaterial color={C.concrete} roughness={0.85} />
      </mesh>
      <mesh position={[-0.9, 1.3, 2.11]}>
        <boxGeometry args={[4.4, 1.7, 0.04]} />
        <meshStandardMaterial color={C.glass} metalness={0.6} roughness={0.15} />
      </mesh>
      <mesh position={[2.0, 1.3, 2.12]}>
        <boxGeometry args={[0.9, 1.9, 0.05]} />
        <meshStandardMaterial color={C.wood} roughness={0.7} />
      </mesh>
      {/* cantilever slab */}
      <mesh position={[0.2, 2.6, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[8.4, 0.22, 5.2]} />
        <meshStandardMaterial color={C.concrete} roughness={0.8} />
      </mesh>
      {/* upper floor */}
      <mesh position={[0.6, 3.65, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[6.6, 1.9, 4]} />
        <meshStandardMaterial color={C.concrete} roughness={0.85} />
      </mesh>
      <mesh position={[0.1, 3.6, 1.91]}>
        <boxGeometry args={[4.8, 1.3, 0.04]} />
        <meshStandardMaterial color={C.glass} metalness={0.6} roughness={0.12} />
      </mesh>
      {/* wood slats */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`s${i}`} position={[2.75 + i * 0.12, 3.6, 1.96]} castShadow>
          <boxGeometry args={[0.06, 1.5, 0.08]} />
          <meshStandardMaterial color={C.wood} roughness={0.6} />
        </mesh>
      ))}
      {/* roof slab */}
      <mesh position={[0.4, ROOF_Y - 0.1, -0.1]} castShadow receiveShadow>
        <boxGeometry args={[7.4, 0.2, 4.6]} />
        <meshStandardMaterial color={C.concreteDark} roughness={0.8} />
      </mesh>
      {/* boundary wall */}
      <mesh position={[0, 0.5, 4.2]} castShadow receiveShadow>
        <boxGeometry args={[11, 1, 0.25]} />
        <meshStandardMaterial color={C.concrete} roughness={0.9} />
      </mesh>
      {/* trees: simple stylized */}
      {([[-5.5, 3.2], [5.2, 2.6], [6.2, -2.4], [-6, -2]] as [number, number][]).map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.8, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.09, 1.6]} />
            <meshStandardMaterial color="#5b4636" />
          </mesh>
          <mesh position={[0, 2, 0]} castShadow>
            <icosahedronGeometry args={[0.85, 0]} />
            <meshStandardMaterial color={i % 2 ? "#6f8a55" : "#7f9a5e"} roughness={1} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  );
}

const PANEL_SLOTS = (() => {
  const s: [number, number][] = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) s.push([-1.9 + c * 1.55, -1.3 + r * 1.15]);
  return s;
})();

function Panels({ state }: { state: ScrollState }) {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const glow = useRef<THREE.MeshStandardMaterial[]>([]);
  useFrame(() => {
    const p = state.current;
    const lit = range(p, 0.36, 0.55);
    refs.current.forEach((g, i) => {
      if (!g) return;
      const t = ease(range(p, 0.1 + i * 0.012, 0.26 + i * 0.012));
      g.position.y = ROOF_Y + 0.25 + (1 - t) * 5;
      g.rotation.y = (1 - t) * Math.PI * 0.9;
      g.scale.setScalar(0.001 + t);
    });
    glow.current.forEach((m) => {
      if (m) m.emissiveIntensity = lit * 0.35;
    });
  });
  return (
    <group>
      {PANEL_SLOTS.map(([x, z], i) => (
        <group key={i} ref={(el) => (refs.current[i] = el)} position={[x + 0.4, ROOF_Y, z - 0.1]}>
          <group rotation={[-0.32, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[1.45, 0.05, 1.0]} />
              <meshStandardMaterial color={C.frame} metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.03, 0]}>
              <boxGeometry args={[1.38, 0.02, 0.93]} />
              <meshStandardMaterial
                ref={(m) => { if (m) glow.current[i] = m; }}
                color={C.panel}
                metalness={0.7}
                roughness={0.18}
                emissive={C.sun}
                emissiveIntensity={0}
              />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
}

function Sun({ state }: { state: ScrollState }) {
  const sun = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.DirectionalLight>(null);
  const rays = useRef<THREE.Group>(null);
  const rayMats = useRef<THREE.MeshBasicMaterial[]>([]);

  const rayDefs = useMemo(() => {
    return [-1.6, -0.5, 0.6, 1.7].map((dx, i) => {
      const end = ROOF_CENTER.clone().add(new THREE.Vector3(dx, 0, (i % 2 ? 0.6 : -0.6)));
      const mid = SUN_POS.clone().add(end).multiplyScalar(0.5);
      const len = SUN_POS.distanceTo(end);
      const q = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        end.clone().sub(SUN_POS).normalize(),
      );
      return { mid, len, q };
    });
  }, []);

  useFrame(() => {
    const p = state.current;
    const s = range(p, 0.28, 0.45);
    if (sun.current) {
      sun.current.position.y = SUN_POS.y - (1 - s) * 4;
      (sun.current.material as THREE.MeshBasicMaterial).opacity = 0.35 + s * 0.65;
    }
    if (light.current) light.current.intensity = 1.6 + s * 1.6;
    const r = range(p, 0.34, 0.48) * (1 - range(p, 0.82, 0.95));
    rayMats.current.forEach((m) => m && (m.opacity = r * 0.28));
  });

  return (
    <>
      <directionalLight
        ref={light}
        position={SUN_POS.toArray()}
        castShadow
        color="#fff1d0"
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      <mesh ref={sun} position={SUN_POS.toArray()}>
        <sphereGeometry args={[1.1, 32, 32]} />
        <meshBasicMaterial color={C.sun} transparent toneMapped={false} />
      </mesh>
      <group ref={rays}>
        {rayDefs.map((r, i) => (
          <mesh key={i} position={r.mid} quaternion={r.q}>
            <cylinderGeometry args={[0.04, 0.35, r.len, 12, 1, true]} />
            <meshBasicMaterial
              ref={(m) => { if (m) rayMats.current[i] = m; }}
              color={C.sun}
              transparent
              opacity={0}
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

/** Energy path roof -> wall -> home + particles; fully scroll-deterministic */
function Energy({ state, particleCount }: { state: ScrollState; particleCount: number }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(3.6, ROOF_Y + 0.2, 1.8),
        new THREE.Vector3(4.0, ROOF_Y - 0.3, 2.3),
        new THREE.Vector3(4.0, 2.7, 2.4),
        new THREE.Vector3(3.3, 1.2, 2.4),
        new THREE.Vector3(1.0, 0.6, 2.5),
        new THREE.Vector3(-1.0, 1.2, 2.3),
      ]),
    [],
  );
  const tube = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.06, 8, false), [curve]);
  const tubeRef = useRef<THREE.Mesh>(null);
  const sunPts = useRef<THREE.Points>(null);
  const flowPts = useRef<THREE.Points>(null);

  const sunGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    return g;
  }, [particleCount]);
  const flowGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(particleCount * 3), 3));
    return g;
  }, [particleCount]);
  const seeds = useMemo(
    () => Array.from({ length: particleCount }, (_, i) => ({ o: (i * 0.618) % 1, x: Math.sin(i * 12.9) * 1.8, z: Math.cos(i * 7.3) * 1.2 })),
    [particleCount],
  );
  const tmp = new THREE.Vector3();

  useFrame(() => {
    const p = state.current;
    // sunlight particles
    const sv = range(p, 0.36, 0.5) * (1 - range(p, 0.7, 0.85));
    const sArr = sunGeo.attributes["position"]!.array as Float32Array;
    seeds.forEach((s, i) => {
      const t = (s.o + p * 6) % 1;
      const end = tmp.set(ROOF_CENTER.x + s.x, ROOF_CENTER.y, ROOF_CENTER.z + s.z);
      sArr[i * 3] = THREE.MathUtils.lerp(SUN_POS.x, end.x, t);
      sArr[i * 3 + 1] = THREE.MathUtils.lerp(SUN_POS.y, end.y, t);
      sArr[i * 3 + 2] = THREE.MathUtils.lerp(SUN_POS.z, end.z, t);
    });
    sunGeo.attributes["position"]!.needsUpdate = true;
    if (sunPts.current) (sunPts.current.material as THREE.PointsMaterial).opacity = sv;

    // energy line draws in
    const draw = range(p, 0.55, 0.72);
    tube.setDrawRange(0, Math.floor((tube.index?.count ?? 0) * draw));
    if (tubeRef.current) (tubeRef.current.material as THREE.MeshBasicMaterial).opacity = draw > 0 ? 0.9 : 0;

    const fv = range(p, 0.62, 0.72);
    const fArr = flowGeo.attributes["position"]!.array as Float32Array;
    seeds.forEach((s, i) => {
      const t = (s.o + p * 8) % 1;
      curve.getPointAt(t * draw, tmp);
      fArr[i * 3] = tmp.x;
      fArr[i * 3 + 1] = tmp.y;
      fArr[i * 3 + 2] = tmp.z + 0.02;
    });
    flowGeo.attributes["position"]!.needsUpdate = true;
    if (flowPts.current) (flowPts.current.material as THREE.PointsMaterial).opacity = fv;
  });

  return (
    <>
      <mesh ref={tubeRef} geometry={tube}>
        <meshBasicMaterial color={C.volt} transparent opacity={0} toneMapped={false} />
      </mesh>
      <points ref={sunPts} geometry={sunGeo}>
        <pointsMaterial color={C.sun} size={0.14} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
      <points ref={flowPts} geometry={flowGeo}>
        <pointsMaterial color={C.volt} size={0.18} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} toneMapped={false} />
      </points>
    </>
  );
}

function Rig({ state }: { state: ScrollState }) {
  const { camera } = useThree();
  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    // Smooth interpolation toward scroll target; converges then freezes
    const diff = state.target - state.current;
    state.current = Math.abs(diff) < 0.0002 ? state.target : state.current + diff * (1 - Math.exp(-8 * dt));
    const { pos, look } = camAt(state.current);
    camera.position.copy(pos);
    camera.lookAt(look);
  });
  return null;
}

export default function SolarScene({ state, mobile }: { state: ScrollState; mobile: boolean }) {
  return (
    <Canvas shadows={!mobile} dpr={[1, mobile ? 1.5 : 2]} camera={{ position: [15, 5, 19], fov: mobile ? 52 : 38 }} gl={{ antialias: !mobile }}>
      <color attach="background" args={["#f4f4ec"]} />
      <fog attach="fog" args={["#f4f4ec", 28, 60]} />
      <hemisphereLight args={["#fffaf0", "#cfc8b0", 0.7]} />
      <Environment resolution={64}>
        <Lightformer intensity={1.5} position={[0, 6, 0]} scale={[12, 12, 1]} rotation-x={Math.PI / 2} />
        <Lightformer intensity={0.8} color="#ffe2a0" position={[-6, 2, -2]} rotation-y={Math.PI / 2} scale={[20, 2, 1]} />
      </Environment>
      <Rig state={state} />
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshStandardMaterial color={C.ground} roughness={1} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[9, 48]} />
        <meshStandardMaterial color={C.lawn} roughness={1} />
      </mesh>
      <House />
      <Panels state={state} />
      <Sun state={state} />
      <Energy state={state} particleCount={mobile ? 40 : 110} />
    </Canvas>
  );
}
