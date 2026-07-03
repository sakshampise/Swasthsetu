"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";

function Cross() {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => { if (g.current) { g.current.rotation.y = clock.elapsedTime * 2.1; g.current.rotation.x = 0.25; } });
  return (
    <>
      <ambientLight intensity={1} />
      <directionalLight position={[3, 4, 5]} intensity={1.3} />
      <group ref={g}>
        <RoundedBox args={[2.2, 0.72, 0.72]} radius={0.14}><meshStandardMaterial color="#14b8a6" emissive="#0d9488" emissiveIntensity={0.7} roughness={0.25} /></RoundedBox>
        <RoundedBox args={[0.72, 2.2, 0.72]} radius={0.14}><meshStandardMaterial color="#10b981" emissive="#0d9488" emissiveIntensity={0.7} roughness={0.25} /></RoundedBox>
      </group>
    </>
  );
}

export default function CrossLoader({ size = 96 }: { size?: number }) {
  return (
    <div style={{ width: size, height: size, filter: "drop-shadow(0 0 22px rgba(20,184,166,.55))" }}>
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 4.4], fov: 42 }} gl={{ alpha: true, antialias: true }}>
        <Cross />
      </Canvas>
    </div>
  );
}
