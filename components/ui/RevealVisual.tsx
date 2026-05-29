"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Visual from "./Visual";

/**
 * Cinematic image reveal: a curtain wipes upward to uncover the plate while the
 * plate itself drifts on a slow parallax — the "image arriving into frame" beat
 * used through About and Projects.
 */
export default function RevealVisual({
  tint,
  label,
  index,
  className,
  parallax = true,
}: {
  tint?: string;
  label?: string;
  index?: string;
  className?: string;
  parallax?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], parallax ? ["-10%", "10%"] : ["0%", "0%"]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ clipPath: "inset(100% 0 0 0)" }}
        whileInView={{ clipPath: "inset(0% 0 0 0)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1.3, ease: [0.76, 0, 0.24, 1] }}
        className="h-full w-full"
      >
        <motion.div style={{ y }} className="h-[120%] w-full">
          <Visual tint={tint} label={label} index={index} />
        </motion.div>
      </motion.div>
    </div>
  );
}
