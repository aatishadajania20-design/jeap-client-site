import type { Metadata } from "next";
import { display, inter, anton } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import Preloader from "@/components/layout/Preloader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s — ${SITE.name}`,
  },
  description:
    "JEAP is a cinematic creative studio crafting brand films, immersive digital experiences and spatial work for luxury houses.",
  metadataBase: new URL("https://jeapstudio.com"),
  openGraph: {
    title: `${SITE.name} — ${SITE.tagline}`,
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${inter.variable} ${anton.variable}`}>
      <body className="font-body antialiased">
        <Preloader />
        {/* NOTE: Both the page-wide `.atmosphere` gradient AND the global film
            `<Grain />` overlay were removed from here. As fixed full-viewport
            layers they bled a moving haze/shimmer across every section below the
            hero. All ambience now lives ONLY inside the hero's own WebGL canvas;
            every other section renders on a clean, fully opaque background. */}
        <Cursor />
        <SmoothScroll />
        <ScrollProgress />
        <Navbar />
        <main className="relative z-10 bg-noir">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
