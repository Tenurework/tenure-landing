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

/**
 * /pilot is an OPERATIONAL page, not a promotional one.
 *
 * Its own meta description (routes.ts) sells it as "scope, who does what,
 * onboarding inputs, support model and how success is measured" — which is the
 * checklist a director and a procurement reviewer actually arrive with. The
 * previous version answered none of it: five feature cards, an audience list, a
 * four-step story and a second call to action.
 *
 * So it now reads as what it honestly is: a written proposal. Every section
 * answers a buyer question, every limit that would surface in a security review
 * is stated here rather than left on /trust, and nothing on the page invents a
 * date, a price, a commitment or an agreement. The pilot is verbally agreed and
 * NOT contracted (claims register C-021) — that fact leads the page instead of
 * hiding at the bottom of it.
 */

/* ---- 01 · where this stands ---------------------------------------------- */
const STATUS: { k: string; v: string }[] = [
  {
    k: "Pilot status",
    v: "Planned. A proposal under discussion — not a project underway, and not a procurement that has completed.",
  },
  {
    k: "Agreement so far",
    v: "A conversation. No signed or written commitment exists, in either direction.",
  },
  {
    k: "Proposed scope",
    v: "Every organization the office stewards, and the office's own oversight seats above them, on one record.",
  },
  {
    k: "Start",
    v: "Not scheduled. A term is the unit of work; no date appears on this page because none has been agreed.",
  },
  {
    k: "Length",
    v: "One term, then a review against the measures at the foot of this page.",
  },
  {
    k: "Organizations enrolled",
    v: "None. No organization applies separately and none is enrolled on its own — if the office decides not to run this, nothing happens.",
  },
  {
    k: "Cost",
    v: "Not stated here. Pricing is per portfolio rather than per organization, and a figure for a pilot term is something we would put in writing with the office rather than publish first. A walkthrough costs nothing.",
  },
  {
    k: "Who would sign",
    v: "Nobody yet. Tenure is not an incorporated entity today, so there is no counterparty for a purchase order, and the privacy notice and terms are founder drafts that say so on their face.",
  },
];

/* ---- 02 · who takes part -------------------------------------------------- */
const PARTICIPANTS: { who: string; seat: string; ask: string }[] = [
  {
    who: "The office",
    seat: "Director and staff seats in the administration console",
    ask: "Decides whether the pilot happens at all, names one staff owner for the term, and says which approvals genuinely route through Tenure instead of email. Everything else follows from those three decisions.",
  },
  {
    who: "Each organization in scope",
    seat: "President, treasurer, and the other seats the organization actually runs on",
    ask: "Does its ordinary work inside Tenure for the term: spending, events, members, documents and decisions logged where they happen rather than reconstructed afterwards.",
  },
  {
    who: "Incoming officers",
    seat: "The same seat, held in shadow before the term begins",
    ask: "Reads the seat's record before taking it over. Read-only until the start date, then write access follows automatically — nobody hands over a password.",
  },
  {
    who: "Advisors attached to organizations",
    seat: "Advisor tier — one capability of the sixteen in the console",
    ask: "Watches what the office asks them to watch. Read the limit before provisioning them: an institution account can currently read every organization, not only the ones it advises.",
  },
  {
    who: "Us",
    seat: `${site.founders[0].name} and ${site.founders[1].name}`,
    ask: "Build the first version of the record with you, answer at one email address for the whole term, and own it when something does not work.",
  },
];

