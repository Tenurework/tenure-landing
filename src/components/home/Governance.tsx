import type { ReactNode } from "react";
import { Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { AuditTrailDemo } from "@/components/visuals/AuditTrailDemo";
import { cn } from "@/lib/cn";

type Pillar = { title: string; body: string; proof: string; icon: ReactNode };

const svg = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className: "h-[22px] w-[22px]",
  "aria-hidden": true,
};

const PILLARS: Pillar[] = [
  {
    title: "Oversight without micromanagement",
    body: "Two-gate approval chains routed by seat. Every decision permanently records who decided, the seat they held at that moment, what it moved from and to, and when a backup approver acted on someone's behalf.",
    proof: "event · budget · vendor · comms · document · roster · exception",
    icon: <svg {...svg}><path d="M12 3l2 4 4 .5-3 3 .8 4L12 16.5 8.2 14.5 9 10.5 6 7.5 10 7z" /><path d="M6 20h12" /></svg>,
  },
  {
    title: "Access follows the seat",
    body: "Access attaches to the seat, not the person. Incoming officers get read-only access before their term starts; outgoing ones keep the record and lose the keys. No orphaned access.",
    proof: "SHADOW → ACTIVE → ALUMNI",
    icon: <svg {...svg}><circle cx="8" cy="8" r="3.2" /><path d="M10.3 10.3 20 20M17 17l2-2M14 14l2-2" /></svg>,
  },
  {
    title: "Every action, on the record",
    body: "An append-only audit trail captures every allow and every deny. The denials are what let you prove nobody did something. Rows are only ever created, never updated or deleted.",
    proof: "allow / deny · create-only · 35 write sites",
    icon: <svg {...svg}><rect x="4" y="4" width="16" height="16" rx="2.5" /><path d="M8 9h8M8 13h8M8 17h5" /></svg>,
  },
  {
    title: "Your data. Your eyes only.",
    body: "Multi-tenant isolation enforced at the query layer, not by convention. The tenant filter is attached to the database client itself, so no query can decline it, and every table in the schema must be classified before it can ship.",
    proof: "tenant-isolated · enforced in production · verified in CI",
    icon: <svg {...svg}><path d="M12 3l8 3v6c0 4-3.2 6.8-8 9-4.8-2.2-8-5-8-9V6z" /><path d="M9.3 12l1.9 1.9L15 10" /></svg>,
  },
];

const OWNERSHIP = [
  "You own your records. They stay with the seat when a person leaves: access is revoked, history is not.",
  "Isolated per organization. Every query carries the tenant context, or it fails.",
  "Tenure AI answers only from your own record. It never trains a shared model.",
];

const CONFIDENCE = [
  "Encrypted at rest (database, documents, images)",
  "Multi-tenant isolation by design",
  "SOC 2 roadmap, in progress",
  "Every action append-only & auditable",
];

function BoundaryDiagram() {
  return (
    <svg viewBox="0 0 320 200" className="h-auto w-full" role="img" aria-label="Tenant isolation boundary diagram">
      {/* outer tenant boundary */}
      <rect x="10" y="18" width="220" height="168" rx="18" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="6 5" />
      <text x="24" y="40" fontFamily="var(--font-mono)" fontSize="9" fill="var(--accent-text)" letterSpacing="1">YOUR ORGANIZATION · TENANT BOUNDARY</text>
      {/* inner units */}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={28 + i * 66} y={62} width="54" height="42" rx="10" fill="var(--accent-subtle)" stroke="var(--accent)" strokeWidth="1.2" />
          <rect x={38 + i * 66} y={112} width="34" height="8" rx="4" fill="var(--border-strong)" />
        </g>
      ))}
      <text x="120" y="150" textAnchor="middle" fontFamily="var(--font-general)" fontSize="10" fill="var(--text-secondary)">teams · clubs · offices</text>
      {/* gated arch to the outside */}
      <path d="M230 100 h34" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="4 4" />
      <rect x="262" y="80" width="48" height="40" rx="12" fill="var(--surface)" stroke="var(--border)" strokeWidth="1.4" />
      <path d="M279 100 l7 -7 7 7" fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <text x="286" y="136" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" fill="var(--text-muted)">approved</text>
      <text x="286" y="146" textAnchor="middle" fontFamily="var(--font-mono)" fontSize="7.5" fill="var(--text-muted)">+ audited</text>
    </svg>
  );
}

export function Governance() {
  return (
    <section className="relative isolate overflow-hidden border-t border-line bg-paper py-24 sm:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <Eyebrow className="justify-center">Trust & governance</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="font-display mt-6 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-ink sm:text-[2.5rem] lg:text-[2.8rem]">
              Built for whoever has to{" "}
              <span className="text-gradient">sign off</span>.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="mx-auto mt-6 text-lg leading-relaxed text-ink-soft">
              A dean, an operations lead, a finance office, a student-engagement
              director, anyone accountable for an organization gets real oversight,
              on the record. Approvals, audit, and access control are built in, not
              bolted on.
            </p>
          </Reveal>
        </div>

        {/* audit trail anchor visual */}
        <Reveal delay={0.1} className="mx-auto mt-14 max-w-3xl">
          <AuditTrailDemo />
          <p className="mt-3 text-center text-[0.86rem] text-ink-faint">
            Live audit log, every allow and every deny, append-only.
          </p>
        </Reveal>

        {/* four pillars */}
        <div className="mt-16 grid gap-5 sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <Reveal as="div" key={p.title} delay={0.05 * i}>
              <div className="lift flex h-full flex-col rounded-3xl border border-line bg-cloud p-6 shadow-[var(--shadow-sm)] hover:-translate-y-1 hover:border-grove/25 hover:shadow-[var(--shadow-lg)] sm:p-7">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-grove-soft text-grove">
                  {p.icon}
                </span>
                <h3 className="mt-5 font-display text-[1.2rem] font-semibold text-ink">{p.title}</h3>
                <p className="mt-2.5 text-[0.95rem] leading-relaxed text-ink-soft">{p.body}</p>
                <p className="mt-4 rounded-lg border border-line bg-paper/50 px-3 py-1.5 font-mono text-[0.62rem] text-ink-faint">
                  {p.proof}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* data sovereignty */}
        <div className="mt-16 grid items-center gap-10 rounded-3xl border border-line bg-cloud p-7 sm:p-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <h3 className="font-display text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink sm:text-[1.85rem]">
              Institutional data, kept inside your{" "}
              <span className="text-grove">walls</span>.
            </h3>
            <ul className="mt-6 space-y-3.5">
              {OWNERSHIP.map((o) => (
                <li key={o} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-md bg-grove-soft text-grove-deep">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                  <span className="text-[0.97rem] leading-relaxed text-ink-soft">{o}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-xl border border-line bg-paper/50 px-4 py-3 text-[0.86rem] leading-relaxed text-ink-soft">
              <span className="font-medium text-ink">On the AI:</span> Tenure AI reads
              only records you already have permission to see, and shows its sources.
              Answers are generated by Anthropic&rsquo;s API from those sources. Your
              record is never used to train any model, by us or by them.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-line bg-paper/40 p-6">
              <BoundaryDiagram />
            </div>
          </Reveal>
        </div>

        {/* confidence bar */}
        <Reveal delay={0.1}>
          <ul className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-line pt-8">
            {CONFIDENCE.map((c) => (
              <li key={c} className="flex items-center gap-2 text-[0.86rem] text-ink-soft">
                <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full bg-grove")} />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
