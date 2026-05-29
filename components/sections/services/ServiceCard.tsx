"use client";

import dynamic from "next/dynamic";
import { memo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { SERVICES } from "@/lib/site";

const DistortField = dynamic(() => import("@/components/webgl/DistortField"), {
  ssr: false,
});

type Props = {
  service: (typeof SERVICES)[number];
  active: boolean;
  onActivate: (id: string) => void;
  onDeactivate: (id: string) => void;
};

/**
 * The WebGL liquid-distortion field mounts ONLY while this card is the active
 * one (state is owned by the rail), so at most one canvas is ever live. The
 * canvas layer is `pointer-events-none` so it never intercepts hover/scroll and
 * adds zero hit-testing overhead.
 */
function ServiceCardBase({ service, active, onActivate, onDeactivate }: Props) {
  const enter = useCallback(() => onActivate(service.id), [onActivate, service.id]);
  const leave = useCallback(() => onDeactivate(service.id), [onDeactivate, service.id]);

  return (
    <article
      onMouseEnter={enter}
      onMouseLeave={leave}
      data-cursor="discipline"
      className="group relative flex h-[68vh] min-h-[460px] w-[82vw] shrink-0 flex-col justify-between overflow-hidden border border-white/10 p-8 sm:w-[56vw] md:w-[42vw] md:p-12 lg:w-[40vw]"
    >
      {/* WebGL hover field — single active canvas, never interactive */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 z-0"
          >
            <DistortField tint={service.tint} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-noir/40 transition-opacity duration-700 group-hover:opacity-0" />

      <div className="relative z-10 flex items-start justify-between">
        <span className="font-body text-xs tracking-[0.3em] text-gold">{service.id}</span>
        <motion.span
          animate={{ rotate: active ? 90 : 0 }}
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

const ServiceCard = memo(ServiceCardBase);
export default ServiceCard;