/* ---- 03 · who does what --------------------------------------------------- */
const TENURE_PROVIDES: { t: string; d: string }[] = [
  {
    t: "The setup itself",
    d: "We stand up the institution, the organizations, the seat map and the first version of the record with your staff in the room. Nobody is handed an empty account and a manual.",
  },
  {
    t: "A workspace per organization, and a console above them",
    d: "Finance, events, members, documents and decisions in one place per organization; sixteen named capabilities across three nested staff tiers for the office, where both allows and denials are written to the audit trail.",
  },
  {
    t: "Approvals that leave a record",
    d: "Two gates across seven request types. Each decision permanently records who decided, the seat they held at that moment, what the request moved from and to, and whether someone acted on another seat's behalf.",
  },
  {
    t: "The handoff packet",
    d: "Assembled from the record — seats, current and previous holders, open approvals, deadlines and budget position — rather than written by the outgoing officer. It contains no AI.",
  },
  {
    t: "Deadlines and reminders",
    d: "A deadline the office publishes once reaches every organization, and reminders fire from scheduled infrastructure without anyone opening the app. Delivery is in-app only: no email, no push notifications.",
  },
  {
    t: "Import, not data entry",
    d: "Budget spreadsheets are matched column by column however your treasurers named them, with a preview before anything is saved. Documents open inside Tenure rather than downloading to a laptop.",
  },
];

const OFFICE_PROVIDES: { t: string; d: string }[] = [
  {
    t: "A decision, and the authority behind it",
    d: "Somebody who can say yes for the office, and route it through whatever security review and procurement your institution requires. /trust is written for exactly that review — send it before you send us.",
  },
  {
    t: "One named owner for the term",
    d: "A staff member we can ask questions and who can answer for the office. Without a name, a pilot stalls in its second week and nobody notices until the term is half gone.",
  },
  {
    t: "The roster",
    d: "Which organizations are in scope, what seats each one carries, and who holds them right now.",
  },
  {
    t: "The material that already exists",
    d: "The drives, folders, budget spreadsheets and handbooks the office and its organizations already keep. In whatever shape they are in — cleaning them up first is our job, not yours.",
  },
  {
    t: "A decision about approvals",
    d: "Which request types actually run through Tenure this term. Approvals that stay in email do not appear in the record, and that is a choice the office makes deliberately rather than a defect it discovers later.",
  },
  {
    t: "A judgement about data",
    d: "Which records should not go into a pilot-grade system yet. We would rather you hold something back than find out at the security review that you should have.",
  },
  {
    t: "Officers who use it",
    d: "The record fills because the work happens inside it. If a board keeps running on a group chat and a shared drive, the next board inherits a group chat and a shared drive.",
  },
];

/* ---- 04 · onboarding inputs ----------------------------------------------- */
const INPUTS: { item: string; shape: string; who: string }[] = [
  {
    item: "A roster of organizations and seats",
    shape:
      "A spreadsheet, an export from wherever you keep it, or an hour on a call with someone who knows it by heart.",
    who: "Office staff supply it. We build the seat map from it.",
  },
  {
    item: "Current officers and how to reach them",
    shape: "Names, the seat each one holds, institutional email.",
    who: "Office staff supply it. Accounts are created by us in advance, against a named person — there is no self-service signup.",
  },
  {
    item: "Each organization's existing drive or folder",
    shape:
      "A folder export, a shared-drive link handed over with the organization's agreement, or files dragged in by the officers who own them.",
    who: "Whoever holds it today exports it. We do the first import alongside them rather than sending instructions.",
  },
  {
    item: "Budget spreadsheets",
    shape: "Excel or CSV, columns named however the treasurer named them, subtotal rows and all.",
    who: "Officers upload. The importer matches the columns and shows a preview before anything is saved.",
  },
  {
    item: "The office's handbooks and policy documents",
    shape: "PDF or Word.",
    who: "Office staff supply. They are stored and findable by title and description — file contents are not indexed, and the assistant cannot answer policy questions out of them.",
  },
  {
    item: "The deadline calendar the office already publishes",
    shape: "The dates, and what each one is for.",
    who: "Office staff supply. Published once, then every organization sees it and each person is reminded once.",
  },
];

