"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Bespoke cursor: a soft gold dot with a trailing ring that scales and labels
 * itself on interactive elements ([data-cursor] attributes). Replaces the OS
 * cursor for the immersive feel; falls back to native on touch.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState("");
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 220, damping: 28, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 220, damping: 28, mass: 0.6 });
  const dotX = useSpring(x, { stiffness: 900, damping: 40 });
  const dotY = useSpring(y, { stiffness: 900, damping: 40 });

  const raf = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf.current);
      raf.current = requestAnimationFrame(() => {
        x.set(e.clientX);
        y.set(e.clientY);
        const el = (e.target as HTMLElement)?.closest?.("[data-cursor]") as HTMLElement | null;
        if (el) {
          setHovering(true);
          setLabel(el.dataset.cursor || "");
        } else {
          setHovering(false);
          setLabel("");
        }
      });
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block">
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute left-0 top-0 -ml-5 -mt-5"
      >
        <motion.div
          animate={{
            width: hovering ? 92 : 40,
            height: hovering ? 92 : 40,
            marginLeft: hovering ? -26 : 0,
            marginTop: hovering ? -26 : 0,
            borderColor: hovering ? "rgba(201,162,90,0.9)" : "rgba(236,231,221,0.35)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="flex items-center justify-center rounded-full border backdrop-blur-[1px]"
        >
          {label && (
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px]"
      >
        <motion.div
          animate={{ opacity: hovering ? 0 : 1 }}
          className="h-1.5 w-1.5 rounded-full bg-gold"
        />
      </motion.div>
    </div>
  );
}
