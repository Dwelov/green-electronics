import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { ArrowForwardIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Rabta",
  description:
    "Humse rabta karein — WhatsApp, phone, email ya Al-Karam Electronics Market, Saddar, Karachi. Response time under 15 minutes.",
};

const WHATSAPP_URL = "https://wa.me/923001234567";

const FOOTPRINT = [
  {
    label: "Marka",
    value: "Green Electronics",
    detail: "EST. 1994 // KARACHI",
  },
  {
    label: "Market",
    value: "Al-Karam Electronics",
    detail: "SADDAR TECHNICAL ZONE",
  },
  {
    label: "Maal Ki Noeyat",
    value: "Asal & Certified",
    detail: "PAIYDAR FUNN GUARANTEED",
  },
  {
    label: "Surge Rating",
    value: "Heavy Industrial",
    detail: "GRADE-A QUALITY",
  },
];

const LEDGER_TRIGGER_CLASS =
  "flex items-center gap-2 font-display text-label-sm uppercase tracking-widest text-chalk/50";

function LedgerDot() {
  return <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />;
}

export default function RabtaPage() {
  return (
    <div className="flex w-full flex-1 flex-col bg-ink text-chalk">
      {/* Technical ticker */}
      <div className="w-full border-b border-chalk/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-3 font-display text-technical-code uppercase tracking-widest text-chalk/60 md:px-12">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="inline-block h-2 w-2 bg-primary" />
            <span className="whitespace-nowrap text-chalk">
              SYS // PROTOCOL 03: DIRECT DISPATCH
            </span>
            <span aria-hidden="true" className="hidden text-chalk/30 sm:inline">
              /
            </span>
            <span className="hidden sm:inline">KARACHI CENTRAL UNIT</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-primary">Chalu // Standby 240V</span>
            <span aria-hidden="true" className="hidden text-chalk/30 md:inline">
              |
            </span>
            <span className="hidden font-mono md:inline">24.8607° N, 67.0011° E</span>
          </div>
        </div>
      </div>

      {/* Headline banner */}
      <section className="w-full border-b border-chalk/10 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div className="max-w-4xl">
              <div className="mb-4 flex items-center gap-2">
                <span className="font-display text-technical-code uppercase tracking-wider text-primary">
                  [ 03 // Rabta ]
                </span>
                <span aria-hidden="true" className="h-px w-12 bg-primary" />
                <span className="font-display text-technical-code uppercase tracking-widest text-chalk/50">
                  Asal Khara Maal
                </span>
              </div>
              <h1 className="font-display text-display uppercase leading-none tracking-tight text-chalk">
                Humse rabta
                <br className="hidden sm:inline" /> karein
              </h1>
            </div>
            <div className="pb-2 font-display text-technical-code text-chalk/60 md:text-right">
              <p className="uppercase">Barah-e-Raast Rabta Line</p>
              <p className="mt-1 font-bold text-primary">Response Time &lt; 15 MIN</p>
            </div>
          </div>
        </div>
      </section>

      {/* Asymmetric operational grid */}
      <section className="w-full">
        <div className="mx-auto max-w-7xl px-5 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Dossier & direct comms */}
            <div className="flex flex-col justify-between border-chalk/10 py-12 lg:col-span-7 lg:border-r lg:py-16 lg:pr-16">
              <div>
                <div className="mb-10 flex items-center justify-between border-b border-chalk/10 pb-4">
                  <span className="font-display text-technical-code uppercase tracking-widest text-chalk/60">
                    Deftar-e-Maloomat // Details
                  </span>
                  <span className="font-display text-technical-code font-bold text-primary">
                    [ SEC_A ]
                  </span>
                </div>

                <p className="mb-12 max-w-xl font-sans text-body-lg text-chalk/80">
                  Hamari engineering team aur wholesale inventory desk aapki madad ke
                  liye hamesha tayyar hai. Kisi bhi technical inquiry ya order
                  confirmation ke liye foran rabta farmayein.
                </p>

                <dl className="divide-y divide-chalk/10 border-y border-chalk/10">
                  <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-baseline">
                    <dt className={LEDGER_TRIGGER_CLASS}>
                      <LedgerDot />
                      01 // WhatsApp Official
                    </dt>
                    <dd>
                      <a
                        className="font-display text-headline-sm tracking-tight text-chalk transition-colors hover:text-primary"
                        href={WHATSAPP_URL}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        +92 300 1234567
                      </a>
                    </dd>
                  </div>

                  <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-baseline">
                    <dt className={LEDGER_TRIGGER_CLASS}>
                      <LedgerDot />
                      02 // Phone Desk
                    </dt>
                    <dd>
                      <a
                        className="font-display text-headline-sm tracking-tight text-chalk transition-colors hover:text-primary"
                        href="tel:02134567890"
                      >
                        (021) 3456-7890
                      </a>
                    </dd>
                  </div>

                  <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-baseline">
                    <dt className={LEDGER_TRIGGER_CLASS}>
                      <LedgerDot />
                      03 // Email Terminal
                    </dt>
                    <dd>
                      <a
                        className="font-display text-headline-sm tracking-tight text-chalk transition-colors hover:text-primary"
                        href="mailto:rabta@greenelectronics.pk"
                      >
                        rabta@greenelectronics.pk
                      </a>
                    </dd>
                  </div>

                  <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-start">
                    <dt className={`${LEDGER_TRIGGER_CLASS} pt-1`}>
                      <LedgerDot />
                      04 // Dukan Ka Pata
                    </dt>
                    <dd className="max-w-sm font-sans text-body-lg font-medium text-chalk sm:text-right">
                      Shop #14, Al-Karam Electronics Market, Saddar, Karachi
                    </dd>
                  </div>

                  <div className="flex flex-col justify-between gap-2 py-5 sm:flex-row sm:items-start">
                    <dt className={`${LEDGER_TRIGGER_CLASS} pt-1`}>
                      <LedgerDot />
                      05 // Auqaat-e-Kaar
                    </dt>
                    <dd className="sm:text-right">
                      <p className="font-display text-headline-sm text-chalk">
                        11:00 AM — 9:00 PM
                      </p>
                      <p className="mt-1 font-display text-technical-code uppercase text-chalk/60">
                        Somwar ta Hafta{" "}
                        <span className="font-bold text-primary">(Itwar band)</span>
                      </p>
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="pt-10">
                <a
                  className="group flex w-full items-center justify-between rounded-none bg-primary px-6 py-5 text-chalk transition-colors duration-150 hover:bg-primary-deep"
                  href={WHATSAPP_URL}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span className="font-display text-label-md font-bold uppercase tracking-wider">
                    WhatsApp par baat karein
                  </span>
                  <ArrowForwardIcon className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-1" />
                </a>
                <p className="mt-3 font-display text-technical-code uppercase tracking-widest text-chalk/40">
                  Direct connection with our technical floor master
                </p>
              </div>
            </div>

            {/* Schematic form */}
            <div className="py-12 lg:col-span-5 lg:py-16 lg:pl-16">
              <div className="relative border border-chalk/10 p-8 lg:p-10">
                {/* Terminal corners */}
                <span
                  aria-hidden="true"
                  className="absolute -left-1.5 -top-1.5 h-3 w-3 border border-primary bg-ink"
                />
                <span
                  aria-hidden="true"
                  className="absolute -right-1.5 -top-1.5 h-3 w-3 border border-primary bg-ink"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 -left-1.5 h-3 w-3 border border-primary bg-ink"
                />
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1.5 -right-1.5 h-3 w-3 border border-primary bg-ink"
                />

                <div className="mb-8 flex items-center justify-between border-b border-chalk/10 pb-4">
                  <span className="font-display text-technical-code uppercase tracking-widest text-chalk/60">
                    Dar-Khwaast // Transmit
                  </span>
                  <span className="font-display text-technical-code font-bold text-primary">
                    [ SEC_B ]
                  </span>
                </div>

                <ContactForm />

                <div className="mt-8 flex items-center justify-between border-t border-chalk/10 pt-6 font-display text-technical-code uppercase text-chalk/40">
                  <span>Security // TLS 1.3</span>
                  <span>Direct Dispatch</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical spec footprint */}
      <section className="w-full border-t border-chalk/10">
        <div className="mx-auto max-w-7xl px-5 py-12 md:px-12">
          <ul className="grid grid-cols-2 gap-6 font-display text-technical-code text-chalk/50 md:grid-cols-4">
            {FOOTPRINT.map((item) => (
              <li key={item.label}>
                <span className="block font-bold text-primary">{item.label}</span>
                <span className="block font-bold uppercase text-chalk">{item.value}</span>
                <span className="mt-0.5 block text-[10px]">{item.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
