"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global smooth-scroll backbone.
 *
 * Keeps the mandated Lenis ⇄ GSAP integration intact:
 *   • lenis.on("scroll", ScrollTrigger.update)  — triggers stay in sync
 *   • gsap.ticker drives lenis.raf              — single shared clock (no extra RAF)
 *   • gsap.ticker.lagSmoothing(0)               — no lag-smoothing conflicts
 *
 * Refinements: weighted expo-out momentum (premium inertia), proper ticker
 * teardown (no leak), a reduced-motion bail-out, and a per-route refresh so
 * pinned sections never desync after client navigation.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      // expo.out — heavy, cinematic settle rather than a linear glide
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    // Recompute trigger positions once the first layout settles.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      gsap.ticker.remove(update);
      lenis.destroy();
      (window as unknown as { __lenis?: Lenis }).__lenis = undefined;
    };
  }, []);

  // On client navigation: reset to top and refresh so pins re-measure cleanly.
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    lenis?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
