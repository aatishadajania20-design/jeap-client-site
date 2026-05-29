"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const line = {
  hidden: { y: "115%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 + i * 0.1 },
  }),
};

/**
 * Shared cinematic header for inner pages. Index/kicker, oversized title that
 * lifts into frame line-by-line, parallax on scroll, optional lede.
 */
export default function PageHero({
  index,
  kicker,
  titleLines,
  lede,
}: {
  index: string;
  kicker: string;
  titleLines: string[];
  lede?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const fade = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[88svh] items-end overflow-hidden px-6 pb-16 pt-40 md:px-10"
    >
      <motion.div style={{ y, opacity: fade }} className="mx-auto w-full max-w-[1600px]">
        <div className="mb-10 flex items-center gap-5">
          <span className="font-body text-xs tracking-[0.3em] text-gold">{index}</span>
          <span className="h-px w-16 bg-gold/40" />
          <span className="kicker">{kicker}</span>
        </div>

        <h1 className="display text-bone">
          {titleLines.map((l, i) => (
            <span key={i} className="line-mask block">
              <motion.span
                custom={i}
                variants={line}
                initial="hidden"
                animate="show"
                className="block text-[clamp(2.8rem,12vw,12rem)] leading-[0.86]"
              >
                {l}
              </motion.span>
            </span>
          ))}
        </h1>

        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="body-lg mt-12 max-w-xl text-ash md:ml-auto"
          >
            {lede}
          </motion.p>
        )}
      </motion.div>
    </section>
  );
}
