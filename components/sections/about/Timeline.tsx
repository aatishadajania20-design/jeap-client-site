"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal from "@/components/ui/Reveal";

const CHAPTERS = [
  {
    year: "2018",
    title: "The first frame",
    body: "JEAP opens between a darkroom and an editing suite in Paris — founded on a single conviction: that brands deserve cinema, not content.",
  },
  {
    year: "2020",
    title: "Into the screen",
    body: "We move beyond film into immersive digital — our first WebGL world earns the studio its name in interactive circles.",
  },
  {
    year: "2022",
    title: "Light made physical",
    body: "Spatial commissions take the studio off the screen and into rooms — installations of brass, projection and engineered shadow.",
  },
  {
    year: "2025",
    title: "A house of feeling",
    body: "Three cities, one sensibility. We now direct full sensory identities for the world's most considered houses.",
  },
];

export default function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.5", "end 0.6"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative z-10 mx-auto max-w-[1200px] px-6 py-[12vh] md:px-10">
      <p className="kicker mb-16">The chronology</p>
      <div className="relative pl-8 md:pl-0">
        {/* progress spine */}
        <div className="absolute left-0 top-0 h-full w-px bg-white/10 md:left-1/2">
          <motion.div
            style={{ scaleY: lineScale }}
            className="h-full w-full origin-top bg-gradient-to-b from-gold via-gold to-transparent"
          />
        </div>

        <div className="flex flex-col gap-[14vh]">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.year}
              className={`relative md:grid md:grid-cols-2 md:gap-16 ${
                i % 2 ? "" : "md:[&>*:first-child]:order-2"
              }`}
            >
              <Reveal className={i % 2 ? "md:text-right" : ""}>
                <span className="display block text-[clamp(3rem,9vw,7rem)] leading-none text-gold/90">
                  {c.year}
                </span>
              </Reveal>
              <Reveal delay={0.1} className="mt-4 md:mt-6">
                <h3 className="display mb-4 text-3xl text-bone md:text-4xl">{c.title}</h3>
                <p className="body-lg max-w-md text-ash">{c.body}</p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
