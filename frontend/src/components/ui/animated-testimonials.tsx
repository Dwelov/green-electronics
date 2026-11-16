"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export type ServiceTestimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export interface AnimatedTestimonialsProps {
  testimonials: ServiceTestimonial[];
  autoplay?: boolean;
  className?: string;
}

/**
 * Deterministic pseudo-random rotation for inactive cards.
 * Seeded by index to ensure consistent layout across renders.
 */
function randomRotateY(index: number): number {
  const seed = (index * 9301 + 49297) % 233280;
  return (seed / 233280) * 20 - 10; // -10° to +10°
}

export function AnimatedTestimonials({
  testimonials,
  autoplay = false,
  className = "",
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }
    return false;
  });
  const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    autoplayRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current);
    };
  }, [autoplay, testimonials.length]);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrev, goToNext]);

  const splitWords = (text: string) =>
    text.split(" ").map((word, i) => (
      <motion.span
        key={i}
        initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
        animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
        transition={{
          delay: 0.02 * i,
          duration: 0.2,
          ease: "easeOut",
        }}
        style={{ display: "inline-block" }}
      >
        {word}
      </motion.span>
    ));

  return (
    <section
      className={`relative w-full flex flex-col items-center gap-8 md:gap-12 ${className}`}
      aria-label="Services carousel"
    >
      <div className="relative w-full max-w-5xl">
        <AnimatePresence mode="wait">
          {testimonials.map((item, index) => {
            const isActive = index === activeIndex;

            return (
              <motion.div
                key={item.name}
                layout
                initial={prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.9, z: 100 }}
                animate={prefersReducedMotion
                  ? { opacity: isActive ? 1 : 0 }
                  : isActive
                  ? {
                      opacity: 1,
                      scale: 1,
                      z: 0,
                      rotate: 0,
                      zIndex: 30,
                      y: [0, -80, 0],
                    }
                  : {
                      opacity: 0.7,
                      scale: 0.95,
                      z: -100,
                      rotate: randomRotateY(index),
                    }}
                exit={prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, scale: 0.9, z: 100 }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                style={{
                  position: isActive ? "relative" : "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  zIndex: isActive ? 30 : index,
                }}
                className="w-full"
              >
                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                  {/* Image Stack (Left) */}
                  <div className="relative order-2 md:order-1">
                    <div className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-none bg-ink/20">
                      <img
                        src={item.src}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading={isActive ? "eager" : "lazy"}
                      />
                    </div>
                  </div>

                  {/* Description & Controls (Right) */}
                  <div className="flex flex-col items-start md:items-end justify-center gap-6 order-1 md:order-2 text-right md:text-left px-2">
                    <div className="w-full">
                      <p className="font-display text-technical-code uppercase tracking-widest text-chalk/55 text-sm">
                        {item.designation}
                      </p>
                      <h3 className="mt-2 font-display text-[28px] sm:text-[32px] font-bold uppercase leading-[0.95] tracking-tight text-ink">
                        {item.name}
                      </h3>
                      <p className="mt-4 font-sans text-body-md leading-relaxed text-chalk/70 max-w-md">
                        {splitWords(item.quote)}
                      </p>
                    </div>

                    {/* Navigation Controls */}
                    <div className="flex items-center gap-4 pt-4 border-t border-chalk/20 w-full justify-end md:justify-start">
                      <button
                        onClick={goToPrev}
                        className="group flex h-12 w-12 items-center justify-center rounded-full bg-chalk/50 text-ink transition-all duration-200 hover:bg-chalk hover:text-ink hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="Previous service"
                        disabled={prefersReducedMotion && false}
                      >
                        <motion.span
                          animate={{
                            rotate: prefersReducedMotion ? 0 : 0,
                          }}
                          className="group-hover:rotate-12 transition-transform duration-200"
                        >
                          <ChevronLeftIcon className="h-6 w-6" />
                        </motion.span>
                      </button>
                      <button
                        onClick={goToNext}
                        className="group flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white transition-all duration-200 hover:bg-primary-deep hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        aria-label="Next service"
                      >
                        <motion.span
                          animate={{
                            rotate: prefersReducedMotion ? 0 : 0,
                          }}
                          className="group-hover:-rotate-12 transition-transform duration-200"
                        >
                          <ChevronRightIcon className="h-6 w-6" />
                        </motion.span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}