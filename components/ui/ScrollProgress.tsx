"use client";

import { motion, useScroll } from "framer-motion";

/**
 * A single 2px gold hairline at the top of the viewport that fills with scroll
 * progress. GPU-only (it animates `scaleX` via transform), pointer-events-none,
 * and bound directly to the page scroll — no spring, no extra RAF loop.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden
      style={{ scaleX: scrollYProgress }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] origin-left bg-gradient-to-r from-gold-deep via-gold to-gold-light"
    />
  );
}
