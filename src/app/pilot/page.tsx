import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { ContactSales } from "@/components/ui/ContactSales";
import { PageHeader } from "@/components/site/PageHeader";
import { CtaBand } from "@/components/site/CtaBand";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/pilot");

/* ---- icons (geometric, currentColor, no full circles) -------------------- */
function FolderIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </svg>
  );
}
function SeatsIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="M18.5 15l.6 1.9 1.9.6-1.9.6-.6 1.9-.6-1.9-1.9-.6 1.9-.6.6-1.9Z" />
    </svg>
  );
}
function ConsoleIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18M9 9v11" />
      <path d="M12.5 13h5.5M12.5 16h3" />
    </svg>
  );
}
function LineIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9l-4 3v-3H6a2 2 0 0 1-2-2V6Z" />
      <path d="M8 9h8M8 12h5" />
    </svg>
  );
}

const INCLUDED: { icon: ReactNode; t: string; d: string }[] = [
  {
    icon: <FolderIcon />,
    t: "Hands-on setup from your existing folder",
    d: "We start from what you already have, the shared drive, the half-finished handoff doc, the contacts buried in someone's inbox, and stand up your first system of record together.",
  },
  {
    icon: <SeatsIcon />,
    t: "A workspace for every role",
    d: "President, treasurer, sponsorship, events: each seat gets its own space where money, decisions, members, and documents are captured as the work actually happens.",
  },
  {
    icon: <SparkIcon />,
    t: "A handoff packet that's already written",
    d: "When leadership turns over, the incoming officer opens a packet assembled from the record itself, who held each seat, how to reach them, what's pending, where the budget stands, and asks Tenure AI on top of it.",
  },
  {
    icon: <ConsoleIcon />,
    t: "A console for the office itself",
    d: "One place for every organization OSE stewards: what's pending, what's vacant, what got denied. Three staff levels, so an advisor sees advising and a director sees everything, and an override lands on the record like every other decision.",
  },
  {
    icon: <LineIcon />,
    t: "A direct line to the founders",
    d: `You work directly with ${site.founders[0].name} and ${site.founders[1].name} for the whole pilot. What your board needs shapes what Tenure becomes.`,
  },
];

const WHO: string[] = [
  "Leadership that turns over every year or semester.",
  "An existing drive or folder of knowledge that's worth keeping.",
  "A board that wants the next one to start ahead, not from zero.",
  "And the office above it, approving, funding, and answering for all of it.",
];

const STEPS: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "Onboard the knowledge that exists",
    d: "We bring in each org's current drive and folders, and OSE's own oversight seats alongside them, and organize the first version of the record around the roles people actually run on.",
  },
  {
    n: "02",
    t: "Run the term in Tenure",
    d: "Through the fall, finances, events, members, and decisions get logged in context, and the approvals that used to sit in email run through the same record: one system instead of a dozen scattered tools.",
  },
  {
    n: "03",
    t: "Hand off cleanly at term's end",
    d: "When leaders rotate out, Tenure assembles an organized handoff instead of a cold start. The role keeps everything it learned.",
  },
  {
    n: "04",
    t: "The next board starts on day one",
    d: "The incoming team opens a full history and a Tenure AI copilot that answers from the seat, productive from the very first meeting.",
  },
];

