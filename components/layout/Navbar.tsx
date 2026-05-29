"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV, SITE } from "@/lib/site";
import Magnetic from "@/components/ui/Magnetic";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed left-0 top-0 z-50 w-full border-b transition-all duration-700 ease-luxe",
          scrolled
            ? "border-[rgba(201,168,76,0.15)] bg-black/70 py-4 backdrop-blur-xl"
            : "border-transparent bg-black/0 py-7 backdrop-blur-0"
        )}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-6 md:px-10">
          <Magnetic strength={0.4}>
            <Link
              href="/"
              data-cursor="home"
              className="display text-xl tracking-tight text-bone"
            >
              {SITE.name.split(" ")[0]}
              <span className="gilt"> ·</span>
            </Link>
          </Magnetic>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 md:flex">
            {NAV.slice(1).map((item) => {
              const active = pathname === item.href;
              return (
                <Magnetic key={item.href} strength={0.25}>
                  <Link
                    href={item.href}
                    className={cn(
                      "link-underline text-[0.78rem] uppercase tracking-[0.22em] transition-colors duration-500",
                      active ? "text-gold" : "text-ash hover:text-bone"
                    )}
                  >
                    {item.label}
                  </Link>
                </Magnetic>
              );
            })}
          </nav>

          {/* Mobile trigger */}
          <button
            onClick={() => setOpen((v) => !v)}
            data-cursor={open ? "close" : "menu"}
            className="flex flex-col gap-[6px] md:hidden"
            aria-label="Menu"
          >
            <span
              className={cn(
                "h-px w-7 bg-bone transition-all duration-500",
                open && "translate-y-[7px] rotate-45"
              )}
            />
            <span
              className={cn(
                "h-px w-7 bg-bone transition-all duration-500",
                open && "-translate-y-[7px] -rotate-45"
              )}
            />
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-noir px-8 md:hidden"
          >
            <div className="atmosphere" />
            {NAV.map((item, i) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={item.href}
                  className="display block py-1 text-6xl text-bone"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
