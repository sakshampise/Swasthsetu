"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial } from "@react-three/drei";

function Orb() {
  const ring = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { if (ring.current) { ring.current.rotation.x = clock.elapsedTime * 0.9; ring.current.rotation.y = clock.elapsedTime * 0.6; } });
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} />
      <mesh>
        <sphereGeometry args={[0.95, 40, 40]} />
        <MeshDistortMaterial color="#14b8a6" emissive="#0d9488" emissiveIntensity={0.8} roughness={0.2} distort={0.35} speed={2.4} />
      </mesh>
      <mesh ref={ring}><torusGeometry args={[1.35, 0.05, 8, 60]} /><meshBasicMaterial color="#5eead4" toneMapped={false} /></mesh>
    </>
  );
}

export default function OrbScene() {
  return (
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 3.6], fov: 45 }} gl={{ alpha: true, antialias: true }}>
      <Orb />
    </Canvas>
  );
}