/* ---- 05 · sequence -------------------------------------------------------- */
const STEPS: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "Decide, and write it down",
    d: "Before anything is built: the office decides whether to run this, and the scope, the organizations, the data, the support expectations and the measures below go into one document both sides sign. Nothing on this page is a substitute for that document.",
  },
  {
    n: "02",
    t: "Stand up the record together",
    d: "We build the institution, the organizations and the seat map from your roster, import the drives and budget spreadsheets with the people who own them, and load the office's deadlines. This is the heaviest stretch for your staff, and the part we do most of.",
  },
  {
    n: "03",
    t: "Run the term in it",
    d: "Spending, events, members, documents and the approvals the office chose to route here happen in Tenure. What is not done in Tenure is not in the record — that is the mechanism, and it is also the risk.",
  },
  {
    n: "04",
    t: "Rotate",
    d: "As officers turn over, the incoming holder joins the seat in shadow before their term starts and reads it; the outgoing holder moves to alumni, keeping the record and losing the access. The handoff packet is assembled from what is there.",
  },
  {
    n: "05",
    t: "Review against the measures",
    d: "At the end of the term we go through the counts below with the office, and the office decides whether anything continues. If the numbers are bad they are still the numbers, and we bring them either way.",
  },
];

/* ---- 06 · support --------------------------------------------------------- */
const SUPPORT: string[] = [
  "Onboarding is done with you, live. It is not handed over as documentation and a login.",
  "A bug goes to the same inbox as everything else, and is answered by one of the two people who will fix it.",
  "What the office needs during the term is what we work on during the term, ahead of our own roadmap.",
  "The product is not a prototype: 132 end-to-end tests and 292 unit tests run against a real database on every build.",
  "Anything above that matters to you belongs in the written scope. A sentence on a marketing page is not a commitment, and we will not pretend otherwise.",
];

/* ---- 07 · data, approvals and limits -------------------------------------- */
const HANDLING: { t: string; d: string; limit?: string }[] = [
  {
    t: "Who can read what",
    d: "Access attaches to the seat, not the person: shadow before the term, active during it, alumni after. Institution staff work through a console of sixteen capabilities across three strictly nested tiers, and the tier decides which actions are even offered.",
    limit:
      "Any account with an institution membership can currently read every organization in the portfolio. An advisor relation exists but does not narrow reads, so provisioning nineteen advisors means nineteen people who can open every organization's budget, roster and documents. If you need advisors scoped to their own organizations, that work is not done.",
  },
  {
    t: "How approvals are decided",
    d: "Two gates across seven request types. Every step permanently records the deciding seat, what the request moved from and to, and whether a backup approver acted on another seat's behalf. Requests show how long they have sat in a gate, flagged at three days and again at six.",
    limit:
      "A president's own request skips the first gate, and nothing prevents a person who holds both an institution membership and an active seat from submitting a request and then approving it. If your finance policy requires that control enforced by the system, Tenure does not have it today.",
  },
  {
    t: "What gets written down",
    d: "Privileged actions append an audit row, and refusals are recorded alongside successes — which is what lets an office prove that something did not happen. Rows are only ever created: no update, delete or upsert against the audit table exists anywhere in the application.",
    limit:
      "Coverage is 49 of 63 server actions. Messaging, activity-feed, profile and resource writes append nothing, and AI or search queries are not recorded at all. The table carries no hash, signature or checksum column — append-only is enforced by the application, not by cryptography or write-once storage.",
  },
  {
    t: "Where the record lives",
    d: "The database and the document store are encrypted at rest, and no document is served from a raw URL: every download is a signed link that expires in ten minutes.",
    limit:
      "Encryption keys are provider-managed. There is no customer-managed key and no bring-your-own-key option.",
  },
  {
    t: "What leaves our infrastructure",
    d: "Tenure AI assembles its corpus under the asking person's own permissions before anything is ranked, then sends the retrieved record text to Anthropic's API to compose the answer. Anthropic is the only model subprocessor, and no records are used to train any model by us.",
    limit:
      "One platform-wide key serves every tenant: no per-tenant key, no per-tenant quota and no per-tenant opt-out. Retrieval is keyword matching over five record kinds — knowledge cards, document titles and descriptions, approvals, events and organization records. Document file contents, finance figures and people records are not in the corpus, so those questions cannot be answered by the assistant.",
  },
  {
    t: "Signing in",
    d: "Accounts are created by us in advance against a named person. There is no public registration and no self-service signup.",
    limit:
      "This is the weakest control in the system, and /trust states it in full rather than burying it. Ask us for the current mechanism directly, and treat it as a reason to keep genuinely sensitive records out of a pilot until institutional sign-on lands.",
  },
  {
    t: "What connects to what",
    d: "Files, decisions and documents live in Tenure itself. The one link outward is a signed calendar feed that Outlook, Google Calendar and Apple Calendar can subscribe to, showing each person only what they can already see.",
    limit:
      "There are no connectors to third-party systems, no public API and no webhooks. The calendar feed is one-way: Tenure fills your calendar and never reads it back.",
  },
  {
    t: "What happens at the end of the term",
    d: "The record stays, and history is not deleted by design: a seat carrying assignments, holdings or knowledge refuses deletion and is retired instead, and an outgoing officer is revoked to alumni rather than removed.",
    limit:
      "There is no self-service bulk export. Export and deletion requests are handled by us, by hand, on request — a two-founder answer that you should weigh before relying on it, and one worth writing into the agreement rather than assuming.",
  },
];

