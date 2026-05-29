"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SERVICES } from "@/lib/site";

const DistortField = dynamic(() => import("@/components/webgl/DistortField"), {
  ssr: false,
});

/**
 * Each card carries a WebGL liquid-distortion field that only mounts on hover —
 * so a row of cards never runs multiple canvases at once.
 */
export default function ServiceCard({
  service,
}: {
  service: (typeof SERVICES)[number];
}) {
  const [hover, setHover] = useState(false);

  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="discipline"
      className="group relative flex h-[68vh] min-h-[460px] w-[82vw] shrink-0 flex-col justify-between overflow-hidden border border-white/10 p-8 sm:w-[56vw] md:w-[42vw] md:p-12 lg:w-[34vw]"
    >
      {/* WebGL hover field */}
      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-0"
          >
            <DistortField tint={service.tint} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-[1] bg-noir/40 transition-opacity duration-700 group-hover:opacity-0" />

      <div className="relative z-10 flex items-start justify-between">
        <span className="font-body text-xs tracking-[0.3em] text-gold">{service.id}</span>
        <motion.span
          animate={{ rotate: hover ? 90 : 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-2xl text-bone"
        >
          ↗
        </motion.span>
      </div>

      <div className="relative z-10">
        <h3 className="display text-[clamp(2.2rem,4.5vw,3.8rem)] leading-none text-bone">
          {service.title}
        </h3>
        <p className="mt-6 max-w-sm text-ash transition-colors duration-500 group-hover:text-bone">
          {service.summary}
        </p>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {service.capabilities.map((c) => (
            <li
              key={c}
              className="text-xs uppercase tracking-[0.18em] text-ash group-hover:text-bone/80"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
