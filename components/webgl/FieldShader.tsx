"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

/**
 * A full-viewport plane running fractal-noise flow. Reads as drifting volumetric
 * light — deep navy black with gold filaments that swell toward the pointer.
 * No textures, all procedural, so it stays cheap on the GPU.
 */
const FieldMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0.5, 0.5),
    uAspect: 1,
    uIntensity: 1,
    uGold: new THREE.Color("#c9a25a"),
    uNavy: new THREE.Color("#0c1422"),
  },
  // vertex
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // fragment
  /* glsl */ `
    precision highp float;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uAspect;
    uniform float uIntensity;
    uniform vec3 uGold;
    uniform vec3 uNavy;

    // hash + value noise
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
    float noise(vec2 p){
      vec2 i = floor(p); vec2 f = fract(p);
      vec2 u = f*f*(3.0-2.0*f);
      return mix(mix(hash(i+vec2(0.0,0.0)), hash(i+vec2(1.0,0.0)), u.x),
                 mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), u.x), u.y);
    }
    float fbm(vec2 p){
      float v = 0.0; float a = 0.5;
      mat2 m = mat2(1.6,1.2,-1.2,1.6);
      for(int i=0;i<5;i++){ v += a*noise(p); p = m*p; a *= 0.5; }
      return v;
    }

    void main(){
      vec2 uv = vUv;
      vec2 p = uv;
      p.x *= uAspect;

      float t = uTime * 0.05;
      // domain warp for that slow volumetric drift
      vec2 q = vec2(fbm(p + t), fbm(p + vec2(5.2,1.3) - t));
      float f = fbm(p + 1.8*q + t*0.5);

      // pointer light pool
      vec2 m = uMouse; m.x *= uAspect;
      float d = distance(p, m);
      float glow = smoothstep(0.85, 0.0, d);

      float light = pow(f, 1.8) + glow * 0.55 * uIntensity;

      vec3 col = mix(uNavy * 0.35, uGold, smoothstep(0.45, 0.95, light));
      col = mix(vec3(0.027), col, smoothstep(0.1, 0.8, light + 0.15));

      // vignette toward cinematic black edges
      float vig = smoothstep(1.25, 0.25, distance(uv, vec2(0.5)));
      col *= mix(0.35, 1.0, vig);

      gl_FragColor = vec4(col, 1.0);
    }
  `
);

extend({ FieldMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    fieldMaterial: {
      ref?: React.Ref<THREE.ShaderMaterial & { uTime: number }>;
      uIntensity?: number;
    };
  }
}

export default function FieldShader({ intensity = 1 }: { intensity?: number }) {
  const mat = useRef<THREE.ShaderMaterial & {
    uTime: number;
    uMouse: THREE.Vector2;
    uAspect: number;
  }>(null);
  const { viewport, size } = useThree();
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  useFrame((state, delta) => {
    if (!mat.current) return;
    mat.current.uTime += delta;
    mat.current.uAspect = size.width / size.height;
    // pointer in 0..1, eased
    const px = state.pointer.x * 0.5 + 0.5;
    const py = state.pointer.y * 0.5 + 0.5;
    target.current.set(px, py);
    mat.current.uMouse.lerp(target.current, 0.06);
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <fieldMaterial ref={mat} uIntensity={intensity} />
    </mesh>
  );
}
