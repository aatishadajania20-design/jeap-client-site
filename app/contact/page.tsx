"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { SITE } from "@/lib/site";
import RevealText from "@/components/ui/RevealText";
import Magnetic from "@/components/ui/Magnetic";
import ContactForm from "@/components/sections/contact/ContactForm";

const AtmosphereCanvas = dynamic(
  () => import("@/components/webgl/AtmosphereCanvas"),
  { ssr: false }
);

const CHANNELS = [
  { label: "General", value: SITE.email },
  { label: "New business", value: "newbusiness@jeapstudio.com" },
  { label: "Press", value: "press@jeapstudio.com" },
];

export default function ContactPage() {
  return (
    <>
      {/* Cinematic header with subtle moving WebGL field */}
      <section className="relative flex min-h-[80svh] items-end overflow-hidden px-6 pb-16 pt-40 md:px-10">
        <div className="absolute inset-0 opacity-60">
          <AtmosphereCanvas intensity={0.6} />
          <div className="absolute inset-0 bg-gradient-to-b from-noir/60 via-transparent to-noir" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-[1600px]">
          <div className="mb-10 flex items-center gap-5">
            <span className="font-body text-xs tracking-[0.3em] text-gold">04 / Contact</span>
            <span className="h-px w-16 bg-gold/40" />
            <span className="kicker">Begin</span>
          </div>
          <h1 className="display text-bone">
            <span className="line-mask block">
              <motion.span
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="block text-[clamp(2.8rem,12vw,12rem)] leading-[0.86]"
              >
                Let's create
              </motion.span>
            </span>
            <span className="line-mask block">
              <motion.span
                initial={{ y: "115%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.28 }}
                className="block text-[clamp(2.8rem,12vw,12rem)] leading-[0.86]"
              >
                <span className="gilt italic">something rare.</span>
              </motion.span>
            </span>
          </h1>
        </div>
      </section>

      {/* Form + channels */}
      <section className="relative z-10 mx-auto max-w-[1600px] px-6 py-[8vh] md:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-7">
            <RevealText as="p" className="display mb-12 block text-2xl text-bone md:text-3xl" stagger={0.025}>
              Tell us about the world you want to build.
            </RevealText>
            <ContactForm />
          </div>

          <aside className="lg:col-span-5 lg:border-l lg:border-white/10 lg:pl-16">
            <p className="kicker mb-8">Direct lines</p>
            <div className="flex flex-col gap-8">
              {CHANNELS.map((c) => (
                <div key={c.label}>
                  <span className="block text-xs uppercase tracking-[0.2em] text-ash">
                    {c.label}
                  </span>
                  <Magnetic strength={0.2} className="mt-2 inline-block">
                    <a
                      href={`mailto:${c.value}`}
                      data-cursor="email"
                      className="link-underline text-lg text-bone"
                    >
                      {c.value}
                    </a>
                  </Magnetic>
                </div>
              ))}
            </div>

            <div className="hairline my-12" />

            <p className="kicker mb-6">Studios</p>
            <div className="flex flex-col gap-2 text-bone">
              {SITE.location.split(" · ").map((city) => (
                <span key={city} className="display text-2xl">
                  {city}
                </span>
              ))}
            </div>

            <div className="hairline my-12" />

            <p className="kicker mb-6">Follow</p>
            <div className="flex gap-6">
              {["Instagram", "Behance", "Vimeo"].map((s) => (
                <Link
                  key={s}
                  href="#"
                  data-cursor="visit"
                  className="link-underline text-sm uppercase tracking-[0.18em] text-ash hover:text-bone"
                >
                  {s}
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
