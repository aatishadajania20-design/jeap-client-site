import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import RevealText from "@/components/ui/RevealText";
import Reveal from "@/components/ui/Reveal";
import HorizontalRail from "@/components/sections/services/HorizontalRail";
import { SERVICES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Art direction, motion and film, immersive digital experience, and spatial work — the four disciplines of JEAP.",
};

const PROCESS = [
  { n: "01", t: "Immersion", d: "We live with the brand until we understand the feeling it wants to own." },
  { n: "02", t: "Direction", d: "A single creative intention is set — the north star every frame answers to." },
  { n: "03", t: "Production", d: "Film, code and material are crafted in parallel, never in isolation." },
  { n: "04", t: "Release", d: "We choreograph the moment of arrival — the world meets the work as one scene." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        index="02 / Services"
        kicker="Capabilities"
        titleLines={["What we", "compose."]}
        lede="Four disciplines, practised as one. We move between the screen, the lens and the room to build complete sensory worlds."
      />

      <HorizontalRail />

      {/* Detailed capability ledger */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-[12vh] md:px-10">
        <p className="kicker mb-16">The full ledger — 03</p>
        <div className="flex flex-col">
          {SERVICES.map((s) => (
            <div
              key={s.id}
              className="grid grid-cols-1 gap-6 border-t border-white/10 py-10 md:grid-cols-12 md:gap-10 md:py-14"
            >
              <div className="md:col-span-4">
                <RevealText
                  as="h3"
                  className="display block text-3xl text-bone md:text-5xl"
                >
                  {s.title}
                </RevealText>
              </div>
              <div className="md:col-span-5">
                <p className="body-lg text-ash">{s.summary}</p>
              </div>
              <ul className="md:col-span-3">
                {s.capabilities.map((c) => (
                  <li
                    key={c}
                    className="border-b border-white/5 py-2 text-sm uppercase tracking-[0.15em] text-ash"
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 pb-[14vh] md:px-10">
        <p className="kicker mb-16">How it unfolds — 04</p>
        <div className="grid grid-cols-1 gap-px overflow-hidden border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS.map((p) => (
            <Reveal key={p.n}>
              <div className="h-full bg-noir-900 p-8 md:p-10">
                <span className="font-body text-xs tracking-[0.3em] text-gold">{p.n}</span>
                <h4 className="display mt-10 text-3xl text-bone">{p.t}</h4>
                <p className="mt-4 text-sm text-ash">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
