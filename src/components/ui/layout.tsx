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
 */
export const SECTION = "py-16 sm:py-20";
/** For a section that follows a related one and should read as continuous. */
export const SECTION_TIGHT = "py-12 sm:py-14";
/** For the two closing bands, which carry one idea and no supporting detail. */
export const SECTION_BAND = "py-14 sm:py-18";

/**
 * A section, its backdrop and its rhythm as one element.
 *
 * `isolate` and `relative` are not optional and are therefore not left to the
 * caller: `Backdrop` renders at `-z-10`, and without a stacking context of its
 * own that layer escapes behind the *page* rather than behind the section, where
 * it paints over whatever precedes it.
 */
export function Section({
  id,
  backdrop,
  tone = "canvas",
  space = SECTION,
  divide = true,
  className,
  children,
}: {
  id?: string;
  backdrop?: BackdropVariant;
  /** The base fill the backdrop layers on top of. */
  tone?: "canvas" | "surface" | "subtle" | "band" | "none";
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

  return (
    <section
      id={id}
      className={cn(
        "relative isolate overflow-hidden",
        fill,
        space,
        divide && (tone === "band" ? "border-t border-line-dark" : "border-t border-line"),
        id && "scroll-mt-20",
        className,
      )}
    >
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
 * the old `text-[2.5rem] lg:text-[2.8rem]`: at that size a section heading was
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
        <h2 className="font-display mt-4 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[2.2rem] lg:text-[2.4rem]">
          {title}
        </h2>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-[1.02rem] leading-relaxed text-ink-soft sm:text-[1.08rem]">
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
