"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import RevealText from "@/components/ui/RevealText";

/**
 * "Recent productions." — the homepage showcase. Real production artwork from the
 * NextGen Icon Awards 2026 (Chapter II) is presented as featured productions in an
 * alternating editorial layout. The source files are vertical key-art posters
 * (4:5) with critical type top and bottom, so the frame is portrait — nothing is
 * cropped away. Motion is transform/opacity only (subtle parallax + scale-on-hover)
 * to keep scrolling smooth; no WebGL, no filters.
 *
 * This data is intentionally local to this section: the shared `PROJECTS` archive
 * in `lib/site.ts` powers the /projects page and is left untouched.
 */

type Production = {
  id: string;
  index: string;
  title: string;
  client: string;
  year: string;
  discipline: string;
  blurb: string;
  src: string;
  alt: string;
};

const PRODUCTIONS: Production[] = [
  {
    id: "beyond-achievements",
    index: "001",
    title: "Beyond Achievements",
    client: "NextGen Icon Awards",
    year: "2026",
    discipline: "Key Art · Art Direction",
    blurb:
      "The flagship stage where achievers become legacies — Chapter II of the NextGen Icon Awards, directed as one cinematic arc.",
    src: "/images/productions/nia-beyond-achievements.jpg",
    alt: "NextGen Icon Awards 2026 Chapter II key art — Beyond Achievements, Towards Inspiration",
  },
  {
    id: "honouring-today",
    index: "002",
    title: "Honouring Today",
    client: "NextGen Icon Awards",
    year: "2026",
    discipline: "Campaign · Editorial",
    blurb:
      "Awardee and celebrity-guest features built as a single editorial system — honouring today, inspiring tomorrow.",
    src: "/images/productions/nia-honouring-today.jpg",
    alt: "NextGen Icon Awards 2026 Chapter II feature — awardee Naresh Pratap Singh and celebrity guest Huma Qureshi",
  },
  {
    id: "recognising-vision",
    index: "003",
    title: "Recognising Vision",
    client: "NextGen Icon Awards",
    year: "2026",
    discipline: "Identity · Trophy",
    blurb:
      "The award itself — vision and impact cast in gold, the closing note of the Chapter II identity.",
    src: "/images/productions/nia-recognising-vision.jpg",
    alt: "NextGen Icon Awards 2026 Chapter II trophy — Recognising Vision, Celebrating Impact",
  },
];

function WorkRow({ production, i }: { production: Production; i: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Gentle parallax — the inner plate is oversized (inset -8%) so the shift never
  // exposes an edge. Kept subtle on purpose.
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const reverse = i % 2 === 1;

  return (
    <Link
      ref={ref}
      href="/projects"
      data-cursor="open"
      className={`group grid grid-cols-1 items-center gap-8 md:grid-cols-12 md:gap-12 ${
        reverse ? "md:[direction:rtl]" : ""
      }`}
    >
      <div className="md:col-span-6 [direction:ltr]">
        <div className="group/frame relative mx-auto aspect-[4/5] w-full max-w-[520px] overflow-hidden rounded-xl border border-white/[0.06] transition-colors duration-700 ease-luxe group-hover:border-gold/40">
          <motion.div style={{ y: imgY }} className="absolute inset-[-8%]">
            <Image
              src={production.src}
              alt={production.alt}
              fill
              quality={100}
              sizes="(min-width: 768px) 44vw, 100vw"
              className="transform-gpu object-cover transition-transform duration-[1.2s] ease-luxe will-change-transform group-hover:scale-[1.05]"
            />
          </motion.div>

          {/* Cinematic depth — base vignette + bottom lift for legibility, eased on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-noir/40 via-transparent to-noir/10 opacity-80 transition-opacity duration-700 group-hover:opacity-40" />

          {/* Index marker, top-left */}
          <span className="absolute left-5 top-5 font-body text-xs tracking-[0.3em] text-gold">
            {production.index}
          </span>

          {/* Discipline tag — fades up on hover */}
          <span className="absolute bottom-5 left-5 right-5 translate-y-2 text-[0.65rem] uppercase tracking-[0.28em] text-bone/90 opacity-0 transition-all duration-500 ease-luxe group-hover:translate-y-0 group-hover:opacity-100">
            View production →
          </span>
        </div>
      </div>

      <div className="md:col-span-6 [direction:ltr]">
        <p className="kicker mb-4">{production.discipline}</p>
        <RevealText
          as="h3"
          className="display block text-[clamp(2.5rem,7vw,5.5rem)] leading-none text-bone"
        >
          {production.title}
        </RevealText>
        <p className="mt-6 max-w-md text-ash">{production.blurb}</p>
        <div className="mt-6 flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-ash">
          <span>{production.client}</span>
          <span className="h-px w-8 bg-gold/40" />
          <span>{production.year}</span>
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
          {PRODUCTIONS.map((p, i) => (
            <WorkRow key={p.id} production={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
