"use client";
import * as THREE from "three";
import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, RoundedBox, Edges, Html, MeshDistortMaterial } from "@react-three/drei";
import { Glow } from "./helpers";
import { view3d } from "./state";

/* A health dashboard floating in 3D space + the AI hologram assistant. */
export default function HoloDashboard({ dark, position = [0, 0, 0] }: any) {
  const ring = useRef<THREE.Mesh>(null!);
  const ring2 = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (ring.current) { ring.current.rotation.x = t * 0.6; ring.current.rotation.y = t * 0.35; }
    if (ring2.current) { ring2.current.rotation.x = -t * 0.4; ring2.current.rotation.z = t * 0.5; }
  });
  const line = dark ? "#2dd4bf" : "#0d9488";
  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0.14} floatIntensity={0.6}>
        <group rotation={[-0.04, 0.16, 0]}>
          <RoundedBox args={[8.6, 4.9, 0.14]} radius={0.16} smoothness={3}>
            <meshPhysicalMaterial color={dark ? "#0f2c2a" : "#ffffff"} transparent opacity={dark ? 0.2 : 0.32} roughness={0.18} metalness={0.08} />
          </RoundedBox>
          <Edges scale={1.001} color={line} />
          <Html transform position={[0, 0, 0.09]} distanceFactor={5.4} style={{ pointerEvents: "none", width: "620px" }}>
            <div style={{ fontFamily: "Inter, system-ui, sans-serif" }} className={`rounded-2xl p-5 ${dark ? "text-slate-100" : "text-slate-800"}`}>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-extrabold tracking-tight">District Command · <span style={{ color: "#14b8a6" }}>Live</span></p>
                <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ background: "rgba(20,184,166,.15)", color: "#14b8a6" }}>AI · Vertex</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[["Stock-out risk", "3 centres", "#f43f5e"], ["Bed occupancy", "78%", "#f59e0b"], ["Forecast Δ", "+18% OPD", "#14b8a6"]].map(([l, v, c]) => (
                  <div key={l as string} className="rounded-xl p-3" style={{ background: dark ? "rgba(255,255,255,.05)" : "rgba(13,148,136,.07)", border: `1px solid ${c}33` }}>
                    <p className="text-[10px] font-semibold uppercase tracking-wider opacity-70">{l}</p>
                    <p className="mt-1 text-lg font-extrabold" style={{ color: c as string }}>{v}</p>
                    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "rgba(148,163,184,.25)" }}>
                      <div className="h-full rounded-full" style={{ width: "62%", background: c as string }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Html>
        </group>
      </Float>

      {/* AI hologram assistant */}
      <Float speed={1.6} rotationIntensity={0.3} floatIntensity={1.1}>
        <group position={[6.7, 0.4, 1.6]}>
          <mesh>
            <sphereGeometry args={[0.85, 48, 48]} />
            <MeshDistortMaterial color="#14b8a6" emissive="#0d9488" emissiveIntensity={0.75} roughness={0.2} distort={0.32} speed={2.2} />
          </mesh>
          <mesh ref={ring}><torusGeometry args={[1.25, 0.022, 8, 80]} /><meshBasicMaterial color={line} transparent opacity={0.75} toneMapped={false} /></mesh>
          <mesh ref={ring2}><torusGeometry args={[1.55, 0.014, 8, 80]} /><meshBasicMaterial color="#38bdf8" transparent opacity={0.45} toneMapped={false} /></mesh>
          <Glow rgb="20,184,166" scale={5} opacity={0.75} />
        </group>
      </Float>
    </group>
  );
}
