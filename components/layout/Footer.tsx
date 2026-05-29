"use client";

import Link from "next/link";
import { SITE, NAV } from "@/lib/site";
import RevealText from "@/components/ui/RevealText";
import Magnetic from "@/components/ui/Magnetic";

export default function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-white/5 px-6 pb-10 pt-24 md:px-10">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-16 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="kicker mb-6">Begin a collaboration</p>
            <RevealText
              as="h2"
              className="display block max-w-3xl text-[clamp(2.5rem,7vw,6rem)] leading-[0.92] text-bone"
            >
              Let us make something unforgettable.
            </RevealText>
            <Magnetic strength={0.3} className="mt-10 inline-block">
              <Link
                href="/contact"
                data-cursor="say hello"
                className="group inline-flex items-center gap-4 text-lg text-bone"
              >
                <span className="link-underline">{SITE.email}</span>
                <span className="text-gold transition-transform duration-500 group-hover:translate-x-2">
                  ↗
                </span>
              </Link>
            </Magnetic>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="link-underline w-fit text-sm uppercase tracking-[0.2em] text-ash transition-colors hover:text-bone"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hairline my-12" />

        <div className="flex flex-col gap-4 text-xs uppercase tracking-[0.2em] text-ash md:flex-row md:items-center md:justify-between">
          <span>
            © {SITE.year} {SITE.name}
          </span>
          <span>{SITE.location}</span>
          <span>Designed in the dark · Built for feeling</span>
        </div>
      </div>
    </footer>
  );
}
