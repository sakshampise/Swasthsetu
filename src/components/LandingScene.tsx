"use client";
import dynamic from "next/dynamic";
// WebGL is client-only; keep it out of the server bundle entirely.
const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false, loading: () => null });
export default HeroScene;
