"use client";
import * as THREE from "three";
import React, { useMemo } from "react";
import { Float, Edges, ContactShadows } from "@react-three/drei";
import { Flow, Glow } from "./helpers";
import { view3d } from "./state";

const Building = ({ x, z, w = 2.2, h = 3, d = 2.2, status = "#10b981", rgb = "16,185,129", dark }: any) => (
  <group position={[x, h / 2 - 4, z]}>
    <mesh>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial color={dark ? "#16232e" : "#dbe7ec"} roughness={0.55} metalness={0.1} />
    </mesh>
    {/* Emissive window strips */}
    {[...Array(Math.max(2, Math.floor(h / 1.1)))].map((_, i) => (
      <mesh key={i} position={[0, -h / 2 + 0.75 + i * 1.05, d / 2 + 0.01]}>
        <boxGeometry args={[w * 0.72, 0.16, 0.02]} />
        <meshStandardMaterial color="#99f6e4" emissive="#2dd4bf" emissiveIntensity={1.1} toneMapped={false} />
      </mesh>
    ))}
    {/* Glowing status indicator */}
    <group position={[0, h / 2 + 0.45, 0]}>
      <mesh><sphereGeometry args={[0.16, 12, 12]} /><meshBasicMaterial color={status} toneMapped={false} /></mesh>
      <Glow rgb={rgb} scale={1.2} opacity={0.9} />
    </group>
  </group>
);

/* District cluster: PHC/CHC buildings, a floating holographic hospital,
   and animated supply routes between them. */
export default function Hospitals({ dark, position = [0, 0, 0] }: any) {
  const spots: [number, number, number, string, string][] = [
    [-7.5, 1.5, 2.6, "#10b981", "16,185,129"],
    [-3.2, -1.2, 3.4, "#f59e0b", "245,158,11"],
    [3.4, -0.6, 3.0, "#10b981", "16,185,129"],
    [7.6, 1.8, 2.4, "#f43f5e", "244,63,94"],
  ];
  const routes = useMemo(() => {
    const at = (i: number) => new THREE.Vector3(spots[i][0], -1.4, spots[i][1]);
    const centre = new THREE.Vector3(0, -0.6, 0);
    return [0, 1, 2, 3].map((i) => {
      const a = at(i), b = centre.clone();
      const mid = a.clone().add(b).multiplyScalar(0.5); mid.y += 2.6;
      return new THREE.QuadraticBezierCurve3(a, mid, b);
    });
  }, []);
  const line = dark ? "#2dd4bf" : "#0d9488";

  return (
    <group position={position}>
      {/* Ground grid */}
      <gridHelper args={[30, 26, dark ? "#134e4a" : "#99c9c2", dark ? "#0d2a2a" : "#cfe4e0"]} position={[0, -4.01, 0]} />
      {spots.map(([x, z, h, s, rgb], i) => <Building key={i} x={x} z={z} h={h} status={s} rgb={rgb} dark={dark} />)}

      {/* Floating holographic hospital (HQ) */}
      <Float speed={1.1} rotationIntensity={0.12} floatIntensity={0.7}>
        <group position={[0, 0.4, 0]}>
          <mesh>
            <boxGeometry args={[3.2, 4.2, 3.2]} />
            <meshPhysicalMaterial color={line} transparent opacity={0.12} roughness={0.15} metalness={0.1} />
          </mesh>
          <mesh><boxGeometry args={[3.2, 4.2, 3.2]} /><meshBasicMaterial color={line} wireframe transparent opacity={0.35} /></mesh>
          <Edges scale={1.001} color={line} />
          {/* Rooftop medical cross */}
          <group position={[0, 2.7, 0]}>
            <mesh><boxGeometry args={[1.1, 0.34, 0.34]} /><meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.9} toneMapped={false} /></mesh>
            <mesh><boxGeometry args={[0.34, 1.1, 0.34]} /><meshStandardMaterial color="#14b8a6" emissive="#14b8a6" emissiveIntensity={0.9} toneMapped={false} /></mesh>
            <Glow rgb="20,184,166" scale={3} opacity={0.7} />
          </group>
        </group>
      </Float>

      {routes.map((c, i) => <Flow key={i} curve={c} color={line} speed={0.14 + i * 0.02} offset={i * 0.22} width={1.6} />)}
      {!view3d.mobile && <ContactShadows position={[0, -4, 0]} opacity={dark ? 0.55 : 0.3} scale={30} blur={2.6} far={9} resolution={512} />}
    </group>
  );
}