/* ---- 08 · measures -------------------------------------------------------- */
const MEASURES: { t: string; d: string }[] = [
  {
    t: "Every organization in scope has a seat map that is actually populated",
    d: "Counted as: seats created and held by named people, per organization, before the first rotation. If the roster never gets built, this fails in public and early.",
  },
  {
    t: "Incoming officers are in the seat before their term starts",
    d: "Counted as: the share of rotating seats carrying a named shadow holder who has opened the record before the handover date.",
  },
  {
    t: "The approvals the office agreed to route here are decided here",
    d: "Counted as: approval decisions with a recorded deciding seat, against the volume the office expected for the term. The approvals that stayed in email are the measure of what did not work.",
  },
  {
    t: "Decisions do not sit",
    d: "Counted as: the share of approvals cleared before the three-day flag, using the flags the product already applies at three and six days.",
  },
  {
    t: "The handoff happens without anyone writing a handoff document",
    d: "Counted as: packets opened by incoming officers — and, separately, whether an outgoing officer still felt they had to write a document anyway. The second half is a conversation, not a number, and we would report it as one.",
  },
  {
    t: "The office would run it again",
    d: "Counted as: the office's own written answer at the end of the term, whatever that answer is.",
  },
];

/* ---- 09 · the decision ---------------------------------------------------- */
const DECISION: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "A walkthrough",
    d: "On one of your own organizations and its real handoff, not a canned demo.",
  },
  {
    n: "02",
    t: "A written scope",
    d: "Organizations, data, the dates you set, support expectations and the measures above, in one document.",
  },
  {
    n: "03",
    t: "Your review",
    d: "Security and procurement, with /trust as the input. Ask us for whatever it does not answer.",
  },
  {
    n: "04",
    t: "A decision",
    d: "Which can be no. Nothing on this page enrols anyone, and nothing here has to be undone.",
  },
];

function SectionIntro({
  index,
  eyebrow,
  title,
  children,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="max-w-2xl">
      <Reveal>
        <Eyebrow index={index}>{eyebrow}</Eyebrow>
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-text sm:text-[2.4rem] lg:text-[2.7rem]">
          {title}
        </h2>
      </Reveal>
      {children && (
        <Reveal delay={0.12}>
          <div className="mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
            {children}
          </div>
        </Reveal>
      )}
    </div>
  );
}

