import Link from "next/link";
import { Container, SECTION_TIGHT, Section, SectionHead } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { TypingLine } from "@/components/visuals/TypingLine";

/**
 * Tenure AI, on the navy band.
 *
 * THE HEADLINE CHANGED, AND THAT WAS A REAL DEFECT.
 *
 * This section's h2 was "They read the seat before they sit in it." — the exact
 * sentence `Handoff` used as its h3, one section above, word for word. Two
 * headings, one string, on the same page. It read as a template that had been
 * filled in twice, which is the impression a landing page can least afford. The
 * heading now says what this section is actually about — the record answers
 * questions — and the shadow-access idea lives once, in the seat panel.
 *
 * THE DISCLOSURE PARAGRAPH IS LOAD-BEARING. Do not trim it for length.
 * It is the only place on the home page that names the AI subprocessor. When the
 * old `Governance` section merged away, a grep for "Anthropic" across
 * src/components returned exactly one hit — in the file that had just been
 * deleted — and a §7.4 disclosure requirement disappeared with it. C-007 requires
 * all THREE outbound flows to be disclosed together, and `claims.spec.ts` asserts
 * the site names a provider at all.
 */

const POINTS = [
  "No more “ask the person who left”",
  "If the model is unavailable, the ranked sources still come back",
  "The model is only ever given records you can already open",
];

type Exchange = { ask: string; answer: string; sources: string };

/**
 * These are search queries, not conversation.
 *
 * The deploying retriever tokenises on non-alphanumerics, drops one-character
 * tokens, and then requires EVERY remaining token to appear literally in a single
 * record — no stemming, no synonyms, no stopword removal. "What's our sponsorship
 * pipeline?" therefore becomes a four-term AND including "what" and "our", and
 * returns nothing. These demos used to be shaped that way, which meant the most
 * prominent product proof on the site depicted a result the product cannot return.
 *
 * Substring matching is what makes these work: "election" matches "elections".
 */
const EXCHANGES: Exchange[] = [
  {
    ask: "sponsorship renewal",
    answer:
      "From last term’s sponsorship cards: Halden Catering renewal sent, Harbour Mutual awaiting reply after Maya ’24’s intro, Fenwick Print at a standing 15% rate.",
    sources: "3 sources",
  },
  {
    ask: "election nominations",
    answer:
      "Nominations open week 10, two-week window, ranked-choice ballot in the Members module.",
    sources: "2 records",
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
    <Section from="subtle" tone="band" backdrop="band" space={SECTION_TIGHT}>
      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* LEFT, copy */}
          <div>
            <SectionHead
              eyebrow="Tenure AI"
              title={
                <>
                  Ask the record,{" "}
                  <span className="text-grove-bright">not the person who left</span>.
                </>
              }
              // No colour overrides needed: globals.css re-points every semantic
              // text token for anything inside a `bg-band*` element, so SectionHead's
              // `text-ink` / `text-ink-soft` resolve to the inverse ramp here. That
              // is deliberate — a section dropped onto a band is correct by default,
              // and cannot regress when someone adds a `text-ink-faint` inside one.
              lead="An incoming holder gets read-only access to the seat’s record before their term begins, then searches it, and gets an answer built from what past holders filed as they worked, with the records it came from linked."
            />

            <ul className="mt-7 space-y-3">
              {POINTS.map((point) => (
                <li
                  key={point}
                  className="flex items-start gap-3 text-body leading-relaxed text-inverse/80"
                >
                  <Check />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT, the panel */}
          <Reveal delay={0.1}>
            <div className="rounded-[26px] border border-line-dark bg-band-raised shadow-[var(--shadow-lg)]">
              <div className="flex items-center justify-between gap-3 border-b border-line-dark px-4 py-3">
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
                  <span className="font-display text-body-sm text-inverse">
                    Ask Tenure
                  </span>
                </div>
                <span className="label-mono text-mark text-inverse/75">
                  Treasurer seat · day 1
                </span>
              </div>

              <div className="space-y-4 p-4">
                {EXCHANGES.map((ex) => (
                  <div key={ex.ask} className="space-y-2">
                    <div className="flex justify-end">
                      <p className="max-w-[85%] rounded-2xl rounded-br-md border border-line-dark bg-paper/[0.06] px-3.5 py-2 text-body-sm text-inverse/85">
                        {ex.ask}
                      </p>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-[92%] rounded-2xl rounded-bl-md border border-grove/30 bg-grove/[0.12] px-3.5 py-2.5">
                        <p className="text-body-sm leading-relaxed text-inverse/90">
                          {ex.answer}
                        </p>
                        <span className="mt-1.5 inline-flex items-center gap-1 font-mono text-mark uppercase tracking-wide text-grove-bright">
                          <svg width="11" height="11" viewBox="0 0 16 16" fill="none" aria-hidden>
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

                <div className="flex items-center gap-2 rounded-xl border border-line-dark bg-band px-3.5 py-2.5">
                  <TypingLine
                    phrases={["catering vendor", "sponsorship renewal", "election nominations"]}
                    className="flex-1 text-caption text-inverse/75"
                  />
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
            </div>
          </Reveal>
        </div>

        {/*
          The AI provider disclosure. C-007's qualification requires all three
          outbound flows to travel together: the records retrieved for a question,
          the contents of a text document when a summary is requested, and the
          instruction typed into Draft Assist.

          "every answer links its sources" is deliberately not written, citation
          is an instruction in the system prompt with no post-hoc verification, and
          the chat route calls the model even when retrieval matched nothing.
          `forbiddenPhrases` blocks the absolute form.
        */}
        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-3xl border-t border-line-dark pt-6 text-center text-body-sm leading-relaxed text-inverse/65">
            {/* NOT "every answer links", the chat route calls the model even when
                retrieval matched nothing, so the absolute form is false and the
                register blocks it. This is the claim the code actually supports. */}
            Tenure AI is given only records you can already open, and answers link
            the records they came from. Text goes to the model service, inside our
            own cloud account, for three things: the records retrieved for a question,
            a text document someone asks to summarize, and an instruction typed into
            Draft Assist. Your records stay yours, they are never used to train
            a model.{" "}
            <Link
              href="/trust"
              className="whitespace-nowrap font-medium text-grove-bright underline underline-offset-4"
            >
              The controls behind it &rarr;
            </Link>
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
