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
    "Tenure is the system of record for any organization where people rotate faster than knowledge transfers, student clubs, university offices, teams, nonprofits, and growing companies. Finance, events, approvals, members, documents, and institutional memory live in one governed system of record, and Tenure AI turns that record into instant grounded answers, getting each new leader productive in days, not a semester.",

  // Scheduling, Calendly. The floating badge + every "Contact Sales" CTA opens this.
  calendlyUrl: "https://calendly.com/satvikwithtenure",
  // Back-compat alias used by older links; points at the same scheduler.
  bookingUrl: "https://calendly.com/satvikwithtenure",
  ctaLabel: "Contact Sales",

  email: "hello@tenurework.com",

  founders: [
    { name: "Almamy Diaby", role: "Co-founder" },
    { name: "Satvik Adyanthaya", role: "Co-founder" },
  ],

  origin: {
    school: "Simon Business School",
    university: "University of Rochester",
    partner: "Simon's Office of Student Engagement",
  },

  pilot: {
    season: "Fall 2026",
    orgCount: 6,
  },

  nav: [
    { label: "Product", href: "/product" },
    { label: "Story", href: "/story" },
    { label: "Pilot", href: "/pilot" },
  ],

  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],

  socials: {
    linkedin: "https://www.linkedin.com/company/tenurework",
    x: "https://x.com/tenurework",
  },

  supporters: [
    {
      name: "Startup Wednesday",
      src: "/logos/startup-wednesday.png",
      width: 2000,
      height: 563,
    },
    {
      name: "Simon Business School",
      src: "/logos/simon-business-school.png",
      width: 1000,
      height: 625,
    },
  ],

  /**
   * Honest, upsell-grade outcomes, "we don't measure engagement, we measure
   * whether the knowledge survived." Animated counters in the metrics band.
   */
  metrics: [
    { value: 3, suffix: "-day", label: "seat onboarding", sub: "a semester of ramp, compressed into days", was: "a semester" },
    { value: 0, suffix: "", label: "knowledge lost at graduation", sub: "everything stays attached to the seat, not the person" },
    { value: 6, suffix: "-step", label: "OSE approval chain", sub: "every decision snapshotted against the policy in force" },
    { value: 100, suffix: "%", label: "of actions logged", sub: "immutable, RBAC-scoped, nothing silently editable" },
  ],

  /**
   * Who the seat model serves. Same mechanism, a durable position that keeps
   * its knowledge, applied across every organization with turnover.
   */
  audiences: [
    {
      title: "University organizations",
      seat: "Treasurer · FIN-01",
      cadence: "Leadership turns over every spring",
      body: "Run the club and hand it off clean, finances, events, members, and a record the next board inherits on day one. No scattered drives, no lost passwords, no starting from zero.",
    },
    {
      title: "University administrations",
      seat: "Student Life · OSE-DIR",
      cadence: "Oversees dozens of orgs at once",
      body: "Govern every organization you steward from one seat, approvals, spending, and compliance that persist by role, without approving every bake sale. The knowledge you fund stops walking out the door.",
    },
    {
      title: "SMEs & growing teams",
      seat: "Head of Ops · OPS-01",
      cadence: "Employees leave, roles remain",
      body: "When someone resigns, their vendors, playbooks, and hard-won context shouldn't leave with them. Tenure keeps operating knowledge attached to the role, and onboards their replacement from the seat's own history.",
    },
    {
      title: "Nonprofits, chapters & boards",
      seat: "Board Chair · BRD-01",
      cadence: "Annual board & volunteer rotation",
      body: "Volunteer boards reset every year and relearn the same lessons. Tenure carries donor relationships, grant deadlines, and governance across every term, so each new board starts ahead, not from memory.",
    },
  ],
} as const;

export type Site = typeof site;
