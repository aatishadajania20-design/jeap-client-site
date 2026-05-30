"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * "Recent Productions" — large cinematic showcase cards, one per NextGen Icon
 * Awards chapter. The source files are vertical event posters (4:5), so the
 * cards are portrait too: the full banner is visible with no hard cropping.
 *
 * Below the posters, a host spotlight features the founder of JEAP on stage with
 * Sunil Shetty — a credibility moment for the house. Clean flat background, no
 * WebGL / particles, and transform-only animation so scrolling stays smooth.
 */

type Production = {
  title: string;
  chapter: string;
  date: string;
  tag: string;
  src: string;
  alt: string;
};

const PRODUCTIONS: Production[] = [
  {
    title: "NextGen Icon Awards",
    chapter: "Chapter I",
    date: "30 January 2026",
    tag: "Award Ceremony",
    src: "/images/projects/NEXTGENICON_CHAPTER_1_SUNIL.jpg",
    alt: "NextGen Icon Awards Chapter I poster — Sunil Shetty",
  },
  {
    title: "NextGen Icon Awards",
    chapter: "Chapter II",
    date: "3 May 2026",
    tag: "Award Ceremony",
    src: "/images/projects/NEXTGENICON_CHAPTER_2_HUMA.jpg",
    alt: "NextGen Icon Awards Chapter II poster — Huma Qureshi",
  },
];

function ProductionCard({ production, index }: { production: Production; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.15 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl border border-transparent transition-colors duration-500 ease-luxe hover:border-[#C9A84C]/60"
    >
      {/* Full poster — card matches the 4:5 source so nothing is cropped away */}
      <Image
        src={production.src}
        alt={production.alt}
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="transform-gpu object-cover transition-transform duration-[600ms] ease-out will-change-transform group-hover:scale-105"
      />

      {/* Bottom ~55% darkens to black so the overlay copy stays legible */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent" />

      {/* Date + tag, top-right */}
      <div className="absolute right-6 top-6 flex flex-col items-end gap-1 text-right">
        <span className="text-[0.65rem] uppercase tracking-[0.28em] text-gold">
          {production.date}
        </span>
        <span className="text-[0.65rem] uppercase tracking-[0.28em] text-gold/80">
          {production.tag}
        </span>
      </div>

      {/* Title, bottom-left */}
      <div className="absolute bottom-6 left-6 right-6">
        <span className="text-xs uppercase tracking-[0.3em] text-gold">
          {production.chapter}
        </span>
        <h3 className="display mt-2 text-[clamp(1.6rem,3.2vw,2.6rem)] font-bold leading-[0.95] text-bone">
          {production.title}
        </h3>
      </div>

      {/* View Event — fades in on hover */}
      <span className="absolute bottom-6 right-6 text-xs uppercase tracking-[0.28em] text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        View Event →
      </span>
    </motion.article>
  );
}

function HostSpotlight() {
  return (
    <div className="mt-16 grid grid-cols-1 items-center gap-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:mt-24 md:grid-cols-2 md:gap-12 md:p-10">
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="group relative aspect-[4/5] overflow-hidden rounded-xl"
      >
        <Image
          src="/images/projects/HOST_SUNIL.jpg"
          alt="JEAP host Mohit Sharma on stage with Sunil Shetty at the NextGen Icon Awards"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="transform-gpu object-cover transition-transform duration-700 ease-luxe will-change-transform group-hover:scale-[1.04]"
        />
        <div className="absolute left-0 top-0 h-full w-1 bg-[#C9A84C]/70 transition-colors duration-500 group-hover:bg-[#C9A84C]" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="kicker mb-5">On Stage — The Host</p>
        <h3 className="display text-[clamp(1.8rem,4vw,3.2rem)] leading-[0.98] text-bone">
          Mohit Sharma, hosting <span className="gilt italic">Sunil Shetty.</span>
        </h3>
        <p className="mt-6 max-w-lg text-ash">
          The founder and host of JEAP, sharing the stage with Bollywood icon Sunil
          Shetty at the NextGen Icon Awards — the kind of room we are trusted to build,
          direct and command.
        </p>
        <div className="mt-7 flex items-center gap-4 text-sm uppercase tracking-[0.2em] text-ash">
          <span>Mohit Sharma</span>
          <span className="h-px w-8 bg-gold/40" />
          <span>NextGen Icon Awards</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function PastProjects() {
  return (
    <section className="relative z-10 bg-[#0A0F2C] px-6 py-[14vh] md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16">
          <p className="kicker mb-5">Our Work</p>
          <h2 className="display text-[clamp(2.2rem,6vw,5rem)] leading-[0.95] text-bone">
            Events We&apos;ve Produced
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {PRODUCTIONS.map((production, i) => (
            <ProductionCard key={production.chapter} production={production} index={i} />
          ))}
        </div>

        <HostSpotlight />
      </div>
    </section>
  );
}
