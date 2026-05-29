"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/lib/site";
import ServiceCard from "./ServiceCard";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

/**
 * Pins the section and translates the card track horizontally as the user
 * scrolls vertically — the signature cinematic side-scroll. Disabled below md
 * (and for reduced motion), where it falls back to a native horizontal swipe.
 */
export default function HorizontalRail() {
  const section = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const sectionEl = section.current;
    const trackEl = track.current;
    if (!sectionEl || !trackEl) return;

    // distance the track must travel = its overflow past the viewport.
    // Recomputed on every refresh (fonts/resize) via the function form below.
    const getDistance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth);

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.to(trackEl, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionEl,
            start: "top top",
            end: () => "+=" + getDistance(),
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    }, sectionEl);

    // Positions depend on final layout — recompute once fonts/images settle so
    // the pin engages at the correct scroll offset (no blank gap).
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(refresh);
    }
    const t = window.setTimeout(refresh, 300);

    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      ctx.revert();
    };
  }, []);

  return (
    <section ref={section} className="relative z-10 overflow-hidden">
      <div
        ref={track}
        className="no-scrollbar flex items-center gap-6 overflow-x-auto px-6 py-20 md:overflow-visible md:px-10"
      >
        <div className="hidden shrink-0 pr-4 md:block md:w-[18vw]">
          <p className="kicker mb-5">02 / Disciplines</p>
          <p className="display text-4xl leading-tight text-bone">
            Drag the<br />
            <span className="gilt italic">spectrum.</span>
          </p>
          <p className="mt-6 text-sm text-ash">Scroll to traverse the studio's craft.</p>
        </div>
        {SERVICES.map((s) => (
          <ServiceCard key={s.id} service={s} />
        ))}
        <div className="shrink-0 pr-6 md:w-[14vw]" />
      </div>
    </section>
  );
}
