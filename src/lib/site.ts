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
    "Tenure is the system of record for any organization where people rotate faster than knowledge transfers, student clubs, university offices, teams, nonprofits, and growing companies. Finance, events, approvals, members, documents, and institutional memory live in one governed system of record, and Tenure AI turns that record into grounded, sourced answers, getting each new leader productive in days, not a semester.",

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

  /**
   * The pilot is not a hand-picked cohort. OSE is standing Tenure up across
   * every organization it stewards *and* for its own administrators, so the
   * org-side record and the office-side oversight run on one system from day
   * one. `scope` is the short form used in stat rows and chips.
   */
  pilot: {
    season: "Fall 2026",
    scope: "Every org OSE stewards, plus OSE itself",
    scopeShort: "Every org OSE stewards",
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
   * Honest, upsell-grade outcomes, "we don't measure engagement, we measure
   * whether the knowledge survived." Animated counters in the metrics band.
   */
  metrics: [
    { value: 3, suffix: "-day", label: "seat onboarding", sub: "the incoming officer gets read-only access to the seat's record before their term begins", was: "a semester" },
    { value: 0, suffix: "", label: "knowledge lost at graduation", sub: "everything stays attached to the seat, not the person" },
    { value: 2, suffix: "-gate", label: "approval chain, 7 request types", sub: "every decision appends a permanent step naming the seat that made it" },
    { value: 100, suffix: "%", label: "of actions logged", sub: "immutable, RBAC-scoped, nothing silently editable" },
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
