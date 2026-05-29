"use client";

import { cn } from "@/lib/utils";

/**
 * Procedural cinematic "plate". With no photography in this build, each visual
 * is an art-directed field of layered light — duotone gradients, a soft key
 * light and a faint frame — so compositions still read as luxury imagery.
 * Drop real <Image> sources in here later without touching layouts.
 */
export default function Visual({
  tint = "#c9a25a",
  label,
  index,
  className,
}: {
  tint?: string;
  label?: string;
  index?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative h-full w-full overflow-hidden bg-noir-800",
        className
      )}
    >
      {/* base navy field */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(120% 90% at 30% 10%, ${tint}26, transparent 55%),
            radial-gradient(90% 90% at 85% 100%, #16243d80, transparent 60%),
            linear-gradient(160deg, #0a0a0c, #070707)`,
        }}
      />
      {/* soft key light sweep */}
      <div
        className="absolute -inset-1/3 opacity-50 blur-3xl"
        style={{
          background: `radial-gradient(40% 40% at 50% 40%, ${tint}40, transparent 70%)`,
        }}
      />
      {/* fine frame */}
      <div className="absolute inset-3 border border-white/[0.06]" />
      {/* duotone grain */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      {(label || index) && (
        <div className="absolute inset-0 flex items-end justify-between p-6">
          {label && (
            <span className="display text-3xl text-bone/90 md:text-5xl">{label}</span>
          )}
          {index && (
            <span className="font-body text-xs tracking-[0.3em] text-gold">{index}</span>
          )}
        </div>
      )}
    </div>
  );
}
