"use client";

import { useEffect, useState, useCallback } from "react";
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

/** Deterministic seeded rotation so inactive stack cards are always consistent. */
function seedRotate(index: number): number {
  return ((index * 7919 + 1) % 21) - 10; // –10° to +10°
}

export function AnimatedTestimonials({
  testimonials,
  autoplay = false,
  className = "",
}: AnimatedTestimonialsProps) {
  const [active, setActive] = useState(0);

  const handleNext = useCallback(() => {
    setActive((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const handlePrev = useCallback(() => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlePrev, handleNext]);

  // Autoplay
  useEffect(() => {
    if (!autoplay) return;
    const id = setInterval(handleNext, 5000);
    return () => clearInterval(id);
  }, [autoplay, handleNext]);

  const isActive = (index: number) => index === active;

  return (
    <div
      className={`mx-auto w-full max-w-sm px-4 py-20 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12 ${className}`}
    >
      <div className="relative grid grid-cols-1 gap-20 md:grid-cols-2">
        {/* ── Left: Stacked image cards ── */}
        <div>
          <div className="relative h-80 w-full">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.src}
                initial={{
                  opacity: 0,
                  scale: 0.9,
                  z: -100,
                  rotate: seedRotate(index),
                }}
                animate={{
                  opacity: isActive(index) ? 1 : 0.7,
                  scale: isActive(index) ? 1 : 0.95,
                  z: isActive(index) ? 0 : -100,
                  rotate: isActive(index) ? 0 : seedRotate(index),
                  zIndex: isActive(index)
                    ? testimonials.length + 1
                    : testimonials.length - index,
                  y: isActive(index) ? [0, -80, 0] : 0,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  z: 100,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 origin-bottom"
              >
                <img
                  src={item.src}
                  alt={item.name}
                  width={500}
                  height={500}
                  draggable={false}
                  className="h-full w-full rounded-3xl object-cover object-center"
                />
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── Right: Text content ── */}
        <div className="flex flex-col justify-between py-4">
          <motion.div
            key={active}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <h3 className="text-2xl font-bold text-ink">
              {testimonials[active].name}
            </h3>
            <p className="text-sm text-ink/50">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-8 text-lg text-ink/70">
              {testimonials[active].quote.split(" ").map((word, i) => (
                <motion.span
                  key={`${active}-${i}`}
                  initial={{ filter: "blur(10px)", opacity: 0, y: 5 }}
                  animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.02 * i,
                  }}
                  className="inline-block text-ink/80"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
            </motion.p>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex gap-4 pt-12 md:pt-0">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 hover:bg-ink/20 transition-colors"
              aria-label="Previous service"
            >
              <ChevronLeftIcon className="h-5 w-5 text-ink transition-transform duration-300 group-hover/button:rotate-12" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-ink/10 hover:bg-ink/20 transition-colors"
              aria-label="Next service"
            >
              <ChevronRightIcon className="h-5 w-5 text-ink transition-transform duration-300 group-hover/button:-rotate-12" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
