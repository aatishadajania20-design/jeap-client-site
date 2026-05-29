"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

/**
 * Liquid gold distortion that fills a card on hover. The plane ripples around
 * the pointer using a noise-warped radial flow. Rendered in its own canvas that
 * is only mounted while the card is hovered (see ServiceCard), so idle cards
 * cost nothing.
 */
function Plane({ tint }: { tint: string }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();
  const mouse = useRef(new THREE.Vector2(0.5, 0.5));
  const target = useRef(new THREE.Vector2(0.5, 0.5));

  useFrame((state, delta) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += delta;
    target.current.set(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5);
    mouse.current.lerp(target.current, 0.12);
    mat.current.uniforms.uMouse.value = mouse.current;
    mat.current.uniforms.uAspect.value = size.width / size.height;
  });

  return (
    <mesh scale={[2, 2, 1]}>
      <planeGeometry args={[1, 1, 1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uAspect: { value: 1 },
          uColor: { value: new THREE.Color(tint) },
        }}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime; uniform vec2 uMouse; uniform float uAspect; uniform vec3 uColor;
          float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
          float noise(vec2 p){vec2 i=floor(p),f=fract(p);vec2 u=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);}
          void main(){
            vec2 uv=vUv; uv.x*=uAspect;
            vec2 m=uMouse; m.x*=uAspect;
            float d=distance(uv,m);
            float ripple=sin(d*22.0 - uTime*3.0)*0.5+0.5;
            float warp=noise(uv*4.0 + uTime*0.3);
            float field=smoothstep(0.9,0.0,d) * (0.55 + 0.45*ripple) + warp*0.18;
            vec3 col = mix(vec3(0.02,0.02,0.03), uColor, field);
            gl_FragColor=vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

export default function DistortField({ tint = "#c9a25a" }: { tint?: string }) {
  return (
    <Canvas
      // pointer-events-none: the canvas never hit-tests, so it adds no input
      // overhead and never blocks the card's hover / the page scroll.
      className="!absolute inset-0 !pointer-events-none"
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.25]}
      frameloop="always"
    >
      <Plane tint={tint} />
    </Canvas>
  );
}
