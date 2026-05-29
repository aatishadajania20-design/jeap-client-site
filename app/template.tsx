"use client";

import { motion } from "framer-motion";

/**
 * Re-mounts on every navigation (App Router template behaviour), giving each
 * page a cinematic entrance: a soft rise + blur clear, as if the next scene
 * is being brought into focus.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
