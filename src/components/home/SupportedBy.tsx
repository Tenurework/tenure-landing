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
    <Section from="canvas" tone="surface" space={SECTION_TIGHT}>
      <Container>
        <Reveal>
          <p className="label-mono text-center">Supported by</p>

          {/*
            THE MARKS SIT ON THEIR OWN LINE AND ARE HALF AGAIN AS LARGE. They used
            to run inline beside the caption at 2.15rem, which put three different
            things — a label, two institutional lockups and a sentence — on one
            row, and made the marks read as footnotes to the word "Supported".
            Given the width and the height they read as what they are.
          */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
            {site.supporters.map((s) => {
              const mark = (
                <Image
                  src={s.src}
                  alt={s.name}
                  width={s.width}
                  height={s.height}
                  className="logo-mark w-auto object-contain"
                  style={{ height: s.displayHeight }}
                />
              );
              return "href" in s && s.href ? (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-opacity hover:opacity-70"
                >
                  {mark}
                </a>
              ) : (
                <span key={s.name}>{mark}</span>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          {/*
            BOTH ARE SUPPORTERS, and one is also where the product runs. The old
            sentence made Startup Wednesday the supporter and Simon merely the
            place Tenure was founded, which understated both. C-022 still governs
            the marks: support and origin, never customership, sponsorship or
            endorsement — so this says where Tenure goes live and stops there.
          */}
          <p className="mx-auto mt-8 max-w-2xl text-center text-body leading-relaxed text-ink-soft">
            Tenure is supported by{" "}
            <span className="text-ink">Startup Wednesday</span> and{" "}
            <span className="text-ink">Simon Business School</span>, University of
            Rochester, where it was founded and where it goes live this term.
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
