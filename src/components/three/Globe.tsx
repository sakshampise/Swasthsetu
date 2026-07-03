"use client";
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { CENTRES, MEDS0 } from "@/lib/data";
import { riskScore, buildTransfers } from "@/lib/ai";
import { Flow, Glow, fib, llToV3 } from "./helpers";
import { view3d } from "./state";

const GEO: Record<string, [number, number]> = {
  wakad: [16, -38], aundh: [24, -18], hadapsar: [-6, 34], kothrud: [4, -8], hinjewadi: [30, -48],
  baner: [26, -30], pimpri: [34, -12], chinchwad: [38, -26], shivajinagar: [8, 8], swargate: [-2, 16],
};

/* Interactive district health globe — markers coloured by the live risk model,
   arcs driven by the same transfer engine the Redistribution page uses. */
export default function Globe({ dark, position = [0, 0, 0] }: any) {
  const g = useRef<THREE.Group>(null!);
  const R = 6;
  const n = view3d.mobile ? 550 : 1100;
  const pts = useMemo(() => fib(n, R), [n]);
  const markers = useMemo(() => CENTRES.map((c) => {
    const s = riskScore(c, MEDS0);
    return { id: c.id, v: llToV3(GEO[c.id][0], GEO[c.id][1], R * 1.01), col: s >= 70 ? "#f43f5e" : s >= 45 ? "#f59e0b" : "#10b981", rgb: s >= 70 ? "244,63,94" : s >= 45 ? "245,158,11" : "16,185,129" };
  }), []);
  const arcs = useMemo(() => {
    const at: Record<string, THREE.Vector3> = {}; markers.forEach((m) => (at[m.id] = m.v));
    return buildTransfers(MEDS0).slice(0, 6).map((tr: any, i: number) => {
      const a = at[tr.from], b = at[tr.to];
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.42);
      return { curve: new THREE.QuadraticBezierCurve3(a, mid, b), off: i * 0.17, sp: 0.1 + (i % 3) * 0.03 };
    });
  }, [markers]);

  useFrame(({ clock }) => {
    if (!g.current) return;
    g.current.rotation.y = clock.elapsedTime * 0.05 + view3d.px * 0.22;
    g.current.rotation.x = -0.13 - view3d.py * 0.05;
  });

  const line = dark ? "#2dd4bf" : "#0d9488";
  return (
    <group position={position}>
      <group ref={g}>
        <points>
          <bufferGeometry><bufferAttribute attach="attributes-position" args={[pts, 3]} /></bufferGeometry>
          <pointsMaterial size={0.07} color={dark ? "#5eead4" : "#0f766e"} transparent opacity={view3d.mobile ? 0.4 : 0.55} sizeAttenuation />
        </points>
        <mesh><sphereGeometry args={[R, 28, 28]} /><meshBasicMaterial color={line} wireframe transparent opacity={0.05} /></mesh>
        <mesh rotation-x={Math.PI / 2.15}><torusGeometry args={[R * 1.05, 0.013, 8, 140]} /><meshBasicMaterial color={line} transparent opacity={0.3} /></mesh>
        {markers.map((m) => (
          <group key={m.id} position={m.v}>
            <mesh><sphereGeometry args={[0.16, 12, 12]} /><meshBasicMaterial color={m.col} toneMapped={false} /></mesh>
            <Glow rgb={m.rgb} scale={1.1} opacity={0.9} />
          </group>
        ))}
        {arcs.map((a, i) => <Flow key={i} curve={a.curve} color={line} speed={a.sp} offset={a.off} />)}
      </group>
      <Glow rgb={dark ? "45,212,191" : "13,148,136"} scale={R * 3.3} opacity={dark ? 0.4 : 0.22} />

      {/* Floating pharmacy: capsule · vaccine vial · medical cross */}
      <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.4}>
        <group position={[-8.6, 3.1, 2]} rotation-z={0.85}>
          <mesh><cylinderGeometry args={[0.5, 0.5, 1.4, 24, 1, true]} /><meshStandardMaterial color="#f8fafc" roughness={0.3} /></mesh>
          <mesh position-y={0.7}><sphereGeometry args={[0.5, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#14b8a6" emissive="#0d9488" emissiveIntensity={0.4} roughness={0.25} /></mesh>
          <mesh position-y={-0.7} rotation-x={Math.PI}><sphereGeometry args={[0.5, 24, 14, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#f8fafc" roughness={0.3} /></mesh>
        </group>
      </Float>
      <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.2}>
        <group position={[7.6, -3.6, 3.4]} rotation-z={-0.5}>
          <mesh><cylinderGeometry args={[0.46, 0.46, 1.5, 22]} /><meshPhongMaterial color="#8ef0dd" transparent opacity={0.28} shininess={100} depthWrite={false} /></mesh>
          <mesh position-y={-0.28}><cylinderGeometry args={[0.36, 0.36, 0.8, 22]} /><meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} roughness={0.4} /></mesh>
          <mesh position-y={0.88}><cylinderGeometry args={[0.52, 0.52, 0.28, 22]} /><meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.5} /></mesh>
        </group>
      </Float>
      <Float speed={1.3} rotationIntensity={0.6} floatIntensity={1.3}>
        <group position={[8.4, 4.2, 1]}>
          <mesh><boxGeometry args={[1.5, 0.5, 0.5]} /><meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.55} roughness={0.3} /></mesh>
          <mesh><boxGeometry args={[0.5, 1.5, 0.5]} /><meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.55} roughness={0.3} /></mesh>
          <Glow rgb="20,184,166" scale={3.8} opacity={0.65} />
        </group>
      </Float>
    </group>
  );
}
