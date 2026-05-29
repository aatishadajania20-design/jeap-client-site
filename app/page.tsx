import Hero from "@/components/sections/home/Hero";
import Manifesto from "@/components/sections/home/Manifesto";
import ServicesPreview from "@/components/sections/home/ServicesPreview";
import WorkPreview from "@/components/sections/home/WorkPreview";
import Marquee from "@/components/ui/Marquee";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Manifesto />

      {/* Animated editorial typography scene */}
      <section className="relative z-10 border-y border-white/5 py-12">
        <Marquee text="Art Direction" baseVelocity={-2.4} />
        <Marquee text="Motion · Film · Light" baseVelocity={2} className="mt-2 opacity-60" />
      </section>

      <ServicesPreview />
      <WorkPreview />
    </>
  );
}
