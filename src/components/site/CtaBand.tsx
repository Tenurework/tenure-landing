import type { ReactNode } from "react";
import { Container } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { ContactSales } from "@/components/ui/ContactSales";
import { site } from "@/lib/site";


/** Site-wide closing call to action, a navy band. Reused at the foot of pages. */

export function CtaBand({
  title,
  sub = "See Tenure on your organization’s real handoff. A short walkthrough: we’ll show you exactly what carries forward.",
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

      <Container className="relative text-center">
        <Reveal>
          <h2 className="font-display mx-auto max-w-2xl text-h2 leading-[1.1] tracking-[-0.03em] text-inverse sm:text-h2-lg">
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
              href={`mailto:${site.email.sales}`}
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
