"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { HeroProgress } from "@/components/sections/home/HeroCanvas";

gsap.registerPlugin(useGSAP, ScrollTrigger);

// WebGL is heavy + client-only → lazy load so it never blocks first paint
const HeroCanvas = dynamic(() => import("@/components/sections/home/HeroCanvas"), {
  ssr: false,
});

// The title broken into two cinematic lines for stronger line-mask reveals.
const TITLE_LINES = ["Jeen Eventz", "and Planners"];

type Tier = "high" | "low" | "off" | null;

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const midLight = useRef<HTMLDivElement>(null);
  const sweep = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const tagline = useRef<HTMLParagraphElement>(null);
  const buttons = useRef<HTMLDivElement>(null);

  // Imperative bridge into the WebGL scene — animated by GSAP, read each frame
  // inside the canvas. No React state ⇒ zero rerenders during the sequence.
  const progress = useRef<HeroProgress>({ reveal: 0, scroll: 0, bloom: 0 });

  const [tier, setTier] = useState<Tier>(null);

  // Decide WebGL fidelity from the device (and disable on very low-end).
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    if (cores <= 2 || mem <= 1) setTier("off");
    else if (small || coarse) setTier("low");
    else setTier("high");
  }, []);

  // Intro choreography + scroll-out. Runs ONCE (independent of `tier`, so the
  // sequence is never restarted when device-tier resolves a frame after mount).
  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const lines = title.current?.querySelectorAll<HTMLElement>("[data-line]");

      // Reduced motion → present the final composed frame, no choreography.
      if (reduce) {
        progress.current.reveal = 1;
        gsap.set([canvasWrap.current, tagline.current, buttons.current], { opacity: 1 });
        gsap.set(content.current, { opacity: 1 });
        if (lines) gsap.set(lines, { yPercent: 0 });
        gsap.set(line.current, { scaleX: 1, opacity: 0.4 });
        return;
      }

      // --- initial states ----------------------------------------------------
      gsap.set(canvasWrap.current, { opacity: 0 });
      gsap.set(line.current, { scaleX: 0, opacity: 1 });
      gsap.set(title.current, { scale: 1.08 });
      if (lines) gsap.set(lines, { yPercent: 120 });
      gsap.set(tagline.current, { opacity: 0, y: 16 });
      gsap.set(buttons.current, { opacity: 0, y: 12, scale: 0.96 });
      gsap.set(sweep.current, { xPercent: -130, opacity: 0 });

      // --- cinematic entrance (~3s, confident & unhurried) -------------------
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // STEP 1 — black → a single gold line draws in, ambient glow emerges
      tl.to(line.current, { scaleX: 1, duration: 1.2, ease: "power3.inOut" }, 0)
        .to(canvasWrap.current, { opacity: 1, duration: 1.5, ease: "power2.out" }, 0.25)
        .to(progress.current, { reveal: 1.12, duration: 1.4, ease: "power2.out" }, 0.25)

        // STEP 2/3 — title rises through masks and settles with weight
        .to(lines ?? [], { yPercent: 0, duration: 1.35, stagger: 0.16 }, 0.95)
        .to(title.current, { scale: 1, duration: 1.7 }, 0.95)
        .to(line.current, { opacity: 0, duration: 0.9 }, 1.3)

        // THE MOMENT — as the title settles, a soft gold bloom erupts behind
        // it and a lens-light sweep crosses the scene, then both release. This
        // brief convergence is the emotional peak.
        .to(progress.current, { reveal: 1, duration: 1.1, ease: "power2.inOut" }, 1.6)
        .to(progress.current, { bloom: 1, duration: 0.5, ease: "power2.out" }, 1.55)
        .to(progress.current, { bloom: 0, duration: 1.4, ease: "power2.inOut" }, 2.05)
        .fromTo(
          sweep.current,
          { xPercent: -130, opacity: 0 },
          { xPercent: 130, opacity: 1, duration: 1.7, ease: "power2.inOut" },
          1.15
        )
        .to(sweep.current, { opacity: 0, duration: 0.5 }, 2.6)

        // STEP 4 — supporting type arrives, hero is "alive"
        .to(tagline.current, { opacity: 1, y: 0, duration: 0.9 }, 1.95)
        .to(buttons.current, { opacity: 1, y: 0, scale: 1, duration: 0.8 }, 2.2);

      // --- scroll-out: hero compresses & drifts, atmosphere stretches up -----
      const scrollCfg = {
        trigger: root.current,
        start: "top top",
        end: "bottom top",
        scrub: true as const,
      };
      gsap.to(content.current, {
        yPercent: -18,
        scale: 0.93,
        opacity: 0,
        ease: "none",
        scrollTrigger: scrollCfg,
      });
      gsap.to(canvasWrap.current, { yPercent: -14, ease: "none", scrollTrigger: scrollCfg });
      gsap.to(progress.current, { scroll: 1, ease: "none", scrollTrigger: scrollCfg });
    },
    { scope: root }
  );

  // Cursor parallax depth — desktop only, set up once the device tier resolves.
  useGSAP(
    () => {
      if (tier !== "high") return;
      if (window.matchMedia("(pointer: coarse)").matches) return;

      const tx = gsap.quickTo(title.current, "x", { duration: 0.9, ease: "power3" });
      const ty = gsap.quickTo(title.current, "y", { duration: 0.9, ease: "power3" });
      const mx = gsap.quickTo(midLight.current, "xPercent", { duration: 1.4, ease: "power3" });
      const my = gsap.quickTo(midLight.current, "yPercent", { duration: 1.4, ease: "power3" });

      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        tx(nx * 22); // foreground type — strongest
        ty(ny * 14);
        mx(nx * -4); // mid light — opposite & slower → depth
        my(ny * -3);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root, dependencies: [tier] }
  );

  const count = tier === "high" ? 1500 : tier === "low" ? 500 : 0;
  const dpr: [number, number] = tier === "high" ? [1, 1.5] : [1, 1];

  return (
    <section ref={root} className="relative h-screen w-full overflow-hidden bg-black">
      {/* distant layer — WebGL atmosphere (fades in from black via GSAP) */}
      <div ref={canvasWrap} className="absolute inset-0 z-0 opacity-0 will-change-transform">
        {tier && tier !== "off" ? (
          <HeroCanvas count={count} dpr={dpr} progress={progress} />
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 100%, rgba(201,162,90,0.18), transparent 60%), radial-gradient(80% 80% at 50% 40%, #0a0e16, #04060a)",
            }}
          />
        )}
      </div>

      {/* mid layer — soft gold diffusion that parallaxes against the cursor */}
      <div
        ref={midLight}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1] will-change-transform"
        style={{
          background:
            "radial-gradient(46% 38% at 50% 44%, rgba(201,162,90,0.10), transparent 70%)",
        }}
      />

      {/* one-pass cinematic light sweep (intro only) */}
      <div
        ref={sweep}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] will-change-transform"
        style={{
          background:
            "linear-gradient(76deg, transparent 38%, rgba(231,201,135,0.16) 50%, transparent 62%)",
        }}
      />

      {/* cinematic edge vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[3]"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 50%, transparent 52%, rgba(0,0,0,0.55) 100%)",
        }}
      />

      {/* foreground — content */}
      <div
        ref={content}
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center will-change-transform"
      >
        {/* STEP 1 gold line */}
        <div
          ref={line}
          aria-hidden
          className="mb-10 h-px w-[42vw] max-w-md origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        />

        <h1
          ref={title}
          className="text-gold uppercase will-change-transform"
          style={{
            // Anton — condensed, inherently heavy display. Uppercase + tight
            // stacked lines give a commanding film-title / fashion-campaign
            // mass. Weight is pinned to 400 (Anton's only, native-black weight)
            // so the browser never synthesises a faux-bold. Layered shadows add
            // dimensional presence and readability over the atmosphere.
            fontFamily: "var(--font-anton)",
            fontWeight: 400,
            letterSpacing: "0",
            lineHeight: 1.04,
            textShadow: "0 2px 34px rgba(0,0,0,0.5), 0 1px 1px rgba(0,0,0,0.3)",
          }}
        >
          {TITLE_LINES.map((l, i) => (
            <span key={i} className="block overflow-hidden pb-[0.1em]">
              <span
                data-line
                className="block text-[clamp(3.2rem,12vw,10.5rem)] will-change-transform"
              >
                {l}
              </span>
            </span>
          ))}
        </h1>

        <p
          ref={tagline}
          className="mt-8 text-[0.7rem] uppercase tracking-[0.42em] text-white/60 md:text-sm"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Crafting Prestigious Experiences
        </p>

        <div
          ref={buttons}
          className="mt-12 flex flex-col items-center gap-4 min-[480px]:flex-row"
        >
          <motion.div
            whileHover={{ boxShadow: "0 0 44px rgba(201,162,90,0.55)", scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-full"
          >
            <Link
              href="/services"
              data-cursor="explore"
              className="block rounded-full bg-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-black"
            >
              Explore More
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ boxShadow: "0 0 44px rgba(201,162,90,0.4)", scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="rounded-full"
          >
            <Link
              href="/projects"
              data-cursor="clients"
              className="block rounded-full border border-gold px-10 py-4 text-sm font-medium uppercase tracking-[0.18em] text-gold"
            >
              Clients
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
