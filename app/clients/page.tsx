import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";

export const metadata: Metadata = {
  title: "Clients",
  description:
    "A selection of the houses, brands and institutions JEAP has partnered with.",
};

const clients = [
  { name: "Apno Ka Bima", industry: "Insurance" },
  { name: "Jaipur Homes", industry: "Real Estate" },
  { name: "Bodytec", industry: "Health & Fitness" },
  { name: "Kezza", industry: "Lifestyle" },
  { name: "ICC Design", industry: "Interior Design" },
  { name: "ISI", industry: "Corporate" },
  { name: "SRK Hospital", industry: "Healthcare" },
  { name: "Jaipur Green Developers", industry: "Real Estate" },
];

export default function ClientsPage() {
  return (
    <>
      <PageHero
        index="05 / Clients"
        kicker="Selected partners"
        titleLines={["Trusted by", "the discerning."]}
        lede="A selection of the brands, houses and institutions we have been privileged to work alongside."
      />

      <section className="relative z-10 bg-noir px-6 pb-[14vh] md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {clients.map((client) => (
              <article
                key={client.name}
                className="group relative flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-gold/20 bg-white/[0.03] p-8 text-center backdrop-blur-sm transition-all duration-500 ease-luxe hover:-translate-y-1 hover:border-gold/50 hover:bg-white/[0.05]"
              >
                {/* Gold monogram — the visual anchor */}
                <span className="display text-6xl leading-none text-gold/85 transition-colors duration-500 group-hover:text-gold md:text-7xl">
                  {client.name.charAt(0)}
                </span>

                <h2 className="mt-5 text-lg font-medium tracking-tight text-bone md:text-xl">
                  {client.name}
                </h2>

                <span className="mt-3 text-[0.6rem] uppercase tracking-[0.28em] text-gold">
                  {client.industry}
                </span>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-16 max-w-2xl text-center text-sm italic text-white/50">
            Our events have been graced by celebrated personalities including{" "}
            <span className="text-gold">Sunil Shetty</span> and{" "}
            <span className="text-gold">Huma Qureshi</span>
          </p>
        </div>
      </section>
    </>
  );
}
