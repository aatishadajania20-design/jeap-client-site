"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
   A dark luxury "awards venue before the show" — deep navy void, gold dust
   drifting upward and leaning toward the pointer, soft volumetric light from
   centre-bottom, and a film-grain shader overlay. All procedural; the dust is a
   single THREE.Points draw call (cheaper than instancing) for steady 60fps.
--------------------------------------------------------------------------- */

const Y_RANGE = 6;

function Background({ vw, vh }: { vw: number; vh: number }) {
  return (
    <mesh position={[0, 0, -4]} scale={[vw * 1.5, vh * 1.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        depthWrite={false}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;
          void main(){
            float d = distance(vUv, vec2(0.5));
            vec3 col = mix(vec3(0.035,0.045,0.065), vec3(0.008,0.010,0.020), d);
            float b = smoothstep(0.85, 0.0, distance(vUv, vec2(0.5, 0.0)));
            col += vec3(0.11,0.08,0.035) * b * 0.65;
            gl_FragColor = vec4(col, 1.0);
          }
        `}
      />
    </mesh>
  );
}

function GodRays({
  vw,
  vh,
  mouse,
}: {
  vw: number;
  vh: number;
  mouse: React.MutableRefObject<THREE.Vector2>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color("#d8b25e") },
    }),
    []
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mat.current.uniforms.uMouse.value.copy(mouse.current);
  });

  return (
    <mesh position={[0, 0, -3]} scale={[vw * 1.8, vh * 1.8, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime; uniform vec2 uMouse; uniform vec3 uColor;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(41.0,289.0)))*43758.5453); }
          float noise(vec2 p){
            vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y);
          }
          void main(){
            vec2 origin = vec2(0.5 + uMouse.x*0.04, -0.06);
            vec2 p = vUv - origin;
            float dist = length(p * vec2(1.0, 0.78));
            float glow = smoothstep(0.95, 0.0, dist);
            float ang = atan(p.x, p.y);
            float beams = 0.55 + 0.45*sin(ang*15.0 + noise(vec2(ang*3.0, uTime*0.12))*4.5);
            float rays = glow * mix(0.45, 1.0, beams);
            rays *= smoothstep(1.1, 0.05, vUv.y);
            float flicker = 0.9 + 0.1*sin(uTime*0.6);
            gl_FragColor = vec4(uColor * rays * flicker, rays * 0.85);
          }
        `}
      />
    </mesh>
  );
}

function Dust({
  count,
  mouse,
}: {
  count: number;
  mouse: React.MutableRefObject<THREE.Vector2>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);

  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * Y_RANGE;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      randoms[i * 3 + 0] = Math.random(); // speed
      randoms[i * 3 + 1] = Math.random(); // phase
      randoms[i * 3 + 2] = Math.random(); // size
    }
    return { positions, randoms };
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uSize: { value: 55 },
      uPixelRatio: { value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1 },
      uColor: { value: new THREE.Color("#e7c987") },
      uYRange: { value: Y_RANGE },
    }),
    []
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mat.current.uniforms.uMouse.value.copy(mouse.current);
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[randoms, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          uniform float uTime; uniform vec2 uMouse; uniform float uSize;
          uniform float uPixelRatio; uniform float uYRange;
          attribute vec3 aRandom;
          varying float vTw;
          void main(){
            vec3 pos = position;
            float speed = mix(0.04, 0.22, aRandom.x);
            float H = uYRange;
            float y = pos.y + uTime * speed;
            y = mod(y + H, 2.0 * H) - H;
            pos.y = y;
            pos.x += sin(uTime * (0.15 + aRandom.y * 0.4) + aRandom.y * 6.28) * 0.18;
            float depth = clamp((pos.z + 2.0) / 4.0, 0.0, 1.0);
            pos.xy += uMouse * (0.12 + 0.45 * depth);
            vec4 mv = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * (0.35 + aRandom.z) * uPixelRatio * (1.0 / -mv.z);
            vTw = aRandom.y;
          }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          uniform float uTime; uniform vec3 uColor;
          varying float vTw;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d);
            float tw = 0.65 + 0.35 * sin(uTime * 2.0 + vTw * 10.0);
            gl_FragColor = vec4(uColor, a * tw);
          }
        `}
      />
    </points>
  );
}

function FilmGrain({ vw, vh }: { vw: number; vh: number }) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame((_, dt) => {
    if (mat.current) mat.current.uniforms.uTime.value += dt;
  });
  return (
    <mesh position={[0, 0, 1.5]} scale={[vw * 1.6, vh * 1.6, 1]} renderOrder={999}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={/* glsl */ `
          precision highp float;
          varying vec2 vUv;
          uniform float uTime;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(12.989, 78.233)))*43758.5453); }
          void main(){
            float n = hash(vUv * vec2(1920.0, 1080.0) + fract(uTime) * 100.0);
            gl_FragColor = vec4(vec3(n), n * 0.045);
          }
        `}
      />
    </mesh>
  );
}

function Scene({ count }: { count: number }) {
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    // ease pointer (-1..1) for subtle parallax
    mouse.current.lerp(state.pointer, 0.04);
  });

  return (
    <>
      <Background vw={viewport.width} vh={viewport.height} />
      <GodRays vw={viewport.width} vh={viewport.height} mouse={mouse} />
      <Dust count={count} mouse={mouse} />
      <FilmGrain vw={viewport.width} vh={viewport.height} />
    </>
  );
}

export default function HeroCanvas({ count = 1400 }: { count?: number }) {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 6], fov: 45 }}
      frameloop="always"
    >
      <color attach="background" args={["#04060a"]} />
      <Scene count={count} />
    </Canvas>
  );
}
