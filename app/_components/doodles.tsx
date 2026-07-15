export const LL_COLORS = {
  orange: "#ef4416",
  burgundy: "#780228",
  pink: "#f2c7c0",
  yellow: "#efe439",
  paper: "#f5f0e8",
  cream: "#f0f1f5",
} as const;

const { orange: ORANGE, burgundy: BURGUNDY, yellow: YELLOW } = LL_COLORS;

type DoodleProps = { size?: number; color?: string; className?: string };

export function StarDoodle({ size = 96, color = YELLOW, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      className={className}
      aria-hidden
    >
      <path
        d="M50 4 L58 38 L94 42 L64 60 L74 94 L50 72 L26 94 L36 60 L6 42 L42 38 Z"
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function CandleDoodle({ size = 80, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      className={className}
      aria-hidden
    >
      <path
        d="M50 8 C 42 20, 40 30, 44 38 C 48 44, 52 44, 56 38 C 60 30, 58 20, 50 8 Z"
        fill={YELLOW}
        stroke={BURGUNDY}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M50 20 C 46 26, 45 32, 47 36 C 50 39, 52 39, 54 36 C 56 32, 54 26, 50 20 Z"
        fill={ORANGE}
      />
      <path
        d="M50 40 L50 46"
        stroke={BURGUNDY}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <rect
        x="36"
        y="46"
        width="28"
        height="44"
        rx="2"
        fill={BURGUNDY}
        stroke={BURGUNDY}
        strokeWidth="2.5"
      />
      <path
        d="M36 58 C 32 62, 32 68, 36 72"
        stroke={BURGUNDY}
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M42 52 L42 84"
        stroke={ORANGE}
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  );
}

export function ArrowDoodle({ color = ORANGE, size = 42, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={(size * 60) / 42}
      viewBox="0 0 42 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      className={className}
      aria-hidden
    >
      <path
        d="M21 4 L21 52 M6 36 L21 54 L36 36"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function WaxSealDoodle({ size = 90, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      className={className}
      aria-hidden
    >
      <path
        d="M50 8
           C 62 12, 78 14, 86 22
           C 92 32, 90 46, 84 56
           C 90 66, 88 78, 78 84
           C 68 92, 56 92, 50 90
           C 44 92, 32 92, 22 84
           C 12 78, 10 66, 16 56
           C 10 46, 8 32, 14 22
           C 22 14, 38 12, 50 8 Z"
        fill={BURGUNDY}
        stroke={BURGUNDY}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <text
        x="50"
        y="58"
        textAnchor="middle"
        fontFamily="serif"
        fontWeight="700"
        fontSize="28"
        fill={YELLOW}
        letterSpacing="-1"
      >
        LL
      </text>
    </svg>
  );
}

export function EnvelopeDoodle({ size = 120, color = BURGUNDY, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={(size * 80) / 120}
      viewBox="0 0 120 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      className={className}
      aria-hidden
    >
      <rect
        x="4"
        y="10"
        width="112"
        height="66"
        rx="2"
        stroke={color}
        strokeWidth="3.5"
        fill="none"
      />
      <path
        d="M4 12 L60 46 L116 12"
        stroke={color}
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function PostmarkDoodle({ size = 110, color = BURGUNDY, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 110 110"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      className={className}
      aria-hidden
    >
      <circle
        cx="55"
        cy="55"
        r="48"
        stroke={color}
        strokeWidth="2"
        fill="none"
        opacity="0.85"
      />
      <circle
        cx="55"
        cy="55"
        r="38"
        stroke={color}
        strokeWidth="1.5"
        fill="none"
        opacity="0.75"
      />
      <text
        x="55"
        y="42"
        textAnchor="middle"
        fontFamily="serif"
        fontWeight="700"
        fontSize="10"
        fill={color}
        letterSpacing="2"
      >
        KÖLN
      </text>
      <path
        d="M20 55 L90 55"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.75"
      />
      <text
        x="55"
        y="76"
        textAnchor="middle"
        fontFamily="serif"
        fontWeight="500"
        fontSize="8"
        fill={color}
        letterSpacing="1.5"
      >
        LEKKER · POST
      </text>
    </svg>
  );
}

export function FoldLine({ color = BURGUNDY, opacity = 0.35 }: { color?: string; opacity?: number }) {
  return (
    <div
      aria-hidden
      style={{
        width: "100%",
        height: 1,
        borderTop: `1px dashed ${color}`,
        opacity,
      }}
    />
  );
}

export function HeartDoodle({ size = 44, color = ORANGE, className }: DoodleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
      className={className}
      aria-hidden
    >
      <path
        d="M30 52 C 8 38, 4 22, 14 14 C 22 8, 28 14, 30 20 C 32 14, 38 8, 46 14 C 56 22, 52 38, 30 52 Z"
        stroke={color}
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
