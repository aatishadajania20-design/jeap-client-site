"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * "Celebrity Guests" — a credibility booster. Two tall (2:3) editorial portrait
 * cards, framed like a magazine feature spread: full-bleed portrait, gradient
 * to near-black, name in display type and a gold left-edge accent. Cards slide
 * in from opposite sides on scroll. Flat background — no WebGL / particles.
 */

type Guest = {
  name: string;
  title: string;
  event: string;
  src: string;
  alt: string;
};

const GUESTS: Guest[] = [
  {
    name: "Sunil Shetty",
    title: "Bollywood Icon · Guest of Honour",
    event: "NextGen Icon Awards, Chapter I",
    src: "/images/celebs/sunil-shetty3.jpeg",
    alt: "Sunil Shetty, Bollywood icon and Guest of Honour",
  },
  {
    name: "Huma Qureshi",
    title: "Bollywood Star · Chief Guest",
    event: "NextGen Icon Awards, Chapter II",
    src: "/images/celebs/huma-qureshi.jpg",
    alt: "Huma Qureshi, Bollywood star and Chief Guest",
  },
];

function GuestCard({ guest, index }: { guest: Guest; index: number }) {
  // Left card slides in from the left, right card from the right.
  const fromX = index === 0 ? -60 : 60;

  return (
    <motion.article
      initial={{ opacity: 0, x: fromX }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="group relative aspect-[2/3] overflow-hidden rounded-2xl"
    >
      {/* Full-bleed portrait */}
      <Image
        src={guest.src}
        alt={guest.alt}
        fill
        priority
        sizes="(max-width:768px) 100vw, 50vw"
        className="object-cover object-top transition-transform duration-700 ease-luxe group-hover:scale-[1.04]"
      />

      {/* Top 40% transparent → near-black at the bottom */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

      {/* Gold left-edge accent — brightens on hover */}
      <div className="absolute left-0 top-0 h-full w-1 bg-[#C9A84C]/70 transition-colors duration-500 group-hover:bg-[#C9A84C]" />

      {/* Editorial caption block */}
      <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9">
        <h3 className="display text-[clamp(2rem,4vw,3rem)] font-bold leading-none text-white [text-shadow:0_0_14px_rgba(201,168,76,0.25)] group-hover:[text-shadow:0_0_22px_rgba(201,168,76,0.5)]">
          {guest.name}
        </h3>
        <p className="mt-3 text-[0.65rem] uppercase tracking-[0.28em] text-gold">
          {guest.title}
        </p>
        <p className="mt-1.5 text-[0.65rem] uppercase tracking-[0.28em] text-gold/75">
          {guest.event}
        </p>
      </div>
    </motion.article>
  );
}

export default function CelebGuests() {
  return (
    <section className="relative z-10 bg-[#050505] px-6 py-[14vh] md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="mb-16 max-w-2xl">
          <p className="kicker mb-5">Star Guests</p>
          <h2 className="display text-[clamp(2.2rem,6vw,5rem)] leading-[0.95] text-bone">
            Faces That Graced Our Stage
          </h2>
          <p className="mt-6 text-ash">
            We&apos;ve had the privilege of hosting Bollywood&apos;s finest at our events.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {GUESTS.map((guest, i) => (
            <GuestCard key={guest.name} guest={guest} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
