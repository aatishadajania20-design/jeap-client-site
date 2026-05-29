"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import type { PROJECTS } from "@/lib/site";
import Visual from "@/components/ui/Visual";

/** Full-bleed cinematic preview: plate scales on scroll, type drifts over it. */
export default function Featured({
  project,
}: {
  project: (typeof PROJECTS)[number];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1.25, 1]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["40%", "-40%"]);
  const overlay = useTransform(scrollYProgress, [0, 0.5, 1], [0.7, 0.3, 0.7]);

  return (
    <Link href="/projects" data-cursor="watch" className="block">
      <div ref={ref} className="relative h-[100svh] w-full overflow-hidden">
        <motion.div style={{ scale }} className="absolute inset-0">
          <Visual tint={project.tint} />
        </motion.div>
        <motion.div style={{ opacity: overlay }} className="absolute inset-0 bg-noir" />

        <motion.div
          style={{ y: titleY }}
          className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center"
        >
          <span className="kicker mb-6">{project.discipline}</span>
          <h2 className="display text-[clamp(3rem,15vw,15rem)] leading-[0.85] text-bone">
            {project.title}
          </h2>
          <p className="mt-8 max-w-lg text-ash">{project.blurb}</p>
          <span className="mt-8 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-gold">
            {project.client} <span className="h-px w-8 bg-gold/50" /> {project.year}
          </span>
        </motion.div>
      </div>
    </Link>
  );
}
