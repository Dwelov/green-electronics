"use client";

import { AnimatedTestimonials, type ServiceTestimonial } from "@/components/ui/animated-testimonials";

const SERVICES: ServiceTestimonial[] = [
  {
    name: "Air Conditioner (AC) Repair",
    designation: "HVAC & Inverter Systems",
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
    quote:
      "Comprehensive diagnostics and repairs for inverter split, multi-split, and commercial air conditioning units. Precision refrigerant leak detection, R410A/R32 gas charging, compressor inverter PCB circuit restoration, and deep chemical wash servicing.",
  },
  {
    name: "Microwave & Electric Oven Repair",
    designation: "Thermal Electronics",
    src: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=2071&auto=format&fit=crop",
    quote:
      "Component-level restoration of baking and microwave ovens. High-voltage magnetron replacement, high-voltage diode and capacitor diagnostics, inverter power supply fixes, digital touch membrane repairs, and heating element calibration.",
  },
  {
    name: "Automatic Washing Machine Repair",
    designation: "Smart Motor & Drum Mechanics",
    src: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=2071&auto=format&fit=crop",
    quote:
      "Full mechanical and electronic overhaul of front-load and top-load automatic washing machines. Brushless direct-drive motor servicing, computerized wash-cycle program card repairs, electronic drain pump fixes, and vibration damper stabilization.",
  },
  {
    name: "PCB Circuit & Board Repair",
    designation: "Micro-Soldering & Diagnostics",
    src: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1974&auto=format&fit=crop",
    quote:
      "Advanced SMD rework, micro-soldering, and oscilloscope troubleshooting for burnt or faulty appliance control boards. Microcontroller diagnostics, EEPROM firmware re-flashing, burnt copper trace reconstruction, and short-circuit isolation down to individual MOSFETs.",
  },
];

type PehchanSectionProps = {
  className?: string;
};

/** Section 02 — Services Carousel showcasing four core hardware repair domains. */
export function PehchanSection({ className = "" }: PehchanSectionProps) {
  return (
    <section
      aria-label="Green Electronics — Services"
      className={`flex h-full w-full flex-col items-center justify-center bg-chalk text-ink ${className}`}
      id="pehchan"
    >
      {/* Centered content wrapper */}
      <div className="flex w-full max-w-5xl flex-col items-center px-6 sm:px-10 md:px-16">
        {/* Section badge */}
        <div className="mb-4 flex items-center gap-3 self-start font-display text-technical-code uppercase tracking-widest">
          <span className="text-primary"></span>
        </div>

        {/* Heading — left-aligned like the reference */}
        <h2 className="mb-2 self-start font-display text-[36px] font-bold uppercase leading-none tracking-tight text-ink sm:text-[48px] lg:text-[56px]">
          OUR SERVICES
        </h2>
        <p className="mb-0 self-start font-sans text-sm text-ink/40 uppercase tracking-wider">
          Appliance Engineering &amp; Circuit Board Diagnostics
        </p>

        {/* Carousel — centered, constrained width */}
        <AnimatedTestimonials testimonials={SERVICES} autoplay={false} />
      </div>
    </section>
  );
}