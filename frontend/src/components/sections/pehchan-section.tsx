"use client";

import { AnimatedTestimonials, type ServiceTestimonial } from "@/components/ui/animated-testimonials";

const SERVICES: ServiceTestimonial[] = [
  {
    name: "Air Conditioner (AC) Repair",
    designation: "HVAC & Inverter Systems // Unit 01",
    src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
    quote:
      "Comprehensive diagnostics and repairs for inverter split, multi-split, and commercial air conditioning units. Precision refrigerant leak detection, R410A/R32 gas charging, compressor inverter PCB circuit restoration, and deep chemical wash servicing.",
  },
  {
    name: "Microwave & Electric Oven Repair",
    designation: "Thermal Electronics // Unit 02",
    src: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=2071&auto=format&fit=crop",
    quote:
      "Component-level restoration of baking and microwave ovens. High-voltage magnetron replacement, high-voltage diode and capacitor diagnostics, inverter power supply fixes, digital touch membrane repairs, and heating element calibration.",
  },
  {
    name: "Automatic Washing Machine Repair",
    designation: "Smart Motor & Drum Mechanics // Unit 03",
    src: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?q=80&w=2071&auto=format&fit=crop",
    quote:
      "Full mechanical and electronic overhaul of front-load and top-load automatic washing machines. Brushless direct-drive motor servicing, computerized wash-cycle program card repairs, electronic drain pump fixes, and vibration damper stabilization.",
  },
  {
    name: "PCB Circuit & Board Repair",
    designation: "Micro-Soldering & Diagnostics // Unit 04",
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
      className={`flex w-full flex-col bg-chalk px-6 pb-12 pt-20 text-ink sm:px-12 md:px-20 lg:px-28 ${className}`}
      id="pehchan"
    >
      {/* Editorial header */}
      <header className="w-full max-w-5xl mx-auto mb-8 md:mb-12">
        <div className="flex flex-wrap items-center gap-3 font-display text-technical-code uppercase tracking-widest mb-6">
          <span className="text-primary">[ 02 // Services ]</span>
          <span aria-hidden="true" className="h-px w-10 bg-primary/60" />
          <span className="ml-auto flex items-center gap-2 border border-chalk/15 px-2.5 py-1 text-chalk/60">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none"
            />
            Hardware Overhaul // Active
          </span>
        </div>

        <div className="flex flex-col items-start gap-2">
          <h2 className="font-display text-[38px] sm:text-[52px] lg:text-[60px] font-bold uppercase leading-none tracking-tight text-ink">
            OUR SERVICES
          </h2>
          <p className="font-sans text-body-lg text-chalk/55 max-w-xl">
            Specialized Appliance Engineering & Circuit Board Diagnostics
          </p>
        </div>
      </header>

      {/* Carousel Stage */}
      <div className="flex-1 w-full max-w-5xl mx-auto flex items-center justify-center min-h-0">
        <AnimatedTestimonials testimonials={SERVICES} autoplay={false} />
      </div>

      {/* Footer ledger */}
      <footer className="w-full max-w-5xl mx-auto flex items-center justify-between gap-4 font-display text-technical-code uppercase tracking-wider text-chalk/40 pt-8 border-t border-chalk/10">
        <span>Green Electronics Pakistan</span>
        <span>02 // 03</span>
      </footer>
    </section>
  );
}