"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { PROJECTS } from "@/lib/site";
import RevealText from "@/components/ui/RevealText";
import Visual from "@/components/ui/Visual";

function WorkRow({ project, i }: { project: (typeof PROJECTS)[number]; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  const reverse = i % 2 === 1;

  return (
    <Link
      ref={ref}
      href="/projects"
      data-cursor="open"
      className={`group grid grid-cols-1 items-center gap-8 md:grid-cols-12 ${
        reverse ? "md:[direction:rtl]" : ""
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden md:col-span-7 md:aspect-[16/11] [direction:ltr]">
        <motion.div
          style={{ y: imgY }}
          className="absolute inset-0 scale-110 transition-transform duration-[1.2s] ease-luxe group-hover:scale-100"
        >
          <Visual tint={project.tint} />
        </motion.div>
        <div className="absolute inset-0 bg-noir/20 transition-opacity duration-700 group-hover:bg-noir/0" />
        <span className="absolute left-6 top-6 font-body text-xs tracking-[0.3em] text-gold">
          {project.index}
        </span>
      </div>

      <div className="md:col-span-5 [direction:ltr]">
        <p className="kicker mb-4">{project.discipline}</p>
        <RevealText
          as="h3"
          className="display block text-[clamp(2.5rem,7vw,5.5rem)] leading-none text-bone"
        >
          {project.title}
        </RevealText>
        <p className="mt-6 max-w-md text-ash">{project.blurb}</p>
        <div className="mt-6 flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-ash">
          <span>{project.client}</span>
          <span className="h-px w-8 bg-gold/40" />
          <span>{project.year}</span>
        </div>
      </div>
    </Link>
  );
}

export default function WorkPreview() {
  return (
    <section className="relative z-10 px-6 py-[12vh] md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-20 flex items-end justify-between">
          <div>
            <p className="kicker mb-5">Selected work — 03</p>
            <RevealText
              as="h2"
              className="display block text-[clamp(2.2rem,6vw,5rem)] leading-[0.95] text-bone"
            >
              Recent productions.
            </RevealText>
          </div>
          <Link
            href="/projects"
            data-cursor="all work"
            className="link-underline hidden text-sm uppercase tracking-[0.2em] text-ash hover:text-bone md:block"
          >
            View archive ↗
          </Link>
        </div>

        <div className="flex flex-col gap-[14vh]">
          {PROJECTS.slice(0, 3).map((p, i) => (
            <WorkRow key={p.id} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
