"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
   TrophyCanvas — a separate, minimal canvas whose ONLY job is the trophy.
   It composites as a transparent layer (gl.alpha) BETWEEN the hero atmosphere
   (z-0/1) and the foreground title (z-10), so the text always sits cleanly in
   front of the trophy. One plane, one texture, one shader.

   The art is treated as a tall, dim, ghosted monument — never a product shot.
   trophy.png has a REAL alpha channel (~85% transparent), so the silhouette is
   masked by ALPHA (not luminance — the transparent area carries stray RGB).
--------------------------------------------------------------------------- */

// Measured opaque bounds of the trophy within trophy.png (1024×1536):
//   silhouette spans vUv.y 0.247 (base) → 0.882 (star top), centre x ≈ 0.524.
const ASPECT = 1024 / 1536; // width / height
const BBOX_TOP_UV = 0.882;
const BBOX_BOT_UV = 0.247;
const BBOX_CX = 0.524;

function Trophy() {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport, gl } = useThree();

  const tex = useTexture("/images/trophy.png");
  useMemo(() => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = gl.capabilities.getMaxAnisotropy(); // crisp edges
    tex.needsUpdate = true;
  }, [tex, gl]);

  // Composition: anchor the trophy base just below the viewport bottom and let
  // the star reach UP toward the title, which crowns its upper third. The two
  // world-y anchors (star top / base) drive plane height + offset so the visible
  // silhouette lands exactly where we want regardless of aspect ratio.
  const { pos, scale } = useMemo(() => {
    const vh = viewport.height;
    const TOP = 0.30 * vh; // world-y of the star top (above centre, near the title)
    const BASE = -0.55 * vh; // world-y of the base (just off the bottom edge)
    const VIS = BBOX_TOP_UV - BBOX_BOT_UV; // visible fraction of the plane height
    const h = (TOP - BASE) / VIS;
    const w = h * ASPECT;
    const yc = TOP - (BBOX_TOP_UV - 0.5) * h;
    const xc = -(BBOX_CX - 0.5) * w; // re-centre the slightly off-centre trophy
    return {
      pos: [xc, yc, 0] as [number, number, number],
      scale: [w, h, 1] as [number, number, number],
    };
  }, [viewport.height]);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uOpacity: { value: 0.26 }, // resting presence — faint, atmospheric
      uGold: { value: new THREE.Vector3(0.72, 0.57, 0.34) }, // dim bronze-gold (below the title's bright gold)
    }),
    [tex]
  );

  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });

  return (
    <mesh position={pos} scale={scale}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        depthTest={false}
        blending={THREE.NormalBlending}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform sampler2D uTex;
          uniform float uTime;
          uniform float uOpacity;
          uniform vec3 uGold;
          void main(){
            vec4 t = texture2D(uTex, vUv);
            // real alpha channel = the trophy silhouette (drops the black/void)
            float shape = smoothstep(0.06, 0.5, t.a);
            float lum = dot(t.rgb, vec3(0.299, 0.587, 0.114));

            // the trophy's own luminance only SHADES the form (depth, no glow)
            float shade = 0.45 + 0.65 * lum;

            // slow vertical specular sweep travelling up the form → subtle glisten
            float sweep = fract(uTime * 0.12);
            float band = smoothstep(0.13, 0.0, abs(vUv.y - sweep));
            shade += band * 0.6 * lum;

            // legibility scrim — dim the midsection (vUv.y ~0.66) where the title
            // sits, so the text always reads cleanly over the trophy
            float scrim = 1.0 - 0.55 * smoothstep(0.48, 0.62, vUv.y) * smoothstep(0.86, 0.70, vUv.y);

            // soft edge feather (alpha already kills the rectangular border; this
            // only softens any silhouette grazing the extreme plane bounds)
            float fx = smoothstep(0.0, 0.08, vUv.x) * smoothstep(1.0, 0.92, vUv.x);
            float fy = smoothstep(0.0, 0.05, vUv.y) * smoothstep(1.0, 0.95, vUv.y);
            float feather = fx * fy;

            float a = shape * feather * scrim * uOpacity;
            vec3 col = uGold * shade;
            // premultiplied output (renderer premultipliedAlpha) for clean NormalBlending
            gl_FragColor = vec4(col * a, a);
          }
        `}
      />
    </mesh>
  );
}

export default function TrophyCanvas({ dpr = [1, 1.5] }: { dpr?: [number, number] }) {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 45 }}
      frameloop="always"
    >
      <Suspense fallback={null}>
        <Trophy />
      </Suspense>
    </Canvas>
  );
}
