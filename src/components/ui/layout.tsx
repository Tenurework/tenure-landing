import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Backdrop, type BackdropVariant } from "@/components/visuals/Backdrop";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>
      {children}
    </div>
  );
}

/**
 * THE VERTICAL RHYTHM, IN ONE PLACE.
 *
 * Twenty sections hard-coded `py-24 sm:py-32` — 192px of padding on a phone and
 * 256px on a desktop, per section. Across the home page alone that was ~2,700px
 * of nothing, and it is the single largest reason the site measured 13.5 screens
 * on desktop and 23.8 on a phone.
 *
 * These three steps replace it. They are exported as constants rather than
 * hidden in a `@utility` so a section states its own weight at the call site,
 * and so a change here is one edit instead of twenty. Tailwind's scanner reads
 * class names out of any source file, including this one, so the literals below
 * are all it needs to emit them.
 *
 * ONLY STEP ONE EVER SHIPPED. `SECTION_TIGHT` and `SECTION_BAND` were exported
 * and then referenced by nothing: all 39 `<Section>` call sites took the default,
 * so a file documenting a three-step rhythm applied one step. The measured cost
 * was 1,546px of empty seam on the home page — eleven boundaries of 134-173px,
 * each one 80px of `sm:py-20` meeting another 80px of it.
 *
 * The scale is also one notch shorter than it was. At this heading size a 160px
 * seam does not read as breathing room, it reads as an unrelated slab starting;
 * 72px against 48px puts the boundary at ~120px, which is where the sites this
 * one is measured against sit. Nothing is cut to buy it — this is padding only.
 */
export const SECTION = "py-14 sm:py-[4.5rem]";
/** For a section that follows a related one and should read as continuous. */
export const SECTION_TIGHT = "py-10 sm:py-12";
/** For the two closing bands, which carry one idea and no supporting detail. */
export const SECTION_BAND = "py-12 sm:py-14";

/**
 * A section, its backdrop and its rhythm as one element.
 *
 * `isolate` and `relative` are not optional and are therefore not left to the
 * caller: `Backdrop` renders at `-z-10`, and without a stacking context of its
 * own that layer escapes behind the *page* rather than behind the section, where
 * it paints over whatever precedes it.
 */
export type Tone = "canvas" | "surface" | "subtle" | "band" | "none";