function ProvidesCard({
  heading,
  sub,
  items,
}: {
  heading: string;
  sub: string;
  items: { t: string; d: string }[];
}) {
  return (
    <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-sm)] sm:p-8">
      <h3 className="font-display text-[1.35rem] font-semibold tracking-tight text-text">
        {heading}
      </h3>
      <p className="mt-2 text-[0.92rem] leading-relaxed text-text-muted">{sub}</p>
      <dl className="mt-7 space-y-6 border-t border-line pt-7">
        {items.map((item) => (
          <div key={item.t}>
            <dt className="text-[1rem] font-medium text-text">{item.t}</dt>
            <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-text-secondary">
              {item.d}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

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
            We are proposing a {site.pilot.season} pilot with{" "}
            {site.origin.office}, covering the organizations it stewards and the
            office&rsquo;s own administrators, so the record below and the
            oversight above run on one system. Scope and timing are proposed, not contracted. What
            follows is the operational detail rather than the pitch: who does
            what, what you would hand over, what does not work yet, and what we
            would be judged on.
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

      {/* 01 — where this stands */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <SectionIntro
            index="01"
            eyebrow="Status"
            title={
              <>
                Planned. <span className="text-grove">Nothing is signed</span>.
              </>
            }
          >
            <p>
              This is a proposal we have talked through with the office. There is
              no agreement, no purchase order, no start date and no enrolled
              organization behind it. If you came here to find out whether your
              office has already committed to something &mdash; it has not, and
              this page is the whole basis on which it might.
            </p>
          </SectionIntro>

          <dl className="mt-14 grid gap-x-12 border-t border-line sm:grid-cols-2">
            {STATUS.map((row, i) => (
              <Reveal
                key={row.k}
                delay={(i % 2) * 0.06}
                className="border-b border-line py-5"
              >
                <dt className="label-mono">{row.k}</dt>
                <dd className="mt-2 text-[1.02rem] leading-relaxed text-text-secondary">
                  {row.v}
                </dd>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* 02 — who takes part */}
      <section className="relative border-t border-line bg-surface-subtle py-24 sm:py-32">
        <Container>
          <SectionIntro
            index="02"
            eyebrow="Who takes part"
            title={
              <>
                Both sides of the{" "}
                <span className="text-grove">same record</span>.
              </>
            }
          >
            <p>
              The proposed scope is the whole portfolio at once: every
              organization the office stewards, and the office&rsquo;s own seats
              alongside them. Each row below is a real seat with a real
              obligation attached to it.
            </p>
          </SectionIntro>

          <ul className="mt-14 border-t border-line">
            {PARTICIPANTS.map((p, i) => (
              <Reveal
                as="li"
                key={p.who}
                delay={Math.min(i, 3) * 0.05}
                className="grid gap-3 border-b border-line py-7 lg:grid-cols-[0.85fr_1.55fr] lg:gap-12"
              >
                <div>
                  <h3 className="font-display text-[1.2rem] font-semibold tracking-tight text-text">
                    {p.who}
                  </h3>
                  <p className="mt-1.5 font-mono text-[0.78rem] leading-relaxed text-text-muted">
                    {p.seat}
                  </p>
                </div>
                <p className="text-[0.98rem] leading-relaxed text-text-secondary">
                  {p.ask}
                </p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 03 — who does what */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <SectionIntro
            index="03"
            eyebrow="Who does what"
            title={
              <>
                Two columns, so nobody{" "}
                <span className="text-grove">discovers this later</span>.
              </>
            }
          >
            <p>
              A pilot fails on the work nobody agreed to do. Here is the split we
              would propose, and it belongs in the written scope before the term
              rather than in an email during it.
            </p>
          </SectionIntro>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <Reveal className="h-full">
              <ProvidesCard
                heading="Tenure provides"
                sub="Us, and the product as it is actually built today."
                items={TENURE_PROVIDES}
              />
            </Reveal>
            <Reveal delay={0.08} className="h-full">
              <ProvidesCard
                heading="The office provides"
                sub="The parts nobody outside your institution can do for you."
                items={OFFICE_PROVIDES}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 04 — onboarding inputs */}
      <section className="relative border-t border-line bg-surface-subtle py-24 sm:py-32">
        <Container>
          <SectionIntro
            index="04"
            eyebrow="Onboarding inputs"
            title={
              <>
                What you would actually{" "}
                <span className="text-grove">hand over</span>.
              </>
            }
          >
            <p>
              Concretely, and in the shape you already have it. Nothing here has
              to be tidied up first: the first pass over the mess is the work we
              are offering to do.
            </p>
          </SectionIntro>

          <ul className="mt-14 border-t border-line">
            {INPUTS.map((x, i) => (
              <Reveal
                as="li"
                key={x.item}
                delay={Math.min(i, 3) * 0.05}
                className="grid gap-4 border-b border-line py-7 lg:grid-cols-[1fr_1.5fr] lg:gap-12"
              >
                <h3 className="font-display text-[1.12rem] font-semibold leading-snug tracking-tight text-text">
                  {x.item}
                </h3>
                <div>
                  <p className="text-[0.95rem] leading-relaxed text-text-secondary">
                    <span className="font-medium text-text">Shape: </span>
                    {x.shape}
                  </p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-text-secondary">
                    <span className="font-medium text-text">
                      Who does the work:{" "}
                    </span>
                    {x.who}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 05 — the sequence */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <SectionIntro
            index="05"
            eyebrow="Implementation"
            title={
              <>
                The sequence. <span className="text-grove">Not a schedule</span>.
              </>
            }
          >
            <p>
              There <em>is</em> a new system to learn. It is where the work
              happens, or the record does not fill, and no page on this site is
              going to tell you otherwise. What there is not is a migration
              project: we do the first import from your existing drives with
              you, and after that the record fills as officers do the work they
              were already doing.
            </p>
            <p className="mt-4">
              The five moves below are an order of operations, not dates. No
              calendar exists yet, and we are not going to invent one on a public
              page.
            </p>
          </SectionIntro>

          <div className="relative mt-16">
            {/* connector rail (desktop) */}
            <div
              aria-hidden
              className="absolute left-0 right-0 top-6 hidden h-px bg-gradient-to-r from-grove/20 via-grove/40 to-grove lg:block"
            />
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.n} delay={i * 0.07} className="relative">
                  <span className="relative z-10 flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-accent-subtle font-mono text-sm text-accent-text">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-lg font-medium text-text">{s.t}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-text-secondary">
                    {s.d}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* 06 — support model */}
      <section className="relative border-t border-line bg-surface-subtle py-24 sm:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
            <div>
              <SectionIntro
                index="06"
                eyebrow="Support"
                title={
                  <>
                    Two founders.{" "}
                    <span className="text-grove">No support desk</span>.
                  </>
                }
              >
                <p>
                  You would work directly with {site.founders[0].name} and{" "}
                  {site.founders[1].name} for the whole pilot. One address
                  reaches both of us, and we answer the same day, most days
                  &mdash; which is a description of how we work, not a service
                  level anyone has agreed to.
                </p>
                <p className="mt-4">
                  What that buys you: the people who wrote the code are the
                  people who answer, and what your office needs shapes what gets
                  built next. What it costs you: there is no ticket queue, no
                  on-call rotation and no second line behind us. If a committed
                  response time or a named escalation contact is a procurement
                  requirement, it has to be negotiated into an agreement &mdash;
                  it cannot be read off a web page.
                </p>
              </SectionIntro>
            </div>

            <ul className="self-center border-t border-line">
              {SUPPORT.map((s, i) => (
                <Reveal
                  as="li"
                  key={s}
                  delay={Math.min(i, 3) * 0.05}
                  className="flex items-start gap-4 border-b border-line py-5"
                >
                  <span
                    aria-hidden
                    className="mt-[0.5rem] h-2.5 w-2.5 shrink-0 rounded-[3px] bg-accent"
                  />
                  <span className="text-[1rem] leading-relaxed text-text-secondary">
                    {s}
                  </span>
                </Reveal>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 07 — data handling, approvals, limits */}
      <section className="relative border-t border-line py-24 sm:py-32">
        <Container>
          <SectionIntro
            index="07"
            eyebrow="Data and approvals"
            title={
              <>
                What happens to the record &mdash; and what{" "}
                <span className="text-grove">does not work yet</span>.
              </>
            }
          >
            <p>
              The parts an office and its security reviewer should hear from us
              before they hear from anyone else.{" "}
              <a
                href="/trust"
                className="text-accent-text underline underline-offset-4 hover:text-accent"
              >
                /trust
              </a>{" "}
              carries the full list with its sources; these are the entries a
              pilot decision actually turns on.
            </p>
          </SectionIntro>

          <ul className="mt-14 grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {HANDLING.map((h, i) => (
              <Reveal as="li" key={h.t} delay={(i % 2) * 0.06}>
                <h3 className="font-display text-[1.1rem] font-semibold tracking-tight text-text">
                  {h.t}
                </h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-text-secondary">
                  {h.d}
                </p>
                {h.limit && (
                  <p className="mt-3 border-l-2 border-border-strong pl-4 text-[0.9rem] leading-relaxed text-text-muted">
                    <span className="font-medium text-text-secondary">
                      Limit:{" "}
                    </span>
                    {h.limit}
                  </p>
                )}
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* 08 — measures */}
      <section className="relative border-t border-line bg-surface-subtle py-24 sm:py-32">
        <Container>
          <SectionIntro
            index="08"
            eyebrow="How success is measured"
            title={
              <>
                Targets we would accept{" "}
                <span className="text-grove">being judged on</span>.
              </>
            }
          >
            <p>
              Every line below is a target, not a result. No pilot has run,
              nothing here has been measured, and any outcome number on this page
              would be invented. Each one is countable from the record itself,
              which means each one can fail visibly &mdash; that is the point.
              They would be agreed and written down before the term starts.
            </p>
          </SectionIntro>

          <ul className="mt-14 grid gap-6 sm:grid-cols-2">
            {MEASURES.map((m, i) => (
              <Reveal as="li" key={m.t} delay={(i % 2) * 0.06} className="h-full">
                <div className="h-full rounded-2xl border border-line bg-surface p-6 shadow-[var(--shadow-sm)]">
                  <span className="inline-flex items-center rounded-lg border border-accent/25 bg-accent-subtle px-2.5 py-1 font-mono text-[0.68rem] font-medium uppercase tracking-[0.08em] text-accent-text">
                    Target
                  </span>
                  <h3 className="mt-4 text-[1.05rem] font-medium leading-snug text-text">
                    {m.t}
                  </h3>
                  <p className="mt-2 text-[0.94rem] leading-relaxed text-text-secondary">
                    {m.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </ul>

          <Reveal delay={0.1}>
            <p className="mt-10 max-w-2xl text-[0.98rem] leading-relaxed text-text-muted">
              A measure that cannot be counted out of the record does not go on
              the list. If we miss one, you get the number rather than the
              narrative.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* 09 — the decision */}
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
              <div className="relative">
                <div className="max-w-2xl">
                  <p className="label-mono text-grove-bright">09 · The decision</p>
                  <h2 className="font-display mt-5 text-[2rem] font-semibold leading-[1.1] tracking-[-0.03em] text-inverse sm:text-[2.4rem]">
                    The next step is a{" "}
                    <span className="text-grove-bright">conversation</span>, and
                    then a document.
                  </h2>
                  <p className="mt-6 text-lg leading-relaxed text-inverse/70">
                    There is nothing to sign on this page and no button that
                    enrols anyone. If the office decides not to run a pilot, the
                    honest cost of having read this far is an hour.
                  </p>
                </div>

                <ol className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                  {DECISION.map((d) => (
                    <li key={d.n}>
                      <span className="font-mono text-[0.78rem] text-grove-bright">
                        {d.n}
                      </span>
                      <h3 className="mt-2 text-[1.05rem] font-medium text-inverse">
                        {d.t}
                      </h3>
                      <p className="mt-1.5 text-[0.93rem] leading-relaxed text-inverse/70">
                        {d.d}
                      </p>
                    </li>
                  ))}
                </ol>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <ContactSales size="lg" arrow />
                  <a
                    href={`mailto:${site.email}?subject=Tenure%20pilot`}
                    className="text-[0.97rem] text-inverse/70 underline-offset-4 transition-colors hover:text-inverse hover:underline"
                  >
                    or put a question in writing
                  </a>
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
