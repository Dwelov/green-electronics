import type { Ref } from "react";
import {
  ArrowForwardIcon,
  DirectionsIcon,
  MapPinIcon,
  PhoneIcon,
  WhatsAppIcon,
} from "@/components/icons";

const COORDINATES = `32°19'39.8"N 74°20'59.7"E`;
const PHONE_DISPLAY = "0300 0841013";
const PHONE_HREF = "tel:03000841013";
const WHATSAPP_URL = "https://wa.me/923000841013";
const MAP_URL =
  "https://www.google.com/maps/dir/?api=1&destination=32.327722,74.349917";

type RabtaSectionProps = {
  className?: string;
  scrollRef?: Ref<HTMLDivElement>;
};

/** City blocks surrounding the Model Town storefront. */
const MAP_BLOCKS = [
  [34, 30, 132, 74],
  [34, 122, 76, 92],
  [128, 122, 114, 60],
  [260, 34, 118, 70],
  [260, 122, 74, 92],
  [352, 122, 100, 48],
  [470, 30, 128, 74],
  [470, 122, 84, 92],
  [572, 122, 116, 56],
  [706, 30, 96, 74],
  [820, 30, 146, 98],
  [706, 122, 96, 70],
  [34, 240, 132, 76],
  [34, 334, 90, 100],
  [142, 334, 126, 62],
  [260, 240, 118, 70],
  [260, 334, 118, 100],
  [396, 240, 100, 76],
  [396, 334, 88, 62],
  [514, 240, 128, 76],
  [514, 334, 128, 100],
  [676, 240, 106, 76],
  [676, 334, 106, 100],
  [812, 240, 154, 76],
  [812, 334, 154, 100],
  [34, 452, 200, 82],
  [260, 452, 118, 82],
  [396, 452, 300, 82],
  [724, 452, 242, 82],
] as const;

const MAP_LABELS = [
  { x: 58, y: 300, label: "MODEL TOWN" },
  { x: 470, y: 300, label: "CIVIL LINES" },
  { x: 840, y: 300, label: "DASKA" },
  { x: 690, y: 430, label: "GHALLA MANDI" },
] as const;

