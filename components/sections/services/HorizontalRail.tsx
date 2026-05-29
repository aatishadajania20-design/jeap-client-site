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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (reduce) return;
      const el = track.current!;
      const distance = el.scrollWidth - window.innerWidth;

      const tween = gsap.to(el, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: () => `+=${distance + window.innerHeight * 0.6}`,
          scrub: 0.8,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      return () => tween.scrollTrigger?.kill();
    });

    return () => mm.revert();
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
