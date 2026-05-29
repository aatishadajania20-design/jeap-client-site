"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * Velocity-skewed marquee — base drift plus a scroll-reactive boost, so the
 * editorial words accelerate as you scroll through them.
 */
export default function Marquee({
  text,
  baseVelocity = -2,
  className = "",
}: {
  text: string;
  baseVelocity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const raw = useTransform(scrollYProgress, [0, 1], [0, baseVelocity * 60]);
  const x = useSpring(raw, { stiffness: 60, damping: 20, mass: 0.6 });
  const skew = useTransform(x, [-120, 0, 120], [-4, 0, 4]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{ x: useTransform(x, (v) => `${v}px`), skewX: skew }}
        className="flex whitespace-nowrap will-change-transform"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <span
            key={i}
            className="display mr-12 text-[clamp(3rem,11vw,10rem)] leading-none text-bone/90"
          >
            {text}
            <span className="gilt"> · </span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
