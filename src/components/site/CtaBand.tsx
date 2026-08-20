import type { ReactNode } from "react";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { ContactSales } from "@/components/ui/ContactSales";
import { ContourMask } from "@/components/visuals/SectionContour";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

/** Site-wide closing call to action, a navy band. Reused at the foot of pages. */
/**
 * `seed` moves the two accent squares and picks the contour, so the band is not
 * the SAME PICTURE at the foot of every route. It was byte-identical on four —
 * same headline, same subhead, same ornament positions, same contour — which a
 * reader meets as "I have already reached the end of this site" on their second
 * page. Callers pass a route-specific title and sub for the same reason.
 */
const CTA_ACCENTS: readonly { a: string; b: string; contour: number }[] = [
  { a: "right-[12%] top-[22%]", b: "left-[13%] bottom-[24%]", contour: 3 },
  { a: "left-[10%] top-[26%]", b: "right-[15%] bottom-[20%]", contour: 5 },
  { a: "right-[18%] bottom-[28%]", b: "left-[16%] top-[18%]", contour: 8 },
  { a: "left-[19%] bottom-[22%]", b: "right-[11%] top-[30%]", contour: 2 },
];

export function CtaBand({
  title,
  sub = "See Tenure on your organization’s real handoff. A short walkthrough: we’ll show you exactly what carries forward.",
  seed = 0,
}: {
  title?: ReactNode;
  sub?: string;
  /** Which accent arrangement to paint. Give each route a different one. */
  seed?: number;
}) {
  const accent = CTA_ACCENTS[((seed % CTA_ACCENTS.length) + CTA_ACCENTS.length) % CTA_ACCENTS.length];
  return (
    <section className="relative isolate overflow-hidden bg-band py-14 sm:py-18">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_60%_at_50%_45%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_70%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 text-inverse/[0.1] [mask-image:radial-gradient(75%_75%_at_50%_50%,black,transparent_78%)]"
      >
        <ContourMask seed={accent.contour} />
      </div>
      {/* angular accents */}
      <div
        aria-hidden
        className={cn("pointer-events-none absolute hidden h-6 w-6 rotate-[18deg] rounded-[6px] bg-brand-coral/70 sm:block", accent.a)}
      />
      <div
        aria-hidden
        className={cn("pointer-events-none absolute hidden h-5 w-5 rotate-45 rounded-[4px] bg-brand-violet/70 sm:block", accent.b)}
      />

      <Container className="relative text-center">
        <Reveal>
          <h2 className="font-display mx-auto max-w-2xl text-h2 font-semibold leading-[1.1] tracking-[-0.03em] text-inverse sm:text-h2-lg">
            {title ?? (
              <>
                Run the org. Hand it off.{" "}
                <span className="text-grove-bright">Lose nothing.</span>
              </>
            )}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-5 max-w-xl text-lead leading-relaxed text-inverse/70">
            {sub}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <ContactSales size="lg" arrow />
            <a
              href={`mailto:${site.email}`}
              className="text-body text-inverse/70 underline-offset-4 transition-colors hover:text-inverse hover:underline"
            >
              or email us
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
