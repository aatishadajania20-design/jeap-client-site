import { Fraunces, Inter, Anton } from "next/font/google";

/**
 * HERO DISPLAY — Anton.
 * A condensed, inherently heavy grotesque used ONLY for the hero title: massive,
 * sculptural, commanding (a free stand-in for Druk's fashion-campaign energy).
 * Single weight (400 = its native black), exposed as `--font-anton`.
 */
export const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-anton",
});

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
