import Image from "next/image";
import { Container, Section, SECTION_TIGHT } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { site } from "@/lib/site";

/**
 * SUPPORTED BY — a band of its own, which is the whole point.
 *
 * These two marks used to sit inside the hero's closing rail under the caption
 * "Origin & support", squeezed between four scope chips and a paragraph of
 * disclaimers. Institutional marks crammed into a hero rail read as a startup
 * borrowing credibility; the same marks given a quiet band of their own read as
 * a company stating a fact. Every enterprise site this one is measured against
 * does the second.
 *
 * WHAT IT MAY AND MAY NOT SAY. C-022 permits these marks for origin and support
 * only — never customership, sponsorship of the product, or endorsement. So the
 * caption is "Supported by", the sentence beneath states the relationship in
 * plain words, and neither the marks nor the copy imply the university selected,
 * procured or recommends Tenure.
 *
 * The marks are dark-ink PNGs and are never recoloured: that is the one thing
 * C-022's permission does not cover.
 */
export function SupportedBy() {
  return (
    <Section from="band" tone="canvas" space={SECTION_TIGHT}>
      <Container>
        <Reveal>
          <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-center sm:gap-12 sm:text-left">
            <p className="label-mono shrink-0">Supported by</p>

            <div className="flex shrink-0 items-center gap-10 sm:gap-12">
              {site.supporters.map((s) => (
                <Image
                  key={s.name}
                  src={s.src}
                  alt={s.name}
                  width={s.width}
                  height={s.height}
                  className="logo-mark w-auto object-contain opacity-90"
                  style={{ height: s.displayHeight }}
                />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <p className="mx-auto mt-6 max-w-2xl text-center text-caption leading-relaxed text-ink-faint">
            Tenure was founded at Simon Business School, University of Rochester,
            and is supported by Startup Wednesday.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