export default function PilotPage() {
  return (
    <>
      <PageHeader
        eyebrow="Fall 2026 pilot"
        title={
          <>
            Every org. And the office that{" "}
            <span className="text-grove">stewards them</span>.
          </>
        }
        intro={
          <>
            We are planning a {site.pilot.season} pilot with{" "}
            {site.origin.office}, covering the organizations it stewards and the
            office&rsquo;s own administrators, so the record below and the
            oversight above run on one system. Scope and timing are proposed,
            not contracted.
          </>
        }
      >
        <ContactSales size="lg" arrow />
        <Button
          href={`mailto:${site.email}?subject=Tenure%20pilot`}
          variant="secondary"
          size="lg"
        >
          Ask about the pilot
        </Button>
      </PageHeader>

      {/* 1, What the pilot includes */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="01">What&rsquo;s included</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                What every org gets. And what the{" "}
                <span className="text-grove">office gets</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                One term, hands-on the whole way. No waiting list, no
                application, and no placeholder accounts. If OSE stewards your
                organization, you&rsquo;re in. Here&rsquo;s what lands on both
                sides of the record.
              </p>
            </Reveal>
          </div>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {INCLUDED.map((f, i) => (
              <Reveal as="li" key={f.t} delay={(i % 2) * 0.06} className="h-full">
                <div className="group h-full rounded-2xl border border-line bg-cloud p-6 shadow-[var(--shadow-sm)] transition hover:-translate-y-0.5 hover:shadow-[var(--shadow-md)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-grove-soft text-grove">
                    {f.icon}
                  </div>
                  <h3 className="mt-5 text-lg font-medium text-ink">{f.t}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">
                    {f.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 2, Who it's for */}
      <section className="relative border-t border-line bg-sand py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="02">Who it&rsquo;s for</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                Both sides of the{" "}
                <span className="text-grove">same record</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                The pilot runs the whole portfolio at once, every organization
                the office stewards, and the office&rsquo;s own seats alongside
                them. Odds are this already sounds like you.
              </p>
            </Reveal>
          </div>

          <ul className="mt-12 max-w-3xl border-t border-line">
            {WHO.map((w, i) => (
              <Reveal
                as="li"
                key={w}
                delay={i * 0.06}
                className="flex items-start gap-4 border-b border-line py-5"
              >
                <span
                  aria-hidden
                  className="mt-[0.5rem] h-2.5 w-2.5 shrink-0 rounded-[3px] bg-grove"
                />
                <span className="text-[1.05rem] leading-relaxed text-ink">
                  {w}
                </span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 3, How it runs */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow index="03">How it runs</Eyebrow>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
                How the year{" "}
                <span className="text-grove">takes shape</span>.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft">
                No big migration and no new tool to learn. The pilot runs in four
                moves across a single term.
              </p>
            </Reveal>
          </div>

          <div className="relative mt-16">
            {/* connector rail (desktop) */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-grove/20 via-grove/40 to-grove lg:block"
            />
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.n} delay={i * 0.08} className="relative">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-grove-soft font-mono text-sm text-grove">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-lg font-medium text-ink">{s.t}</h3>
                  <p className="mt-2 text-[0.97rem] leading-relaxed text-ink-soft">
                    {s.d}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 4, For institutions */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl bg-band p-8 text-inverse sm:p-12">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_70%_at_85%_15%,color-mix(in_oklab,var(--accent)_20%,transparent),transparent_65%)]"
              />
              {/* angular accents */}
              <div
                aria-hidden
                className="pointer-events-none absolute right-[8%] top-[18%] hidden h-6 w-6 rotate-[18deg] rounded-[6px] bg-brand-coral/70 sm:block"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute right-[16%] bottom-[20%] hidden h-5 w-5 rotate-45 rounded-[4px] bg-brand-violet/70 sm:block"
              />
              <div className="relative max-w-2xl">
                <p className="label-mono text-grove-bright">For institutions</p>
                <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-inverse sm:text-[2.5rem]">
                  Support every org you{" "}
                  <span className="text-grove-bright">steward</span>.
                </h2>
                <p className="mt-6 text-lg leading-relaxed text-inverse/70">
                  The proposed scope puts the office on Tenure too, not just the
                  organizations it stewards &mdash; with its own seats for
                  approvals, spending and compliance. If your office stewards
                  dozens of organizations, Tenure gives each one a memory that
                  survives turnover, so the knowledge you fund every year stops
                  walking out the door with the students who built it.
                </p>
                <div className="mt-9">
                  <ContactSales size="lg" arrow />
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
