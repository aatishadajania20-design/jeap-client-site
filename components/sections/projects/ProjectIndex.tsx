"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { PROJECTS } from "@/lib/site";
import Visual from "@/components/ui/Visual";

/**
 * Awwwards-style index: a hovered row promotes its plate into a fixed
 * fullscreen backdrop behind the list. On touch, the backdrop simply tracks
 * the row scrolled into the centre is skipped — the list reads on its own.
 */
export default function ProjectIndex() {
  const [active, setActive] = useState(0);
  const [hovering, setHovering] = useState(false);

  return (
    <section className="relative z-10">
      {/* Fixed backdrop preview */}
      <div className="pointer-events-none fixed inset-0 z-0 hidden lg:block">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: hovering ? 0.5 : 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Visual tint={PROJECTS[active].tint} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto max-w-[1600px] px-6 py-[6vh] md:px-10">
        <ul
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="border-t border-white/10"
        >
          {PROJECTS.map((p, i) => (
            <li
              key={p.id}
              onMouseEnter={() => setActive(i)}
              className="border-b border-white/10"
            >
              <Link
                href="/projects"
                data-cursor="open"
                className="group grid grid-cols-12 items-center gap-4 py-8 md:py-12"
              >
                <span className="col-span-2 font-body text-xs tracking-[0.3em] text-gold md:col-span-1">
                  {p.index}
                </span>
                <div className="col-span-10 md:col-span-5">
                  <motion.h3 className="display text-[clamp(2rem,6vw,5rem)] leading-none text-ash transition-colors duration-500 group-hover:text-bone">
                    {p.title}
                  </motion.h3>
                </div>
                <span className="col-span-6 col-start-3 text-sm uppercase tracking-[0.18em] text-ash md:col-span-4 md:col-start-7">
                  {p.discipline}
                </span>
                <span className="col-span-4 col-start-9 text-right text-sm uppercase tracking-[0.18em] text-ash md:col-span-2">
                  {p.year}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
