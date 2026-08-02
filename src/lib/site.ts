/**
 * Single source of truth for site-wide constants + marketing content. Founders
 * can edit copy, links, and the feature catalog here without touching component
 * code. Every module/metric/trust point below reflects the real Tenure product.
 */
export const site = {
  name: "Tenure",
  domain: "tenurework.com",
  url: "https://www.tenurework.com",

  tagline: "The operating system that keeps the memory when the people change.",
  description:
    "Tenure is the system of record for organizations where people rotate faster than knowledge transfers. Finance, events, approvals, members, documents and institutional memory attach to the durable seat, not the person holding it, so the next leader inherits the record instead of rebuilding it.",

  /**
   * Scheduling. Reached only from /contact, after an explicit click — never
   * loaded globally. Every path to it also has a plain-anchor fallback, because
   * calendly.com is routinely blocked on university networks.
   */
  calendlyUrl: "https://calendly.com/satvikwithtenure",
  // Back-compat alias used by older links; points at the same scheduler.
  bookingUrl: "https://calendly.com/satvikwithtenure",
  /**
   * One conversion phrase, used everywhere. "Contact Sales" oversold a
   * two-founder company and set the wrong expectation for who picks up.
   */
  ctaLabel: "Book a walkthrough",

  email: "hello@tenurework.com",

  founders: [
    { name: "Almamy Diaby", role: "Co-founder" },
    { name: "Satvik Adyanthaya", role: "Co-founder" },
  ],

  origin: {
    school: "Simon Business School",
    university: "University of Rochester",
    /**
     * The office Tenure was built with. Referred to as the institution the
     * work originated with — never as a partner, sponsor, customer or
     * endorser. See `pilot.status`.
     */
    office: "Simon's Office of Student Engagement",
  },

  /**
   * PILOT LANGUAGE IS GOVERNED. As of 2026-08-02 the Fall 2026 pilot is
   * verbally agreed and NOT contracted. Nothing on the site may state it as
   * settled fact, imply procurement is complete, or describe the office as a
   * partner, sponsor or customer.
   *
   * Permitted: "planned", "targeting Fall 2026", "proposed scope".
   * Forbidden: "partner", "customer", "is rolling out", "will deploy",
   *            "sponsored by", any university endorsement.
   *
   * `claims.spec.ts` fails the build if a forbidden phrase reappears.
   * Revisit only when a written agreement exists.
   */
  pilot: {
    status: "planned" as const,
    season: "Fall 2026",
    scope: "Proposed: every organization the office stewards, and the office itself",
    scopeShort: "Proposed across the office's organizations",
  },

  nav: [
    { label: "Product", href: "/product" },
    { label: "Pilot", href: "/pilot" },
    { label: "Trust", href: "/trust" },
    { label: "Story", href: "/story" },
  ],

  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],

  socials: {
    linkedin: "https://www.linkedin.com/company/tenurework",
    x: "https://x.com/tenurework",
  },

  /**
   * Partner marks. `displayHeight` is the rendered lockup height, tuned per mark
   * so the row reads optically level: the Startup Wednesday PNG carries ~20% of
   * transparent padding, while the Simon lockup is cropped tight, so equal CSS
   * heights would make Simon read oversized.
   */
  supporters: [
    {
      name: "Startup Wednesday",
      src: "/logos/startup-wednesday.png",
      width: 2000,
      height: 563,
      displayHeight: "2.25rem",
    },
    {
      name: "Simon Business School",
      // Official University of Rochester horizontal lockup (navy RGB). The
      // vertical variant ships alongside it at
      // /logos/simon-business-school-vertical.png for stacked placements.
      src: "/logos/simon-business-school-horizontal.png",
      width: 1054,
      height: 339,
      displayHeight: "2.15rem",
    },
  ],

  /**
   * Every number here is counted from the deploying repository, not estimated,
   * and each names a MECHANISM rather than an outcome. That rule exists because
   * the pilot has not run: there is no telemetry measuring onboarding time, so
   * a "3-day onboarding" counter was theatre. A behaviour you can verify beats
   * a number nobody measured.
   *
   * `claimId` links each to its row in docs/PUBLIC-CLAIMS-REGISTER.md, and
   * claims.spec.ts fails if a metric appears without one.
   */
  metrics: [
    {
      value: 26,
      suffix: "",
      label: "organizations modelled",
      sub: "209 seats, built from the office's own leadership roster rather than invented for a demo",
      claimId: "C-014",
    },
    {
      value: 2,
      suffix: "-gate",
      label: "approval chain, 7 request types",
      sub: "every decision appends a permanent step naming the seat that made it",
      claimId: "C-006",
    },
    {
      value: 0,
      suffix: "",
      label: "records deleted at offboarding",
      sub: "a seat carrying history refuses deletion — access is revoked, the record is not",
      claimId: "C-011",
    },
    {
      value: 132,
      suffix: "",
      label: "end-to-end tests",
      sub: "run against a real database on every build, alongside 292 unit tests",
      claimId: "C-015",
    },
  ],

  /**
   * Who the seat model serves. Same mechanism, a durable position that keeps
   * its knowledge, applied across every organization with turnover.
   */
  audiences: [
    {
      title: "University organizations",
      seat: "VP Finance & Operations · SCC-VP-FINA-OPER",
      cadence: "Leadership turns over every spring",
      body: "Run the club and hand it off clean, finances, events, members, and a record the next board inherits on day one. No scattered drives, no lost passwords, no starting from zero.",
    },
    {
      title: "University administrations",
      seat: "Office of Student Engagement · Director",
      cadence: "Oversees dozens of orgs at once",
      body: "Govern every organization you steward from one seat, approvals, spending, and compliance that persist by role, without approving every bake sale. The knowledge you fund stops walking out the door.",
    },
    {
      title: "SMEs & growing teams",
      seat: "Head of Operations · OPS-HEAD-OPER",
      cadence: "Employees leave, roles remain",
      body: "When someone resigns, their vendors, playbooks, and hard-won context shouldn't leave with them. The same seat model applies outside a university: knowledge attaches to the role, and whoever takes it next reads the seat's record before their first day in it.",
    },
    {
      title: "Nonprofits, chapters & boards",
      seat: "Board Chair · BRD-CHAI",
      cadence: "Annual board & volunteer rotation",
      body: "Volunteer boards reset every year and relearn the same lessons. The same engine already configures a structurally different organization, programs, committees, sites, and funder relations in place of clubs and boards, so donor context and deadlines can persist across every term.",
    },
  ],
} as const;

export type Site = typeof site;
