"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, type MutableRefObject } from "react";
import * as THREE from "three";

/* ---------------------------------------------------------------------------
   Hero atmosphere — a single, lightweight canvas. Deep navy void, gold dust
   drifting upward, soft volumetric light from centre-bottom, film grain.

   Two scalar uniforms are driven imperatively from the React layer via a shared
   `progress` ref (no React state, zero rerenders):
     • reveal  0 → ~1.1 → 1   intro bloom (light emerges, overshoots, settles)
     • scroll  0 → 1          scroll-out (atmosphere stretches up + dims)
--------------------------------------------------------------------------- */

const Y_RANGE = 6;

export type HeroProgress = { reveal: number; scroll: number; bloom: number };

function Background({
  vw,
  vh,
  progress,
}: {
  vw: number;
  vh: number;
  progress: MutableRefObject<HeroProgress>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uScroll: { value: 0 },
      uBloom: { value: 0 },
    }),
    []
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value += dt;
    u.uReveal.value = progress.current.reveal;
    u.uScroll.value = progress.current.scroll;
    u.uBloom.value = progress.current.bloom;
  });

  return (
    <mesh position={[0, 0, -4]} scale={[vw * 1.5, vh * 1.5, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={mat}
        uniforms={uniforms}
        depthWrite={false}
        vertexShader={/* glsl */ `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `}
        fragmentShader={/* glsl */ `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uReveal;
          uniform float uScroll;
          uniform float uBloom;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(41.0,289.0)))*43758.5453); }
          float noise(vec2 p){
            vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y);
          }
          void main(){
            // atmosphere drifts/stretches upward as the hero scrolls away
            vec2 uv = vUv;
            uv.y -= uScroll * 0.16;
            float d = distance(uv, vec2(0.5));
            vec3 col = mix(vec3(0.035,0.045,0.065), vec3(0.008,0.010,0.020), d);

            // two slow fog planes drifting at different rates → dimensional depth
            float f1 = noise(uv * 2.5 + vec2(uTime * 0.012, uTime * 0.020));
            float f2 = noise(uv * 1.3 - vec2(uTime * 0.008, uTime * 0.014));
            col += vec3(0.018,0.022,0.034) * (f1 * 0.6 + f2 * 0.4) * 0.9;

            // bottom gold ambient (driven by the intro reveal)
            float b = smoothstep(0.85, 0.0, distance(uv, vec2(0.5, 0.0)));
            col += vec3(0.11,0.08,0.035) * b * (0.28 + 0.55 * clamp(uReveal, 0.0, 1.2));

            // SIGNATURE MOMENT — a soft gold bloom erupts behind the type, brief
            float bl = smoothstep(0.62, 0.0, distance(uv, vec2(0.5, 0.52)));
            col += vec3(0.40,0.30,0.14) * pow(bl, 1.4) * uBloom;

            // cinematic top edge glow / falloff
            col += vec3(0.04,0.05,0.07) * smoothstep(0.62, 1.0, uv.y) * 0.5;

            col *= (1.0 - uScroll * 0.55);
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
  progress,
}: {
  vw: number;
  vh: number;
  mouse: MutableRefObject<THREE.Vector2>;
  progress: MutableRefObject<HeroProgress>;
}) {
  const mat = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uColor: { value: new THREE.Color("#d8b25e") },
      uReveal: { value: 0 },
      uScroll: { value: 0 },
      uBloom: { value: 0 },
    }),
    []
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mat.current.uniforms.uMouse.value.copy(mouse.current);
    mat.current.uniforms.uReveal.value = progress.current.reveal;
    mat.current.uniforms.uScroll.value = progress.current.scroll;
    mat.current.uniforms.uBloom.value = progress.current.bloom;
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
          uniform float uReveal; uniform float uScroll; uniform float uBloom;
          float hash(vec2 p){ return fract(sin(dot(p, vec2(41.0,289.0)))*43758.5453); }
          float noise(vec2 p){
            vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
            return mix(mix(hash(i),hash(i+vec2(1,0)),u.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x), u.y);
          }
          void main(){
            // origin drifts slowly (directional light movement) + rises on scroll
            vec2 origin = vec2(0.5 + uMouse.x*0.04 + sin(uTime*0.05)*0.06, -0.06 + uScroll*0.5);
            vec2 p = vUv - origin;
            float dist = length(p * vec2(1.0, 0.78));
            float glow = smoothstep(0.95, 0.0, dist);
            float ang = atan(p.x, p.y);
            // shaft angle drifts very slowly over time → evolving lighting
            float beams = 0.55 + 0.45*sin(ang*15.0 + uTime*0.05 + noise(vec2(ang*3.0, uTime*0.12))*4.5);
            float rays = glow * mix(0.45, 1.0, beams);
            rays *= smoothstep(1.1, 0.05, vUv.y);
            float flicker = 0.9 + 0.1*sin(uTime*0.6);
            // intro bloom (overshoot) + brief climax lift + scroll-out fade
            rays *= clamp(uReveal, 0.0, 1.2);
            rays *= (1.0 + uBloom * 0.5);
            rays *= (1.0 - uScroll * 0.85);
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
  progress,
}: {
  count: number;
  mouse: MutableRefObject<THREE.Vector2>;
  progress: MutableRefObject<HeroProgress>;
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
      uPixelRatio: {
        value: typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 1.5) : 1,
      },
      uColor: { value: new THREE.Color("#e7c987") },
      uYRange: { value: Y_RANGE },
      uReveal: { value: 0 },
      uScroll: { value: 0 },
    }),
    []
  );

  useFrame((_, dt) => {
    if (!mat.current) return;
    mat.current.uniforms.uTime.value += dt;
    mat.current.uniforms.uMouse.value.copy(mouse.current);
    mat.current.uniforms.uReveal.value = progress.current.reveal;
    mat.current.uniforms.uScroll.value = progress.current.scroll;
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
          uniform float uPixelRatio; uniform float uYRange; uniform float uScroll;
          attribute vec3 aRandom;
          varying float vTw;
          void main(){
            vec3 pos = position;
            float speed = mix(0.04, 0.22, aRandom.x);
            float H = uYRange;
            float y = pos.y + uTime * speed + uScroll * 3.2; // lift away on scroll-out
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
          uniform float uTime; uniform vec3 uColor; uniform float uReveal; uniform float uScroll;
          varying float vTw;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d);
            float tw = 0.65 + 0.35 * sin(uTime * 2.0 + vTw * 10.0);
            a *= clamp(uReveal, 0.0, 1.0) * (1.0 - uScroll);
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
            // grain breathes slightly over time — subconscious film texture
            float amt = 0.038 + 0.012 * sin(uTime * 1.7);
            gl_FragColor = vec4(vec3(n), n * amt);
          }
        `}
      />
    </mesh>
  );
}

function Scene({
  count,
  progress,
}: {
  count: number;
  progress: MutableRefObject<HeroProgress>;
}) {
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    // ease pointer (-1..1) for subtle, restrained parallax
    mouse.current.lerp(state.pointer, 0.04);

    // slow ambient "camera drift" — planes at different depths shift by
    // different amounts → real dimensional parallax, like a locked-off shot
    // breathing on a dolly. Amplitude is tiny on purpose.
    const t = state.clock.elapsedTime;
    const cam = state.camera;
    cam.position.x += (Math.sin(t * 0.05) * 0.08 - cam.position.x) * 0.02;
    cam.position.y += (Math.cos(t * 0.04) * 0.05 - cam.position.y) * 0.02;
    cam.lookAt(0, 0, 0);
  });

  return (
    <>
      <Background vw={viewport.width} vh={viewport.height} progress={progress} />
      <GodRays vw={viewport.width} vh={viewport.height} mouse={mouse} progress={progress} />
      <Dust count={count} mouse={mouse} progress={progress} />
      <FilmGrain vw={viewport.width} vh={viewport.height} />
    </>
  );
}

export default function HeroCanvas({
  count = 1400,
  dpr = [1, 1.5],
  progress,
}: {
  count?: number;
  dpr?: [number, number];
  progress?: MutableRefObject<HeroProgress>;
}) {
  const fallback = useRef<HeroProgress>({ reveal: 1, scroll: 0, bloom: 0 });
  const prog = progress ?? fallback;

  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      dpr={dpr}
      camera={{ position: [0, 0, 6], fov: 45 }}
      frameloop="always"
    >
      <color attach="background" args={["#04060a"]} />
      <Scene count={count} progress={prog} />
    </Canvas>
  );
}
