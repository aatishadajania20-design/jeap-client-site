import type { Metadata } from "next";
import { display, inter } from "@/lib/fonts";
import { SITE } from "@/lib/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Cursor from "@/components/ui/Cursor";
import Grain from "@/components/ui/Grain";
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
    <html lang="en" className={`${display.variable} ${inter.variable}`}>
      <body className="font-body antialiased">
        <Preloader />
        <div className="atmosphere" />
        <Grain />
        <Cursor />
        <SmoothScroll>
          <Navbar />
          <main className="relative z-10">{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
