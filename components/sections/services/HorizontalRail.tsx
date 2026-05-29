"use client";

import { useCallback, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SERVICES } from "@/lib/site";
import ServiceCard from "./ServiceCard";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/**
 * Cinematic pinned horizontal scroll.
 *
 * Architecture
 * - The TRACK is `w-max` with `shrink-0` children, so it is *always* wider than
 *   the viewport and `scrollWidth` reflects the true content width (never 0).
 * - On desktop we pin the section and translate the track by exactly its
 *   overflow distance — both `x` and `end` are functions, so they recompute on
 *   every ScrollTrigger.refresh() (resize / font load) via `invalidateOnRefresh`.
 * - On mobile / reduced-motion we skip GSAP entirely and fall back to native
 *   horizontal swipe (`overflow-x-auto`).
 * - `useGSAP` scopes + auto-reverts everything, so React Strict Mode's double
 *   mount never leaves duplicate ScrollTriggers behind.
 * - Active-card state is lifted here so only ONE hover WebGL canvas is ever
 *   mounted at a time.
 */
export default function HorizontalRail() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const activate = useCallback((id: string) => setActiveId(id), []);
  const deactivate = useCallback(
    (id: string) => setActiveId((cur) => (cur === id ? null : cur)),
    []
  );

  useGSAP(
    () => {
      const trackEl = track.current;
      const sectionEl = container.current;
      if (!trackEl || !sectionEl) return;

      // Travel distance = how far the track overflows the viewport. Recomputed
      // on every refresh so resize / font-swap can never desync the pin.
      const getDistance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          const tween = gsap.to(trackEl, {
            x: () => -getDistance(),
            ease: "none",
            scrollTrigger: {
              trigger: sectionEl,
              start: "top top",
              end: () => "+=" + getDistance(),
              scrub: 1,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });
          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        }
      );

      // Card widths shift after the display font swaps in → recompute once ready.
      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }

      return () => mm.revert();
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="relative z-10 min-h-screen overflow-hidden"
    >
      {/* viewport mask: clips on desktop (pin translates the track),
          native horizontal swipe on mobile */}
      <div className="no-scrollbar overflow-x-auto overflow-y-hidden md:overflow-hidden">
        <div
          ref={track}
          className="flex w-max items-center gap-6 px-6 py-20 will-change-transform md:px-10"
        >
          <div className="hidden shrink-0 pr-4 md:block md:w-[18vw]">
            <p className="kicker mb-5">02 / Disciplines</p>
            <p className="display text-4xl leading-tight text-bone">
              Drag the
              <br />
              <span className="gilt italic">spectrum.</span>
            </p>
            <p className="mt-6 text-sm text-ash">
              Scroll to traverse the studio&apos;s craft.
            </p>
          </div>

          {SERVICES.map((s) => (
            <ServiceCard
              key={s.id}
              service={s}
              active={activeId === s.id}
              onActivate={activate}
              onDeactivate={deactivate}
            />
          ))}

          <div className="shrink-0 pr-6 md:w-[14vw]" />
        </div>
      </div>
    </section>
  );
}
