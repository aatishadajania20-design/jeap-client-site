"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { SERVICES } from "@/lib/site";
import RevealText from "@/components/ui/RevealText";
import Visual from "@/components/ui/Visual";

export default function ServicesPreview() {
  const [active, setActive] = useState<number | null>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 20 });
  const y = useSpring(my, { stiffness: 150, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    const rect = wrap.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set(e.clientX - rect.left);
    my.set(e.clientY - rect.top);
  };

  return (
    <section className="relative z-10 px-6 py-[14vh] md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="kicker mb-5">What we do — 02</p>
            <RevealText
              as="h2"
              className="display block text-[clamp(2.2rem,6vw,5rem)] leading-[0.95] text-bone"
            >
              Four disciplines, one direction.
            </RevealText>
          </div>
          <Link
            href="/services"
            data-cursor="explore"
            className="link-underline text-sm uppercase tracking-[0.2em] text-ash hover:text-bone"
          >
            All services ↗
          </Link>
        </div>

        <div ref={wrap} onMouseMove={onMove} className="relative">
          <ul className="border-t border-white/10">
            {SERVICES.map((s, i) => (
              <li
                key={s.id}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                data-cursor="view"
                className="group relative border-b border-white/10"
              >
                <Link
                  href="/services"
                  className="flex items-baseline justify-between gap-6 py-7 transition-all duration-500 md:py-10"
                >
                  <div className="flex items-baseline gap-6 md:gap-12">
                    <span className="font-body text-xs tracking-[0.3em] text-gold">
                      {s.id}
                    </span>
                    <motion.span
                      animate={{ x: active === i ? 24 : 0 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="display text-[clamp(1.8rem,5.5vw,4.5rem)] leading-none text-bone"
                    >
                      {s.title}
                    </motion.span>
                  </div>
                  <span className="hidden max-w-xs text-right text-sm text-ash md:block">
                    {s.capabilities.slice(0, 2).join(" · ")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Floating cursor-following preview (desktop) */}
          <AnimatePresence>
            {active !== null && (
              <motion.div
                key={active}
                style={{ x, y }}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="pointer-events-none absolute left-0 top-0 z-20 hidden h-64 w-80 -translate-x-1/2 -translate-y-1/2 lg:block"
              >
                <Visual
                  tint={SERVICES[active].tint}
                  label={SERVICES[active].title}
                  index={SERVICES[active].id}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
