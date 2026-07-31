import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { site } from "@/lib/site";

export const metadata = {
  title: "Story",
  description:
    "How Tenure began at Simon Business School, and why institutional memory shouldn't reset every time a student organization changes hands.",
};

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
    value: `${site.pilot.season} · ${site.pilot.scope}`,
  },
  { label: "Partner", value: site.origin.partner },
  { label: "Supported by", value: "Startup Wednesday" },
];

export default function StoryPage() {
  return (
    <>
      <PageHeader
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
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="01">Why Tenure exists</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                Every fall, the same{" "}
                <span className="text-grove">cold start</span>.
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-7 text-lg leading-relaxed text-ink-soft">
                At Simon, we watched it up close. A capable board spends a year
                building real things, sponsor relationships, an events
                playbook, a budget that finally works, then hands all of
                it off in a shared drive and a single coffee chat. Whatever
                doesn&rsquo;t fit in that hour leaves with them.
              </p>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                So the next team starts from memory and guesswork. Sponsor
                contacts go cold because no one knew they existed. The same
                mistakes get repeated, not from carelessness, but because
                the lesson left with the person who learned it. An organization
                can be years old and still wake up every fall with no record of
                itself.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-lg leading-relaxed text-ink-soft">
                None of that is a people problem. It&rsquo;s a memory problem.
                Institutional knowledge shouldn&rsquo;t depend on whether one
                person remembered to write it down on the way out. It
                should accumulate on its own, as the work happens, and stay with
                the seat.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <blockquote className="mt-10 border-l-2 border-grove pl-6 font-display text-2xl font-semibold leading-snug tracking-[-0.02em] text-ink sm:text-[1.75rem]">
                The role should keep what it knows, even after the people who
                built it have graduated.
              </blockquote>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 2, Founders */}
      <section className="relative border-t border-line bg-sand py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="02">Founders</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                The people building the{" "}
                <span className="text-grove">record</span>.
              </h2>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2">
            {site.founders.map((f, i) => (
              <Reveal key={f.name} delay={i * 0.08}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-cloud p-7 shadow-[0_1px_2px_rgba(12,30,51,0.05)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-24px_rgba(12,30,51,0.25)]">
                  <span
                    aria-hidden
                    className="flex h-12 w-12 items-center justify-center rounded-xl bg-grove-soft font-display text-lg font-semibold text-grove-deep"
                  >
                    {f.name.charAt(0)}
                  </span>
                  <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                    {f.name}
                  </h3>
                  <p className="mt-1.5 label-mono">{f.role}</p>
                  <p className="mt-4 text-[0.97rem] leading-relaxed text-ink-soft">
                    Co-founder. Building Tenure at {site.origin.school}.
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 3, Mission */}
      <section className="relative overflow-hidden border-t border-line-dark bg-ink py-24 text-paper sm:py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background:radial-gradient(55%_60%_at_50%_40%,rgba(37,169,109,0.16),transparent_70%)]"
        />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center">
            <Reveal>
              <Eyebrow index="03" className="justify-center">
                Mission
              </Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2.2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-paper sm:text-[2.8rem] lg:text-[3.1rem]">
                Serve any organization where people rotate faster than{" "}
                <span className="text-grove-bright">knowledge transfers</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-paper/70">
                We start with student clubs, where the reset is sharpest and the
                leadership changes every spring. The same record is built for
                boards, chapters, and committees, anywhere the calendar
                changes the people but not the work.
              </p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 4, Where it stands */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow index="04">Where it stands</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                Early, and honest{" "}
                <span className="text-grove">about it</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 text-lg leading-relaxed text-ink-soft">
                Here is exactly where things stand, and where they go this
                fall. Every organization Simon&rsquo;s Office of Student
                Engagement stewards puts Tenure to work, and so does the office
                itself.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-cloud p-7 shadow-[0_1px_2px_rgba(12,30,51,0.05)] sm:p-9">
              <p className="label-mono">Record of founding</p>
              <dl className="mt-6 divide-y divide-line">
                {RECORD.map((r) => (
                  <div
                    key={r.label}
                    className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-baseline sm:gap-6"
                  >
                    <dt className="w-32 shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ink-faint">
                      {r.label}
                    </dt>
                    <dd className="text-[1.02rem] text-ink">{r.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
