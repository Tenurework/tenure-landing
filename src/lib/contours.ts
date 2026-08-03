/**
 * Marching-squares iso-contour geometry for the decorative section backgrounds.
 *
 * This used to live inside `components/visuals/ContourField.tsx` and run on every
 * server render, emitting one `<path>` per elevation level straight into the RSC
 * tree. That cost more than it looked: the path data shipped TWICE in each
 * response — once as DOM markup and again inside the inline `self.__next_f.push`
 * flight payload — and measured 60,349 gzipped bytes of the home document, 59.4%
 * of the whole transferred page, for a background rendered at 5-13% opacity.
 *
 * It is deterministic on `seed`, so it belongs at build time. `scripts/
 * build-contours.mjs` calls this and writes one static, cacheable SVG per seed
 * into `public/contours/`, which `SectionContour` then paints as a CSS mask.
 *
 * Kept as a plain .ts module with no JSX so the build script can import it
 * directly under Node's type stripping.
 */
export const W = 1200;
export const H = 700;

/** Every seed referenced by a SectionContour/contour call site, plus the default. */
export const SEEDS = [0, 1, 2, 3, 4, 5, 6, 8, 11] as const;

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

/**
 * One path string per elevation level.
 *
 * Grid resolution and coordinate precision are both deliberately modest. At
 * 66x38x8 levels with one-decimal coordinates this was 200KB of path data; 48x28
 * with integer coordinates is visually indistinguishable at these opacities (the
 * field is smooth and the viewBox is scaled to fill a section, so a half-unit is
 * well under a device pixel) and costs about a third as much. That still matters
 * for the generated file size even though it no longer ships in the document.
 */
export function buildContours(seed: number): string[] {
  const COLS = 48;
  const ROWS = 28;
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
          d += `M${a[0].toFixed(0)} ${a[1].toFixed(0)}L${b[0].toFixed(0)} ${b[1].toFixed(0)}`;
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
 * The full SVG document for one seed.
 *
 * Stroked in black: the file is used as a CSS mask, so only its alpha matters and
 * the colour is supplied by `background-color: currentColor` at the call site.
 * That is what keeps every existing tint class — `text-grove/[0.06]`,
 * `text-inverse/[0.07]`, `text-ink/[0.05]` — and both themes working unchanged.
 * The per-level opacity ramp survives as mask alpha.
 */
export function contourSvg(seed: number): string {
  const paths = buildContours(seed)
    .map(
      (d, i, all) =>
        `<path d="${d}" opacity="${(0.5 + (i / all.length) * 0.5).toFixed(2)}"/>`,
    )
    .join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#000" stroke-width="1" stroke-linecap="round">${paths}</g></svg>`;
}
