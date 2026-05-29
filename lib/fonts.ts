import { Fraunces, Inter } from "next/font/google";

/**
 * DISPLAY / EDITORIAL FACE.
 *
 * High-contrast optical serif (Fraunces) carrying the couture-editorial weight,
 * wired to the `--font-display` variable. To swap in a licensed display face
 * later, replace this block with `next/font/local` and keep
 * `variable: "--font-display"` — nothing else in the codebase needs to change.
 */
export const display = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  style: ["normal", "italic"],
  axes: ["opsz", "SOFT", "WONK"],
});

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500"],
});
