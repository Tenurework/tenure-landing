import { cn } from "@/lib/cn";

const W = 1200;
const H = 700;

/** Scalar field: a few gaussian "peaks" (for the contour eyes) + flowing ridges. */
function field(x: number, y: number, seed: number): number {
  const peaks: [number, number, number, number][] = [
    [0.22 + seed * 0.03, 0.34, 0.95, 0.13],
    [0.7, 0.28 + seed * 0.02, 1.0, 0.15],
    [0.54, 0.76, 0.85, 0.13],
    [0.88, 0.66, 0.7, 0.1],
    [0.1, 0.72, 0.6, 0.1],
    [0.4, 0.5 + seed * 0.02, 0.5, 0.11],
  ];
  let v = 0;
  for (const [px, py, amp, sig] of peaks) {
    const dx = x - px;
    const dy = y - py;
    v += amp * Math.exp(-(dx * dx + dy * dy) / (2 * sig * sig));
  }
  v += 0.26 * Math.sin(x * 6.0 + y * 2.0 + seed);
  v += 0.18 * Math.sin(y * 5.0 - x * 1.5 + 1.0 + seed);
  return v;
}

/** Marching-squares iso-contours → one path string per elevation level. */
function buildContours(seed: number): string[] {
  const COLS = 66;
  const ROWS = 38;
  const g: number[][] = [];
  let min = Infinity;
  let max = -Infinity;
  for (let j = 0; j <= ROWS; j++) {
    g[j] = [];
    for (let i = 0; i <= COLS; i++) {
      const v = field(i / COLS, j / ROWS, seed);
      g[j][i] = v;
      if (v < min) min = v;
      if (v > max) max = v;
    }
  }

  const LEVELS = 8;
  const lerp = (a: number, b: number, va: number, vb: number, lv: number) =>
    a + ((b - a) * (lv - va)) / (vb - va);

  const out: string[] = [];
  for (let l = 1; l <= LEVELS; l++) {
    const lv = min + ((max - min) * l) / (LEVELS + 1);
    let d = "";
    for (let j = 0; j < ROWS; j++) {
      for (let i = 0; i < COLS; i++) {
        const x0 = (i / COLS) * W;
        const x1 = ((i + 1) / COLS) * W;
        const y0 = (j / ROWS) * H;
        const y1 = ((j + 1) / ROWS) * H;
        const tl = g[j][i];
        const tr = g[j][i + 1];
        const br = g[j + 1][i + 1];
        const bl = g[j + 1][i];
        const idx =
          (tl > lv ? 8 : 0) | (tr > lv ? 4 : 0) | (br > lv ? 2 : 0) | (bl > lv ? 1 : 0);
        if (idx === 0 || idx === 15) continue;
        const top = (): [number, number] => [lerp(x0, x1, tl, tr, lv), y0];
        const right = (): [number, number] => [x1, lerp(y0, y1, tr, br, lv)];
        const bottom = (): [number, number] => [lerp(x0, x1, bl, br, lv), y1];
        const left = (): [number, number] => [x0, lerp(y0, y1, tl, bl, lv)];
        const seg = (a: [number, number], b: [number, number]) => {
          d += `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
        };
        switch (idx) {
          case 1:
          case 14:
            seg(left(), bottom());
            break;
          case 2:
          case 13:
            seg(bottom(), right());
            break;
          case 3:
          case 12:
            seg(left(), right());
            break;
          case 4:
          case 11:
            seg(top(), right());
            break;
          case 6:
          case 9:
            seg(top(), bottom());
            break;
          case 7:
          case 8:
            seg(left(), top());
            break;
          case 5:
            seg(left(), top());
            seg(bottom(), right());
            break;
          case 10:
            seg(left(), bottom());
            seg(top(), right());
            break;
        }
      }
    }
    out.push(d);
  }
  return out;
}

/**
 * A faint topographic contour field, iso-lines over a field of peaks and ridges,
 * the way a real contour map reads. Inherits color via currentColor. Decorative.
 */
export function ContourField({
  className,
  seed = 0,
}: {
  className?: string;
  seed?: number;
  /** kept for call-site compatibility */
  lines?: number;
}) {
  const paths = buildContours(seed);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
    >
      <g fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round">
        {paths.map((d, i) => (
          <path key={i} d={d} opacity={(0.5 + (i / paths.length) * 0.5).toFixed(2)} />
        ))}
      </g>
    </svg>
  );
}
