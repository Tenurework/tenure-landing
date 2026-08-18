import type { ReactNode } from "react";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { ContactSales } from "@/components/ui/ContactSales";
import { ContourMask } from "@/components/visuals/SectionContour";
import { site } from "@/lib/site";

/** Site-wide closing call to action, a navy band. Reused at the foot of pages. */
export function CtaBand({
  title,
  sub = "See Tenure on your organization's real handoff. A short walkthrough: we'll show you exactly what carries forward.",
}: {
  title?: ReactNode;
  sub?: string;
}) {
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
        <ContourMask seed={3} />
      </div>
      {/* angular accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[12%] top-[22%] hidden h-6 w-6 rotate-[18deg] rounded-[6px] bg-brand-coral/70 sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-[13%] bottom-[24%] hidden h-5 w-5 rotate-45 rounded-[4px] bg-brand-violet/70 sm:block"
      />

      <Container className="relative text-center">
        <Reveal>
          <h2 className="font-display mx-auto max-w-2xl text-[2.2rem] font-semibold leading-[1.05] tracking-[-0.035em] text-inverse sm:text-[3rem]">
            {title ?? (
              <>
                Run the org. Hand it off.{" "}
                <span className="text-grove-bright">Lose nothing.</span>
              </>
            )}
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-5 max-w-xl text-[1.05rem] leading-relaxed text-inverse/70">
            {sub}
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
            <ContactSales size="lg" arrow />
            <a
              href={`mailto:${site.email}`}
              className="text-[0.97rem] text-inverse/70 underline-offset-4 transition-colors hover:text-inverse hover:underline"
            >
              or email us
            </a>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
