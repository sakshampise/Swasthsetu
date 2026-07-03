"use client";
import * as THREE from "three";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Globe from "./Globe";
import Hospitals from "./Hospitals";
import HoloDashboard from "./HoloDashboard";
import { view3d } from "./state";

/* Scroll-choreographed camera: hero globe → district cluster → holo dashboard. */
const POSES = (mobile: boolean) => [
  { at: 0.0, pos: new THREE.Vector3(0, 0.6, 15), look: new THREE.Vector3(mobile ? 0 : 3, 0, 0) },
  { at: 0.16, pos: new THREE.Vector3(0, 0.6, 15), look: new THREE.Vector3(mobile ? 0 : 3, 0, 0) },
  { at: 0.52, pos: new THREE.Vector3(0, 2.4, -27), look: new THREE.Vector3(0, -1.6, -42) },
  { at: 0.9, pos: new THREE.Vector3(0, 0.9, -73), look: new THREE.Vector3(0, 0.4, -85) },
  { at: 1.0, pos: new THREE.Vector3(0, 0.9, -73), look: new THREE.Vector3(0, 0.4, -85) },
];

function Rig({ mobile }: { mobile: boolean }) {
  const { camera } = useThree();
  const poses = useMemo(() => POSES(mobile), [mobile]);
  const cur = useRef({ pos: poses[0].pos.clone(), look: poses[0].look.clone() });
  useFrame(() => {
    const s = view3d.reduced ? 0 : view3d.scroll;
    let a = poses[0], b = poses[poses.length - 1];
    for (let i = 0; i < poses.length - 1; i++) if (s >= poses[i].at && s <= poses[i + 1].at) { a = poses[i]; b = poses[i + 1]; break; }
    const span = Math.max(b.at - a.at, 1e-5);
    const e = THREE.MathUtils.smoothstep((s - a.at) / span, 0, 1);
    const tp = a.pos.clone().lerp(b.pos, e);
    tp.x += view3d.px * 1.5; tp.y += -view3d.py * 0.9;
    const tl = a.look.clone().lerp(b.look, e);
    cur.current.pos.lerp(tp, 0.06); cur.current.look.lerp(tl, 0.06);
    camera.position.copy(cur.current.pos);
    camera.lookAt(cur.current.look);
  });
  return null;
}

function SceneBody({ dark, mobile }: any) {
  return (
    <>
      <fogExp2 attach="fog" args={[dark ? "#081018" : "#eef6f4", 0.013]} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[6, 10, 8]} intensity={0.9} />
      <pointLight position={[-14, -6, 4]} intensity={0.5} color="#f43f5e" />
      <pointLight position={[10, 8, -30]} intensity={0.7} color="#38bdf8" />
      <pointLight position={[0, 4, -80]} intensity={0.9} color="#14b8a6" />

      <Globe dark={dark} position={[mobile ? 0 : 4.6, 0.2, 0]} />
      <Hospitals dark={dark} position={[0, 0, -42]} />
      <HoloDashboard dark={dark} position={[0, 0.4, -85]} />

      <Sparkles count={mobile ? 55 : 130} scale={[70, 32, 110]} position={[0, 0, -40]} size={2.2} speed={0.35} opacity={dark ? 0.5 : 0.32} color={dark ? "#99f6e4" : "#0f766e"} />
      {!mobile && !view3d.reduced && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.65} luminanceThreshold={0.28} luminanceSmoothing={0.2} />
          <Vignette eskil={false} offset={0.18} darkness={dark ? 0.62 : 0.32} />
        </EffectComposer>
      )}
    </>
  );
}

export default function HeroScene({ dark }: { dark: boolean }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    view3d.mobile = window.innerWidth < 768;
    view3d.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onMove = (e: PointerEvent) => { view3d.px = (e.clientX / window.innerWidth - 0.5) * 2; view3d.py = (e.clientY / window.innerHeight - 0.5) * 2; };
    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      view3d.scroll = Math.min(1, Math.max(0, window.scrollY / max));
    };
    onScroll();
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    setReady(true);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("scroll", onScroll); };
  }, []);
  if (!ready) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <Canvas
        dpr={[1, view3d.mobile ? 1.5 : 1.8]}
        camera={{ fov: 42, near: 0.1, far: 220, position: [0, 0.6, 15] }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        frameloop={view3d.reduced ? "demand" : "always"}
      >
        <Rig mobile={view3d.mobile} />
        <SceneBody dark={dark} mobile={view3d.mobile} />
      </Canvas>
    </div>
  );
}
