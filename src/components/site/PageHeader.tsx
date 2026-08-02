import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";

/** Consistent, centered top-of-page header for every non-home route. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(70%_60%_at_50%_-10%,color-mix(in_oklab,var(--accent)_8%,transparent),transparent_60%)]"
      />
      <Container className="relative pb-14 pt-32 text-center sm:pb-16 sm:pt-40">
        <Reveal>
          <Eyebrow className="justify-center">{eyebrow}</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h1 className="font-display mx-auto mt-6 max-w-3xl text-[2.5rem] font-semibold leading-[1.05] tracking-[-0.035em] text-ink sm:text-[3.3rem] lg:text-[3.7rem]">
            {title}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
              {intro}
            </p>
          </Reveal>
        )}
        {children && (
          <Reveal delay={0.18}>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              {children}
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}
