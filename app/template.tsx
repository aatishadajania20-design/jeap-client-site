"use client";

import { motion } from "framer-motion";

/**
 * Re-mounts on every navigation (App Router template behaviour) for a cinematic
 * page entrance.
 *
 * IMPORTANT: this fades with OPACITY ONLY — no `transform` and no `filter`.
 * Either of those would establish a containing block for `position: fixed`,
 * which would break ScrollTrigger's pinned sections (e.g. the services
 * horizontal rail). Opacity does not create a containing block, so the pin
 * stays anchored to the viewport.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
