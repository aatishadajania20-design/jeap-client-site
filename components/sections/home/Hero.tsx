"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";

// WebGL is heavy + client-only → lazy load so it never blocks first paint
const HeroCanvas = dynamic(() => import("@/components/sections/home/HeroCanvas"), {
  ssr: false,
});

const COMPANY = "Jeen Eventz and Planners";
const WORDS = COMPANY.split(" ");

type Tier = "high" | "low" | "off" | null;

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);
  const canvasWrap = useRef<HTMLDivElement>(null);
  const name = useRef<HTMLHeadingElement>(null);
  const tagline = useRef<HTMLParagraphElement>(null);
  const buttons = useRef<HTMLDivElement>(null);

  const [tier, setTier] = useState<Tier>(null);

  // Decide WebGL fidelity from the device (and disable on very low-end)
  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    if (cores <= 2 || mem <= 1) setTier("off");
    else if (small || coarse) setTier("low");
    else setTier("high");
  }, []);

  // Cinematic entrance — GSAP timeline, runs once on load (~2.5s)
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const words = name.current?.querySelectorAll<HTMLElement>("[data-word]");
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set([canvasWrap.current, tagline.current, buttons.current], { opacity: 1 });
        if (words) gsap.set(words, { yPercent: 0, opacity: 1 });
        return;
      }

      if (words) gsap.set(words, { yPercent: 120, opacity: 0 });
      gsap.set(tagline.current, { opacity: 0, y: 18 });
      gsap.set(buttons.current, { opacity: 0, scale: 0.9 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.to(canvasWrap.current, { opacity: 1, duration: 0.8 }, 0);
      if (words) {
        tl.to(words, { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.15 }, 0.4);
      }
      tl.to(tagline.current, { opacity: 1, y: 0, duration: 0.7 }, 1.75);
      tl.to(buttons.current, { opacity: 1, scale: 1, duration: 0.6 }, 2.0);
    }, root);

    return () => ctx.revert();
  }, []);

  const count = tier === "high" ? 1500 : tier === "low" ? 500 : 0;

  return (
    <section
      ref={root}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* WebGL background (fades in from black via GSAP) */}
      <div ref={canvasWrap} className="absolute inset-0 z-0 opacity-0">
        {tier && tier !== "off" ? (
          <HeroCanvas count={count} />
        ) : (
          // graceful fallback for very low-end devices
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 60% at 50% 100%, rgba(201,162,90,0.18), transparent 60%), radial-gradient(80% 80% at 50% 40%, #0a0e16, #04060a)",
            }}
          />
        )}
      </div>

      {/* Centered content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          ref={name}
          className="display flex flex-wrap items-center justify-center gap-x-[0.28em] gap-y-1 text-gold"
          style={{ letterSpacing: "-0.02em", lineHeight: 1.02 }}
        >
          {WORDS.map((word, i) => (
            <span key={i} className="inline-block overflow-hidden pb-[0.12em]">
              <span
                data-word
                className="inline-block text-[clamp(3rem,9vw,7rem)] will-change-transform"
              >
                {word}
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
