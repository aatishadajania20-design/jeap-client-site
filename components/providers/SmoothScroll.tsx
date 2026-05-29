"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      smoothWheel: true,
      // NOTE: installed lenis (^1.1.20) renamed `smoothTouch` → `syncTouch`.
      // `syncTouch: false` is the same intent: native (non-smoothed) touch.
      syncTouch: false,
    });

    // Sync Lenis with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Drive Lenis from GSAP ticker
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    // Prevent GSAP lag smoothing conflicts
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger after layout stabilizes
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
