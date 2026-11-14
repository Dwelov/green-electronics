type CircuitTracesProps = {
  variant: "base" | "reveal";
};

const TRACES = [
  { d: "M 80,120 L 220,120 L 280,180 L 450,180", nodes: [[80, 120], [450, 180]] },
  { d: "M 120,420 L 260,420 L 320,360 L 580,360", nodes: [[120, 420], [580, 360]] },
  { d: "M 850,150 L 980,150 L 1050,220 L 1280,220", nodes: [[850, 150], [1280, 220]] },
  { d: "M 720,520 L 880,520 L 940,460 L 1150,460", nodes: [[720, 520], [1150, 460]] },
  { d: "M 300,680 L 480,680 L 540,620 L 780,620", nodes: [[300, 680], [780, 620]] },
] as const;

/** Single-pixel PCB trace matrix used in both hero layers. */
export function CircuitTraces({ variant }: CircuitTracesProps) {
  const isBase = variant === "base";

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${
        isBase ? "opacity-[0.14]" : "opacity-[0.32]"
      }`}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1280 720"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        fill="none"
        stroke={isBase ? "#0F172A" : "#F8FAFC"}
        strokeWidth={isBase ? 1.2 : 1.3}
      >
        {TRACES.map((trace) => (
          <g key={trace.d}>
            <path className="circuit-line" d={trace.d} />
            {trace.nodes.map(([cx, cy]) => (
              <circle
                key={`${cx}-${cy}`}
                cx={cx}
                cy={cy}
                fill={isBase ? "#0F172A" : "#F8FAFC"}
                r={isBase ? 3.5 : 4}
              />
            ))}
          </g>
        ))}
      </g>
    </svg>
  );
}
