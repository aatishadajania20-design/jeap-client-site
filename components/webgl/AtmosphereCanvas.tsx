"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import FieldShader from "./FieldShader";

/**
 * Thin Canvas wrapper. Imported via next/dynamic so the WebGL bundle (three +
 * fiber) is lazy-loaded and never blocks first paint of the hero typography.
 */
export default function AtmosphereCanvas({ intensity = 1 }: { intensity?: number }) {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.6]}
      camera={{ position: [0, 0, 1], fov: 50 }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <FieldShader intensity={intensity} />
      </Suspense>
    </Canvas>
  );
}
