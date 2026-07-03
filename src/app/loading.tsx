"use client";
import dynamic from "next/dynamic";
const CrossLoader = dynamic(() => import("@/components/three/CrossLoader"), { ssr: false });

export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center">
      <CrossLoader size={88} />
    </div>
  );
}
