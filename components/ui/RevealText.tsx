"use client";

import { useLayoutEffect, useRef, type ElementType } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** stagger words instead of the whole block */
  stagger?: number;
  start?: string;
};

/**
 * Editorial line/word reveal: each word rides up from behind a clipping mask.
 * The signature "type lifts into frame" motion used across every page header.
 */
export default function RevealText({
  children,
  as = "span",
  className,
  delay = 0,
  stagger = 0.06,
  start = "top 85%",
}: Props) {
  // Polymorphic tag — loosen typing so a ref + arbitrary children type-check
  // (React 19's ElementType infers `never` children when a ref is attached).
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = as as any;
  const ref = useRef<HTMLElement>(null);
  const words = children.split(" ");

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targets = el.querySelectorAll<HTMLElement>(".rt-inner");

    if (reduce) {
      gsap.set(targets, { yPercent: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { yPercent: 118, opacity: 0 });
      gsap.to(targets, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger,
        delay,
        scrollTrigger: { trigger: el, start, once: true },
      });
    }, el);

    return () => ctx.revert();
  }, [children, delay, stagger, start]);

  return (
    <Tag ref={ref} className={cn(className)}>
      {words.map((word, i) => (
        <span key={i} className="line-mask inline-flex">
          <span className="rt-inner inline-block">{word}</span>
          {i < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
}