/** Stylised night-map of the Model Town, Daska storefront. */
function StoreMap() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1000 560"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="rabta-map-base" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#0b1424" />
          <stop offset="1" stopColor="#070e1a" />
        </linearGradient>
        <radialGradient id="rabta-map-glow" cx="60%" cy="46%" r="52%">
          <stop offset="0" stopColor="#059669" stopOpacity="0.18" />
          <stop offset="1" stopColor="#059669" stopOpacity="0" />
        </radialGradient>
        <pattern
          height="50"
          id="rabta-map-grid"
          patternUnits="userSpaceOnUse"
          width="50"
        >
          <path
            d="M50 0H0V50"
            fill="none"
            stroke="#94a3b8"
            strokeOpacity="0.06"
            strokeWidth="1"
          />
        </pattern>
        <filter height="200%" id="rabta-pin-shadow" width="200%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect fill="url(#rabta-map-base)" height="560" width="1000" />
      <rect fill="url(#rabta-map-grid)" height="560" width="1000" />

      {/* Topographic contours */}
      <g fill="none" stroke="#10b981" strokeOpacity="0.1">
        <path d="M-40 470c180-70 150-210 300-260s280 20 430-50 240-60 350-30" />
        <path d="M-40 520c190-70 160-210 310-260s280 20 430-50 240-60 350-30" />
        <path d="M-40 570c200-70 170-210 320-260s280 20 430-50 240-60 350-30" />
      </g>

      {/* Canal */}
      <path
        d="M-10 120c92 54 62 170 150 214s44 132 150 168"
        fill="none"
        stroke="#0c3243"
        strokeWidth="14"
      />
      <path
        d="M-10 120c92 54 62 170 150 214s44 132 150 168"
        fill="none"
        stroke="#0f4356"
        strokeOpacity="0.7"
        strokeWidth="5"
      />

      {/* City blocks */}
      <g fill="#0e1a2b" stroke="#16253a" strokeWidth="1">
        {MAP_BLOCKS.map(([x, y, width, height]) => (
          <rect height={height} key={`${x}-${y}`} width={width} x={x} y={y} />
        ))}
      </g>

      {/* Park */}
      <g>
        <rect
          fill="#072a20"
          height="92"
          stroke="#059669"
          strokeOpacity="0.25"
          width="98"
          x="680"
          y="338"
        />
        {[
          [700, 362],
          [726, 380],
          [748, 356],
          [712, 404],
          [744, 410],
          [764, 386],
        ].map(([cx, cy]) => (
          <circle
            cx={cx}
            cy={cy}
            fill="#059669"
            fillOpacity="0.35"
            key={`${cx}-${cy}`}
            r="3"
          />
        ))}
      </g>

      {/* Road network */}
      <g fill="none" strokeLinecap="square">
        <g stroke="#1b2940" strokeWidth="3">
          <path d="M90 0v560M246 0v560M452 0v560M662 0v560M798 0v560" />
          <path d="M0 112h1000M0 226h1000M0 322h1000M0 440h1000" />
        </g>
        <g stroke="#24344d">
          <path d="M246 0v560" strokeWidth="6" />
          <path d="M452 0v560" strokeWidth="8" />
          <path d="M798 0v560" strokeWidth="7" />
          <path d="M0 226h1000" strokeWidth="8" />
          <path d="M0 440h1000" strokeWidth="7" />
          <path d="M0 112h1000" strokeWidth="5" />
        </g>

        {/* Ring road */}
        <path
          d="M900 560V430q0-96 96-124"
          stroke="#2d425c"
          strokeWidth="11"
        />
        <path
          d="M900 560V430q0-96 96-124"
          stroke="#0b1424"
          strokeOpacity="0.6"
          strokeWidth="2"
        />

        {/* Gujranwala — Sialkot arterial */}
        <path d="M-20 500 1020 80" stroke="#2a4057" strokeWidth="26" />
        <path d="M-20 500 1020 80" stroke="#22354a" strokeWidth="20" />
        <path
          d="M-20 500 1020 80"
          stroke="#94a3b8"
          strokeDasharray="10 12"
          strokeOpacity="0.22"
          strokeWidth="1.5"
        />

        {/* Secondary curve */}
        <path
          d="M620-20c70 128 112 264 74 396s-92 144-150 204"
          stroke="#2d425c"
          strokeWidth="9"
        />
      </g>

      {/* Road labels */}
      <g
        className="font-display"
        fill="#94a3b8"
        fillOpacity="0.5"
        fontSize="10"
        letterSpacing="2.4"
      >
        <text transform="rotate(-22 170 388)" x="170" y="388">
          SIALKOT ROAD
        </text>
        <text x="418" y="184" transform="rotate(90 418 184)">
          CIRCULAR RD
        </text>
      </g>

      {/* Area labels */}
      <g
        className="font-display"
        fill="#cbd5e1"
        fillOpacity="0.38"
        fontSize="12"
        letterSpacing="3.2"
      >
        {MAP_LABELS.map(({ x, y, label }) => (
          <text key={label} x={x} y={y}>
            {label}
          </text>
        ))}
      </g>

      {/* Coordinate crosshair */}
      <g stroke="#10b981" strokeOpacity="0.28" strokeWidth="1">
        <path d="M600 0v560" strokeDasharray="4 9" />
        <path d="M0 258h1000" strokeDasharray="4 9" />
        <path d="M588 258h24M600 246v24" strokeOpacity="0.7" />
        <circle cx="600" cy="258" r="42" fill="none" strokeOpacity="0.18" />
      </g>

      {/* Pulsating radar rings */}
      <g fill="none" stroke="#34d399" strokeWidth="1.5">
        <circle cx="600" cy="258" r="12">
          <animate
            attributeName="r"
            dur="3.2s"
            repeatCount="indefinite"
            values="14;68"
          />
          <animate
            attributeName="opacity"
            dur="3.2s"
            repeatCount="indefinite"
            values="0.55;0"
          />
        </circle>
        <circle cx="600" cy="258" r="12">
          <animate
            attributeName="r"
            begin="1.6s"
            dur="3.2s"
            repeatCount="indefinite"
            values="14;68"
          />
          <animate
            attributeName="opacity"
            begin="1.6s"
            dur="3.2s"
            repeatCount="indefinite"
            values="0.55;0"
          />
        </circle>
      </g>

      {/* Store pin */}
      <g>
        <ellipse
          cx="600"
          cy="314"
          fill="#020617"
          fillOpacity="0.65"
          filter="url(#rabta-pin-shadow)"
          rx="22"
          ry="7"
        />
        <path
          d="M600 312c-12-18-28-34-28-52a28 28 0 1 1 56 0c0 18-16 34-28 52Z"
          fill="#059669"
          stroke="#f8fafc"
          strokeWidth="3"
        />
        <circle cx="600" cy="260" r="9" fill="#f8fafc" />
        <text
          className="font-display"
          fill="#34d399"
          fontSize="10"
          letterSpacing="2.5"
          x="620"
          y="234"
        >
          STORE // 03
        </text>
        <path
          d="M618 240h14"
          stroke="#34d399"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
}

