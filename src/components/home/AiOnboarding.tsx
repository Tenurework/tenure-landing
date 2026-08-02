import Link from "next/link";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { SectionContour } from "@/components/visuals/SectionContour";

const POINTS = [
  "No more “ask the person who left”",
  "If the model is unavailable, the ranked sources still come back",
];

type Exchange = {
  ask: string;
  answer: string;
  sources: string;
};

const EXCHANGES: Exchange[] = [
  {
    ask: "What's our sponsorship pipeline?",
    answer:
      "From last term’s sponsorship cards: Aramark renewal sent, M&T Bank awaiting reply after Maya ’24’s intro, Rochester Print at a standing 15% rate.",
    sources: "3 sources",
  },
  {
    ask: "How do we run elections?",
    answer:
      "Nominations open week 10, two-week window, ranked-choice ballot in the Members module.",
    sources: "Bylaws §4 · 2 records",
  },
];

function Check() {
  return (
    <span className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-md bg-grove/15">
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path
          d="M3.5 8.5l3 3 6-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-grove-bright"
        />
      </svg>
    </span>
  );
}

export function AiOnboarding() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line-dark bg-band py-24 text-inverse sm:py-32">
      <SectionContour place="br" seed={11} className="text-inverse/[0.07]" />
      {/* soft grove glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_55%_at_72%_30%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_68%)]"
      />
      {/* angular accents */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[18%] hidden h-6 w-6 rotate-[18deg] rounded-[6px] bg-brand-coral/70 sm:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[16%] right-[10%] hidden h-5 w-5 rotate-45 rounded-[4px] bg-brand-violet/70 sm:block"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        {/* LEFT, copy */}
        <div>
          <Reveal>
            <Eyebrow>Tenure AI</Eyebrow>
          </Reveal>

          <Reveal delay={0.06}>
            <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-inverse sm:text-[2.5rem] lg:text-[2.8rem]">
              They read the seat{" "}
              <span className="text-grove-bright">before they sit in it.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.12}>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-inverse/70">
              The incoming officer gets read-only access to the seat&rsquo;s
              record before their term begins, then asks it questions in plain
              language &mdash; answers built from what past holders recorded as
              they worked.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <ul className="mt-8 space-y-3">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-[0.97rem] leading-relaxed text-inverse/80"
                >
                  <Check />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* RIGHT, chat card */}
        <Reveal delay={0.12}>
          <div className="rounded-2xl border border-line-dark bg-band-raised p-5 shadow-[var(--shadow-lg)]">
            {/* card header */}
            <div className="flex items-center justify-between gap-3 border-b border-line-dark pb-4">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-grove/20">
                  <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden>
                    <path
                      d="M8 1.5l1.6 3.7 4 .3-3 2.6.9 3.9L8 12l-3.5 2 .9-3.9-3-2.6 4-.3z"
                      fill="currentColor"
                      className="text-grove-bright"
                    />
                  </svg>
                </span>
                <span className="font-display text-sm font-semibold text-inverse">
                  Ask Tenure
                </span>
              </div>
              <span className="label-mono text-[0.6rem] text-inverse/75">
                Treasurer seat
              </span>
            </div>

            {/* exchanges */}
            <div className="space-y-5 pt-5">
              {EXCHANGES.map((ex) => (
                <div key={ex.ask} className="space-y-2.5">
                  {/* user question */}
                  <div className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-md border border-line-dark bg-paper/[0.06] px-3.5 py-2 text-[0.86rem] text-inverse/85">
                      {ex.ask}
                    </p>
                  </div>
                  {/* answer */}
                  <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-2xl rounded-bl-md border border-grove/30 bg-grove/[0.12] px-3.5 py-2.5">
                      <p className="text-[0.86rem] leading-relaxed text-inverse/90">
                        {ex.answer}
                      </p>
                      <span className="mt-2 inline-flex items-center gap-1 font-mono text-[0.62rem] uppercase tracking-wide text-grove-bright">
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 16 16"
                          fill="none"
                          aria-hidden
                        >
                          <path
                            d="M5 11L11 5M6 5h5v5"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {ex.sources}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* composer affordance */}
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-line-dark bg-band px-3.5 py-2.5">
              <span className="flex-1 text-[0.82rem] text-inverse/75">
                Ask about this seat&rsquo;s history&hellip;
              </span>
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-grove text-on-accent">
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden>
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </Reveal>

        {/* The AI provider disclosure. It previously lived in the Governance
            section; when that merged away this was the only place on the home
            page naming the subprocessor, and a security reviewer should not
            have to reach /trust to find it. */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-12 max-w-2xl text-center text-[0.88rem] leading-relaxed text-inverse/60">
            Tenure AI is given only records you can already open, and every
            answer links its sources. To compose an answer, the retrieved text
            is sent to Anthropic&rsquo;s API &mdash; part of your record does
            leave our infrastructure when someone asks. We do not train models
            on it, and no pipeline exists that could.{" "}
            <Link
              href="/trust"
              className="whitespace-nowrap font-medium text-grove-bright underline underline-offset-4"
            >
              What is and isn&rsquo;t built &rarr;
            </Link>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
