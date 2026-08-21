import { Container, Eyebrow, SECTION_BAND, SECTION_TIGHT, Section } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeader } from "@/components/site/PageHeader";
import { AboutArt } from "@/components/visuals/hero-art/AboutArt";
import { CtaBand } from "@/components/site/CtaBand";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/story");

const RECORD: { label: string; value: string }[] = [
  {
    label: "Founded",
    value: `${site.origin.school}, ${site.origin.university}`,
  },
  {
    label: "Founders",
    value: site.founders.map((f) => f.name).join("  ·  "),
  },
  {
    label: "Pilot",
    value: `Planned ${site.pilot.season}`,
  },
  // "Built with" was still too strong for a labelled fact table. Nothing has been
  // built with the office: /pilot says "Who would sign — Nobody yet" and
  // "Organizations enrolled — None", and C-021's evidence is a conversation with no
  // written commitment in either direction. In a row of verified founding facts,
  // "Built with <institution>" asserts a completed collaboration that does not
  // exist, which is exactly what C-021 and C-022 forbid implying.
  { label: "Proposed pilot with", value: site.origin.office },
  { label: "Supported by", value: "Startup Wednesday" },
];

export default function StoryPage() {
  return (
    <>
      <PageHeader
        art={<AboutArt />}
        eyebrow="Our story"
        title={
          <>
            We kept watching good organizations{" "}
            <span className="text-grove">start over</span>.
          </>
        }
        intro={
          <>
            Tenure began at {site.origin.school}, out of a pattern impossible to
            unsee: every year, capable teams inherit almost nothing and rebuild
            what already existed.
          </>
        }
      />

      {/* 1, Why Tenure exists */}
      <Section tone="canvas" backdrop="light">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="01">Why Tenure exists</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-4 text-h2 text-ink sm:text-h2-lg">
                Every fall, the same{" "}
                <span className="text-grove">cold start</span>.
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-5 text-lead leading-relaxed text-ink-soft measure">
                At Simon, we watched it up close. A capable board spends a year
                building real things, sponsor relationships, an events
                playbook, a budget that finally works, then hands all of
                it off in a shared drive and a single coffee chat. Whatever
                doesn&rsquo;t fit in that hour leaves with them.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-lead leading-relaxed text-ink-soft measure">
                So the next team starts from memory and guesswork. Sponsor
                contacts go cold because no one knew they existed. The same
                mistakes get repeated, not from carelessness, but because
                the lesson left with the person who learned it. An organization
                can be years old and still wake up every fall with no record of
                itself.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lead leading-relaxed text-ink-soft measure">
                None of that is a people problem. It&rsquo;s a memory problem.
                Institutional knowledge shouldn&rsquo;t depend on whether one
                person remembered to write it down on the way out. It
                should accumulate on its own, as the work happens, and stay with
                the seat.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <blockquote className="mt-8 border-l-2 border-grove pl-5 font-display text-title leading-snug text-ink sm:text-h3">
                The role should keep what it knows, even after the people who
                built it have graduated.
              </blockquote>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 2, Founders */}
      <Section tone="subtle" backdrop="grid" space={SECTION_TIGHT}>
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="02">Founders</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-4 text-h2 text-ink sm:text-h2-lg">
                The people building the{" "}
                <span className="text-grove">record</span>.
              </h2>
            </Reveal>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2">
            {site.founders.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-cloud p-7 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-grove-soft font-display text-title-sm text-grove-deep"
                  >
                    {f.name.charAt(0)}
                  </span>
                  <h3 className="mt-6 font-display text-title text-ink">
                    {f.name}
                  </h3>
                  <p className="mt-1.5 label-mono">{f.role}</p>
                  {/* Both cards used to render the same sentence, which made the
                      two founders interchangeable on the one page asking an
                      institution to trust them. `focus` states what each one
                      answers for and nothing else, no biography, credentials,
                      employer, education or photograph is published, because
                      none of that has been verified. */}
                  <p className="mt-4 text-body leading-relaxed text-ink-soft measure">
                    {f.focus}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* 3, Mission */}
      <Section tone="band" backdrop="band" space={SECTION_BAND}>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_60%_at_50%_40%,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_70%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow index="03" className="justify-center">
                Mission
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-5 text-h2 text-inverse sm:text-h2-lg">
                Serve any organization where people rotate faster than{" "}
                <span className="text-grove-bright">knowledge transfers</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-7 max-w-2xl text-title-sm leading-relaxed text-inverse/70">
                We start with student clubs, where the reset is sharpest and the
                leadership changes every spring. The same record is built for
                boards, chapters, and committees, anywhere the calendar
                changes the people but not the work.
              </p>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 4, Where it stands */}
      <Section tone="canvas" backdrop="light">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-14">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow index="04">Where it stands</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-4 text-h2 text-ink sm:text-h2-lg">
                Where it{" "}
                <span className="text-grove">stands</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-lead leading-relaxed text-ink-soft measure">
                Tenure&rsquo;s first deployment is {site.pilot.season}, with
                Simon&rsquo;s Office of Student Engagement, the
                organizations it stewards and the office&rsquo;s own oversight
                seats, on one record. The first term is unpaid, and the operating
                detail is set out in full on the{" "}
                <a
                  href="/pilot"
                  className="font-medium text-accent-text underline underline-offset-4 hover:text-accent"
                >
                  deployment page
                </a>
                .
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-cloud p-7 shadow-[var(--shadow-sm)] sm:p-9">
              <p className="label-mono">Record of founding</p>
              <dl className="mt-6 divide-y divide-line">
                {RECORD.map((r) => (
                  <div
                    key={r.label}
                    className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <dt className="w-32 shrink-0 font-mono text-meta uppercase tracking-[0.14em] text-ink-faint">
                      {r.label}
                    </dt>
                    <dd className="min-w-0 break-words text-lead text-ink">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* /story closes on the people, so the ask is to talk to them. */}
      <CtaBand
        title={
          <>
            Two founders. <span className="text-grove-bright">One conversation.</span>
          </>
        }
        sub="You will not be routed through a qualification call. Ask for a demo and the people who built Tenure run it."
      />
    </>
  );
}