/** Section 03 — store directions and the two direct contact channels. */
export function RabtaSection({
  className = "",
  scrollRef,
}: RabtaSectionProps) {
  return (
    <div
      className={`w-full overscroll-contain bg-ink text-chalk ${className}`}
      id="rabta"
      ref={scrollRef}
    >
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-7xl flex-col gap-4 px-5 pb-8 pt-20 md:px-12 lg:pt-24">
        {/* Editorial header */}
        <header>
          <div className="flex flex-wrap items-center gap-3 font-display text-technical-code uppercase tracking-widest">
            <span className="text-primary">[ 03 // Rabta ]</span>
            <span aria-hidden="true" className="h-px w-10 bg-primary/60" />
            <span className="text-chalk/40">Direct Line // Daska</span>
            <span className="ml-auto flex items-center gap-2 border border-chalk/15 px-2.5 py-1 text-chalk/60">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary motion-reduce:animate-none"
              />
              Chalu // Open
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <h2 className="font-display text-[38px] font-bold uppercase leading-[0.94] tracking-[-0.04em] text-chalk sm:text-[52px] lg:text-[60px]">
              Humse Rabta Karein
            </h2>
            <p className="max-w-sm pb-1 font-sans text-body-sm text-chalk/55">
              Ek tap mein raasta ya rabta — bilkul bina form, bina intezaar.
            </p>
          </div>
        </header>

        {/* Element 01 — map button card */}
        <a
          aria-label={`Store location at ${COORDINATES} — open directions in Google Maps`}
          className="group relative block min-h-[300px] w-full flex-1 overflow-hidden border border-chalk/15 bg-[#0b1424] transition-colors duration-200 hover:border-primary/60 focus-visible:border-primary"
          href={MAP_URL}
          rel="noopener noreferrer"
          target="_blank"
        >
          <StoreMap />

          {/* Map vignette */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(7,14,26,0.82)_100%)] transition-opacity duration-300 group-hover:opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-primary/0 mix-blend-screen transition-colors duration-300 group-hover:bg-primary/10"
          />

          {/* Corner brackets */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-3 h-4 w-4 border-l border-t border-chalk/40 transition-colors group-hover:border-primary"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-3 h-4 w-4 border-r border-t border-chalk/40 transition-colors group-hover:border-primary"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-3 h-4 w-4 border-b border-l border-chalk/40 transition-colors group-hover:border-primary"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 border-b border-r border-chalk/40 transition-colors group-hover:border-primary"
          />

          {/* Map status chips */}
          <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-5 sm:top-5">
            <span className="flex items-center gap-2 border border-chalk/15 bg-ink/70 px-2.5 py-1.5 font-display text-technical-code uppercase tracking-widest text-chalk/70 backdrop-blur-sm">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 bg-primary"
              />
              Live Map // Grid 03
            </span>
            <span className="flex items-center gap-2 border border-chalk/15 bg-ink/70 px-2.5 py-1.5 font-display text-technical-code uppercase tracking-widest text-chalk/70 backdrop-blur-sm">
              Open in Maps
              <DirectionsIcon className="h-3 w-3 text-primary" />
            </span>
          </div>

          {/* Hover prompt */}
          <div className="pointer-events-none absolute inset-x-4 top-[22%] flex justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none sm:top-[24%]">
            <span className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 border border-primary/40 bg-ink/85 px-4 py-2 text-center font-display text-technical-code uppercase tracking-widest text-chalk backdrop-blur-sm">
              <DirectionsIcon className="h-4 w-4 shrink-0 text-primary" />
              Rasta Maloom Karein
              <span aria-hidden="true" className="text-chalk/30">
                {"//"}
              </span>
              <span className="text-primary">
                Get Directions (Google Maps)
              </span>
            </span>
          </div>

          {/* Location readout */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink via-ink/85 to-transparent px-4 pb-5 pt-16 sm:px-5 sm:pb-6 sm:pt-20">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="min-w-0">
                <p className="font-display text-technical-code uppercase tracking-widest text-chalk/50">
                  Dukan ka Pata // Store Location
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <MapPinIcon className="h-4 w-4 shrink-0 text-primary" />
                  <p className="font-display text-headline-sm uppercase tracking-tight text-chalk">
                    Model Town, Daska
                  </p>
                  <span aria-hidden="true" className="hidden h-3 w-px bg-chalk/20 sm:block" />
                  <p className="font-mono text-body-sm text-primary">
                    {COORDINATES}
                  </p>
                </div>
              </div>

              <span className="hidden items-center gap-2.5 border border-chalk/20 bg-chalk/5 px-3.5 py-2.5 font-display text-technical-code uppercase tracking-widest text-chalk transition-colors duration-200 group-hover:border-primary group-hover:bg-primary group-hover:text-white sm:flex">
                <DirectionsIcon className="h-4 w-4" />
                Directions
                <ArrowForwardIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </a>

        {/* Element 02 — direct contact actions */}
        <div className="grid gap-3 sm:grid-cols-2">
          <a
            aria-label={`WhatsApp message to ${PHONE_DISPLAY}`}
            className="group flex items-center gap-4 bg-primary px-5 py-4 text-chalk transition-colors duration-150 hover:bg-primary-deep"
            href={WHATSAPP_URL}
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-white/25 bg-white/10 transition-colors group-hover:bg-white/15">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-display text-technical-code uppercase tracking-widest text-white/70">
                WhatsApp Message // 01
              </span>
              <span className="mt-1 font-display text-headline-sm tracking-tight text-chalk">
                {PHONE_DISPLAY}
              </span>
            </span>
            <ArrowForwardIcon className="ml-auto h-5 w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-1" />
          </a>

          <a
            aria-label={`Call ${PHONE_DISPLAY}`}
            className="group flex items-center gap-4 bg-chalk px-5 py-4 text-ink transition-colors duration-150 hover:bg-chalk/90"
            href={PHONE_HREF}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center border border-ink/15 bg-ink/5 transition-colors group-hover:bg-ink/10">
              <PhoneIcon className="h-5 w-5" />
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="font-display text-technical-code uppercase tracking-widest text-ink/50">
                Local Phone Call // 02
              </span>
              <span className="mt-1 font-display text-headline-sm tracking-tight text-ink">
                {PHONE_DISPLAY}
              </span>
            </span>
            <ArrowForwardIcon className="ml-auto h-5 w-5 shrink-0 transition-transform duration-150 group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
}
