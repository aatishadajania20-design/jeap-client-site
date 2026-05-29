"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const TEXT =
  "We believe luxury is not loud. It is the discipline of restraint — the single gesture that says everything. We direct light, motion and silence until a brand stops being seen and starts being felt.";

function Word({
  children,
  range,
  progress,
}: {
  children: ReactNode;
  range: [number, number];
  progress: MotionValue<number>;
}) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  const color = useTransform(progress, range, ["#8a857c", "#ece7dd"]);
  return (
    <motion.span style={{ opacity, color }} className="mr-[0.28em] inline-block">
      {children}
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.4"],
  });
  const words = TEXT.split(" ");

  return (
    <section
      ref={ref}
      className="relative z-10 mx-auto max-w-[1400px] px-6 py-[18vh] md:px-10"
    >
      <p className="kicker mb-12">The Manifesto — 01</p>
      <p className="display flex flex-wrap text-[clamp(1.8rem,5vw,4.5rem)] leading-[1.15]">
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          const accent = ["luxury", "felt.", "restraint"].some((a) =>
            word.includes(a)
          );
          return (
            <Word key={i} range={[start, end]} progress={scrollYProgress}>
              {accent ? (
                <span className="gilt italic">{word}</span>
              ) : (
                word
              )}
            </Word>
          );
        })}
      </p>
    </section>
  );
}
