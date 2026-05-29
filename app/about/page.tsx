import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import RevealVisual from "@/components/ui/RevealVisual";
import Marquee from "@/components/ui/Marquee";
import Timeline from "@/components/sections/about/Timeline";

export const metadata: Metadata = {
  title: "About",
  description:
    "JEAP is a cinematic creative studio directing brand films, immersive digital worlds and spatial experiences across Paris, New York and Tokyo.",
};

const VALUES = [
  {
    n: "01",
    t: "Restraint",
    d: "We remove until only the essential remains. The most powerful frame is the one with nothing left to take away.",
  },
  {
    n: "02",
    t: "Atmosphere",
    d: "Before message, before logo — feeling. We build the air a brand breathes in.",
  },
  {
    n: "03",
    t: "Craft",
    d: "Every transition, every grain of light is deliberate. Nothing here is a default.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="01 / About"
        kicker="The studio"
        titleLines={["A house", "of feeling."]}
        lede="We are a small collective of directors, developers and designers who treat brand work as cinema — slow, considered and built to be felt long after the screen goes dark."
      />

      {/* Editorial intro split */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-[10vh] md:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <RevealText
              as="p"
              className="display block text-[clamp(1.6rem,3.8vw,3rem)] leading-[1.2] text-bone"
              stagger={0.03}
            >
              Founded in Paris, JEAP began as a refusal — a refusal to make work that merely informs.
            </RevealText>
            <Reveal delay={0.1} className="mt-10 max-w-xl">
              <p className="body-lg text-ash">
                Today the studio spans three cities and a single obsession: the
                emotional architecture of a brand. We move fluidly between film,
                code and physical space, but every project begins in the same
                place — a darkened room and a question of how it should feel.
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <RevealVisual tint="#c9a25a" className="aspect-[3/4]" label="JEAP" index="EST. 2018" />
          </div>
        </div>
      </section>

      {/* Drifting statement */}
      <section className="relative z-10 border-y border-white/5 py-10">
        <Marquee text="Slow · Considered · Felt" baseVelocity={-1.8} />
      </section>

      {/* Values */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-[12vh] md:px-10">
        <p className="kicker mb-16">What guides us — 02</p>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 md:grid-cols-3">
          {VALUES.map((v) => (
            <div key={v.n} className="group relative bg-noir-900 p-10 transition-colors duration-700 hover:bg-noir-800 md:p-12">
              <span className="font-body text-xs tracking-[0.3em] text-gold">{v.n}</span>
              <h3 className="display mt-8 text-4xl text-bone md:text-5xl">{v.t}</h3>
              <p className="mt-6 text-ash">{v.d}</p>
              <span className="absolute bottom-0 left-0 h-px w-0 bg-gold transition-all duration-700 ease-luxe group-hover:w-full" />
            </div>
          ))}
        </div>
      </section>

      {/* Animated chronology */}
      <Timeline />

      {/* Closing portrait band */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 pb-[10vh] md:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {["#16243d", "#c9a25a", "#9c7836", "#e7c987"].map((t, i) => (
            <RevealVisual key={i} tint={t} className="aspect-[3/4]" index={`0${i + 1}`} />
          ))}
        </div>
      </section>
    </>
  );
}
