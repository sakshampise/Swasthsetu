"use client";
import * as THREE from "three";
import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";

/* Soft radial glow sprite texture — our "bloom" for cheap additive halos. */
export const useGlowTexture = (rgb: string) =>
  useMemo(() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 2, 64, 64, 62);
    grad.addColorStop(0, `rgba(${rgb},0.95)`); grad.addColorStop(0.35, `rgba(${rgb},0.35)`); grad.addColorStop(1, `rgba(${rgb},0)`);
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
  }, [rgb]);

export const Glow = ({ rgb, scale = 1, opacity = 0.8, position }: any) => {
  const map = useGlowTexture(rgb);
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial map={map} transparent opacity={opacity} depthWrite={false} />
    </sprite>
  );
};

/* Animated route: glowing line + a light pulse travelling along the curve. */
export const Flow = ({ curve, color = "#2dd4bf", width = 1.4, speed = 0.12, offset = 0, opacity = 0.65 }:
  { curve: THREE.Curve<THREE.Vector3>; color?: string; width?: number; speed?: number; offset?: number; opacity?: number }) => {
  const pts = useMemo(() => curve.getPoints(48), [curve]);
  const dot = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (dot.current) dot.current.position.copy(curve.getPoint((clock.elapsedTime * speed + offset) % 1));
  });
  return (
    <group>
      <Line points={pts} color={color} lineWidth={width} transparent opacity={opacity} />
      <mesh ref={dot}>
        <sphereGeometry args={[0.1, 10, 10]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
    </group>
  );
};

export const fib = (n: number, R: number) => {
  const a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
    a[i * 3] = Math.cos(th) * r * R; a[i * 3 + 1] = y * R; a[i * 3 + 2] = Math.sin(th) * r * R;
  }
  return a;
};

export const llToV3 = (lat: number, lon: number, R: number) => {
  const p = (lat * Math.PI) / 180, q = (lon * Math.PI) / 180;
  return new THREE.Vector3(R * Math.cos(p) * Math.sin(q), R * Math.sin(p), R * Math.cos(p) * Math.cos(q));
};