export function Section({
  id,
  backdrop,
  backdropSeed = 0,
  from,
  tone = "canvas",
  space = SECTION,
  divide = true,
  className,
  children,
}: {
  id?: string;
  backdrop?: BackdropVariant;
  /**
   * Which composition of the backdrop variant to paint. Two sections sharing a
   * variant MUST pass different seeds — `quiet` is used twelve times site-wide
   * and `drafting` eight, and without this they rendered identically.
   */
  backdropSeed?: number;
  /**
   * The tone of the section immediately ABOVE this one, so the boundary can ramp
   * between two fills instead of stepping between them.
   *
   * A section cannot see its predecessor, and it is `overflow-hidden`, so it can
   * neither read nor paint outside its own box. Naming the previous tone at the
   * call site is the only way to make the join a gradient. Left unset the ramp is
   * skipped entirely — better a clean step than a ramp toward the wrong colour,
   * which is what a guessed default produces.
   */
  from?: Tone;
  /** The base fill the backdrop layers on top of. */
  tone?: Tone;
  space?: string;
  /** The hairline that separates one section from the next. */
  divide?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const fill = {
    canvas: "bg-paper",
    surface: "bg-cloud",
    subtle: "bg-sand",
    band: "bg-band text-inverse",
    none: "",
  }[tone];

  /*
    The ramp, as a complete class literal per (from -> tone) pair.

    Tailwind v4 finds class names by scanning source text, so a gradient built by
    interpolating a token name emits no CSS and the ramp silently does nothing.
    Every pair that actually occurs on this site is spelled out; anything else
    falls through to no ramp, which is the honest default.
  */
  const RAMP: Record<string, string> = {
    "canvas>subtle": "bg-[linear-gradient(to_bottom,var(--canvas),transparent)]",
    "canvas>surface": "bg-[linear-gradient(to_bottom,var(--canvas),transparent)]",
    "surface>canvas": "bg-[linear-gradient(to_bottom,var(--surface),transparent)]",
    "surface>subtle": "bg-[linear-gradient(to_bottom,var(--surface),transparent)]",
    "subtle>canvas": "bg-[linear-gradient(to_bottom,var(--surface-subtle),transparent)]",
    "subtle>surface": "bg-[linear-gradient(to_bottom,var(--surface-subtle),transparent)]",
    "band>canvas": "bg-[linear-gradient(to_bottom,var(--inverse),transparent)]",
    "band>subtle": "bg-[linear-gradient(to_bottom,var(--inverse),transparent)]",
    "band>surface": "bg-[linear-gradient(to_bottom,var(--inverse),transparent)]",
    "canvas>band": "bg-[linear-gradient(to_bottom,var(--canvas),transparent)]",
    "subtle>band": "bg-[linear-gradient(to_bottom,var(--surface-subtle),transparent)]",
    "surface>band": "bg-[linear-gradient(to_bottom,var(--surface),transparent)]",
  };
  const ramp = from && from !== tone ? RAMP[`${from}>${tone}`] : undefined;

  /*
    A RULE BETWEEN TWO IDENTICAL FILLS IS LINE NOISE.

    A hairline drawn where the colour does not change divides nothing — it is a
    full-width line across the page for no reason, and three of them were
    measured on the running site (home SeatMechanism after Audiences, and two on
    /product). The divider exists to mark a change of surface, so when the caller
    tells us the surface does not change, it is suppressed.

    Sections that do not declare `from` keep the rule: an unknown predecessor is
    not the same as a known-identical one.
  */
  const sameSurface = from !== undefined && from === tone;
  const showDivider = divide && !sameSurface;

  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden",
        fill,
        space,
        id && "scroll-mt-20",
        className,
      )}
    >
      {/*
        THE SEAM, WHICH USED TO BE A CLIFF.

        This was `border-t border-line` — a flat, edge-to-edge, full-opacity 1px
        rule, under an instantaneous change of background fill. Measured down the
        right gutter of the home page, two boundaries moved ~200 luminance levels
        inside two device rows (Handoff into AiOnboarding, OfficeConsole into
        MetricsBand), and one changed fill with no rule at all. Ten of them fire
        on the home page.

        A hard horizontal step across the full viewport width is the single most
        template-looking thing a long page can do: it stops reading as one
        document and starts reading as a stack of unrelated slabs, which also
        works against "one thing in view" — each slab announces a new context.

        Two layers replace it, and both are `aria-hidden` siblings for the same
        reason the backdrop is (see Backdrop.tsx): the contrast gate resolves a
        text node's background by climbing its ancestors.

        1. A hairline that FADES OUT before it reaches either edge, so the line
           reads as a join rather than as a border drawn around a box.
        2. A short gradient ramp in the incoming fill, so the two tones meet over
           ~64px instead of in one row. It is `currentColor`-free and uses the
           section's own fill token, so it inverts with the theme like everything
           else.
      */}
      {showDivider && (
        <>
          <div
            aria-hidden
            className={cn(
              "pointer-events-none absolute inset-x-0 top-0 h-px",
              tone === "band"
                ? "bg-[linear-gradient(90deg,transparent,var(--border-inverse)_16%,var(--border-inverse)_84%,transparent)]"
                : "bg-[linear-gradient(90deg,transparent,var(--border)_16%,var(--border)_84%,transparent)]",
            )}
          />
          {ramp && (
            <div
              aria-hidden
              className={cn("pointer-events-none absolute inset-x-0 top-0 -z-10 h-20", ramp)}
            />
          )}
        </>
      )}
      {backdrop && <Backdrop variant={backdrop} seed={backdropSeed} />}
      {children}
    </section>
  );
}

/** The "registrar" label, a mono eyebrow with an optional record index. */
export function Eyebrow({
  children,
  index,
  className,
}: {
  children: ReactNode;
  index?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5 label-mono", className)}>
      {index && <span className="text-grove">{index}</span>}
      <span>{children}</span>
    </span>
  );
}

/**
 * The eyebrow / heading / lead block that opened every section, written once.
 *
 * It was copy-pasted twenty-two times with three different heading scales, four
 * different top margins and two different `max-w` values, which is why no two
 * sections started on the same baseline. The scale here is one step smaller than
 * the old `text-display-sm lg:text-display-sm`: at that size a section heading was
 * competing with the h1 for the same rank.
 */
export function SectionHead({
  eyebrow,
  index,
  title,
  lead,
  align = "start",
  className,
  children,
}: {
  eyebrow: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  align?: "start" | "center";
  className?: string;
  children?: ReactNode;
}) {
  const centred = align === "center";
  return (
    <div className={cn(centred ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      <Reveal>
        <Eyebrow index={index} className={centred ? "justify-center" : undefined}>
          {eyebrow}
        </Eyebrow>
      </Reveal>
      <Reveal delay={0.05}>
        <h2 className="font-display mt-3 text-h2 font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-h2-lg lg:text-h2-lg">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="mt-3.5 text-lead leading-relaxed text-ink-soft sm:text-lead">
            {lead}
          </p>
        </Reveal>
      )}
      {children}
    </div>
  );
}

/** A hairline rule with a faint brass bleed, a ledger line. */
export function Rule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-line", className)} />;
}
