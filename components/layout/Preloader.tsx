"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SITE } from "@/lib/site";

/**
 * First-visit overture. A counter climbs while the studio name resolves, then
 * the curtain splits to reveal the site. Shown once per session.
 */
export default function Preloader() {
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (sessionStorage.getItem("an_intro")) {
      setDone(true);
      return;
    }
    document.body.style.overflow = "hidden";
    const start = performance.now();
    const dur = 2200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        sessionStorage.setItem("an_intro", "1");
        setTimeout(() => {
          document.body.style.overflow = "";
          setDone(true);
        }, 500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="atmosphere" />
          <div className="relative flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="kicker mb-6"
            >
              {SITE.tagline}
            </motion.span>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="display text-center text-[clamp(2.5rem,9vw,7rem)] leading-none text-bone"
            >
              {SITE.name}
            </motion.h1>
          </div>
          <span className="absolute bottom-8 right-8 font-body text-sm tabular-nums tracking-[0.3em] text-gold">
            {String(count).padStart(3, "0")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
