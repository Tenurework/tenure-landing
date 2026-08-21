import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/Reveal";
import { Backdrop, type BackdropVariant } from "@/components/visuals/Backdrop";

/*
  1,360px OF CONTENT, WHICH MAKES THE BOX 1,440.

  Cohere's measured content width is 1360 inside a 1440 viewport — 40px of page
  margin either side. The obvious translation, `max-w-[85rem]` (1360) plus
  `px-10`, is wrong by exactly the padding: it caps the BOX at 1360 and then eats
  80 of it, leaving 1280 of content starting at x=80. Full-bleed elements that
  pad themselves from the viewport start at x=40, so the two systems drifted 40px
  apart and the nav floated in from the edges.

  The max-width has to include the gutters. 90rem with `px-10` puts content at
  x=40 with 1360 to work in, which is both what Cohere measures and what a
  full-bleed row already does.
*/
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[90rem] px-4 sm:px-6 lg:px-10", className)}>
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
export const SECTION = "py-16 sm:py-20";
/** For a section that follows a related one and should read as continuous. */
export const SECTION_TIGHT = "py-12 sm:py-14";
/** For the two closing bands, which carry one idea and no supporting detail. */
export const SECTION_BAND = "py-20 sm:py-24";

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
    /*
      A GRADED DARK SECTION, not a flat rectangle. `bg-band` stays because the
      stylesheet keys its inverse-text scope off that class name; `matte
      matte-deep` layers two low-chroma radials and film grain over it. Flat
      near-black is the single most static surface a page can have, and this site
      has three of them.
    */
    band: "bg-band matte matte-deep text-inverse",
    none: "",
  }[tone];


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
        THE RAMP IS GONE, and removing it is the point of this change. It faded
        the incoming fill over ~64px so two tones met gradually, and against a
        near-black band that produced a visible grey smudge at the top of the
        section — it read as a rendering artifact, not as a join.

        The reasoning it was built on ("a hard horizontal step is the most
        template-looking thing a long page can do") does not survive contact with
        the reference. cohere.com steps from white to a full-bleed photograph to
        near-black with no blend anywhere, and it does not read as a stack of
        slabs, because the sections differ compositionally rather than only in
        fill. Softening a boundary is what you do when the two sides are the same
        kind of thing; the fix for slab-stacking is to stop stacking slabs.

        What remains is the hairline, which still fades at both ends so it reads
        as a join rather than a border drawn around a box.
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
        </>
      )}
      {backdrop && <Backdrop variant={backdrop} />}
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
      {/*
        ONE MOVEMENT PER SECTION, not three staggered ones.

        This was a Reveal around each of the eyebrow, the heading and the lead, at
        0s / 0.05s / 0.1s. Every section on the site uses this head, so the home
        page rendered 46 separately animating elements and scrolling it played a
        cascade — the heading arriving after its own eyebrow, the lead after that.
        Measured on cohere.com, six elements animate on entry for the entire page.

        A stagger is a way of drawing attention to a sequence. Applied to every
        heading on a long page it stops meaning anything and starts reading as a
        template effect, which is the opposite of what it was reaching for. The
        head now moves as the one block it visually is.
      */}
      <Reveal>
        <Eyebrow index={index} className={centred ? "justify-center" : undefined}>
          {eyebrow}
        </Eyebrow>
        <h2 className="font-display mt-3 text-h2 text-ink sm:text-h2-lg">
          {title}
        </h2>
        {lead && (
          <p className="mt-4 text-lead leading-relaxed text-ink-soft measure">
            {lead}
          </p>
        )}
      </Reveal>
      {children}
    </div>
  );
}

/** A hairline rule with a faint brass bleed, a ledger line. */
export function Rule({ className }: { className?: string }) {
  return <div aria-hidden className={cn("h-px w-full bg-line", className)} />;
}
