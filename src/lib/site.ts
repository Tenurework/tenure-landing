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
    "Tenure is the system of record for organizations where people rotate faster than knowledge transfers — universities, nonprofits and NGOs, small and mid-sized businesses, associations and chapters. Finance, events, approvals, members, documents and institutional memory attach to the durable seat, not the person holding it, so the next holder inherits the record instead of rebuilding it.",

  /**
   * Scheduling. Reached only from /contact, and only as a plain outbound anchor
   * — there is no embed and no Calendly script on this origin any more. What
   * replaced the embed is first-party (components/site/WalkthroughRequest.tsx)
   * and transmits nothing: it composes the request in the browser and hands it
   * to the visitor's own mail client.
   *
   * The anchor is kept because some people would simply rather pick a slot, and
   * an anchor cannot fail the way the old control did: that one was a <button>
   * that awaited Calendly's script and only then called window.open, outside the
   * user-gesture window — so with calendly.com blocked, which is routine on
   * university networks and with any content blocker, it silently did nothing.
   *
   * `bookingUrl` was removed on 2026-08-18: a "back-compat alias" whose only
   * reference in the entire repository was its own declaration.
   */
  calendlyUrl: "https://calendly.com/satvikwithtenure",
  /**
   * One conversion phrase, used everywhere. "Contact Sales" oversold a
   * two-founder company and set the wrong expectation for who picks up.
   */
  ctaLabel: "Book a walkthrough",

  email: "hello@tenurework.com",

  /**
   * Two founders, and which half of the company each one answers for. The split
   * is not decoration: it matches claim ownership in `claims.ts`, where Satvik
   * owns every engineering and security row and Almamy owns the customer, legal
   * and metric rows. `focus` is a responsibility statement only — no
   * biographies, credentials, employers, education or photographs, because none
   * of that has been verified for publication.
   */
  founders: [
    {
      name: "Almamy Diaby",
      role: "Business cofounder",
      focus:
        "Customer development, market acquisition, operations, finance, and business development.",
    },
    {
      name: "Satvik Adyanthaya",
      role: "Technical cofounder",
      focus: "Product, AI systems, platform engineering.",
    },
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

  /**
   * The top ribbon. Renamed 2026-08-18 from Product / Pilot / Trust / Story.
   *
   * The old labels named the PAGE; these name the question the visitor arrived
   * with, which is the only thing a four-item ribbon has room to do:
   *
   *   Product -> Platform   the site's own word for what it runs (the home page
   *                         section is "The platform" and its anchor is #platform).
   *                         "Product" is what a company calls the page; "Platform"
   *                         is what the thing is.
   *   Pilot   -> Pilot      kept. It is already the operational word, and every
   *                         alternative ("Rollout", "Deploy", "Get started")
   *                         implies a commitment C-021 forbids implying — the
   *                         Fall 2026 pilot is verbally agreed and not contracted.
   *   Trust   -> Security   what a procurement or IT reviewer scans a nav for.
   *                         Nobody has ever looked for a link called "Trust".
   *                         The page keeps its /trust URL and its "Trust &
   *                         security" <title>, so nothing indexed moves.
   *   Story   -> About      the convention, and it also covers the founders and
   *                         the where-it-stands record, which "Story" did not.
   *
   * `nav.spec.ts` derives its header assertions from this list, so renaming here
   * renames them. The one literal that is NOT derived is the footer navigation
   * check, which names a label directly.
   */
  nav: [
    { label: "Platform", href: "/product" },
    { label: "Pilot", href: "/pilot" },
    { label: "Security", href: "/trust" },
    { label: "About", href: "/story" },
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
   * Supporter marks — origin and support only, never customership, sponsorship
   * of the product or endorsement (C-022).
   *
   * `displayHeight` is the rendered lockup height, tuned per mark
   * so the row reads optically level: the Startup Wednesday PNG carries ~20% of
   * transparent padding, while the Simon lockup is cropped tight, so equal CSS
   * heights would make Simon read oversized.
   */
  supporters: [
    {
      name: "Startup Wednesday",
      src: "/logos/startup-wednesday.png",
      // `width`/`height` are the RENDERED box, not the intrinsic asset size.
      // Passing the intrinsic 2000x563 to next/image made it build a srcset at 1x
      // and 2x of 2000 — capped at the largest device size — so a mark that paints
      // ~128px wide was fetched as /_next/image?w=3840. Lighthouse caught it.
      // Intrinsic size is preserved in the source file; only the request changes.
      width: 128,
      height: 36,
      displayHeight: "2.25rem",
    },
    {
      name: "Simon Business School",
      // Official University of Rochester horizontal lockup (navy RGB). The
      // vertical variant ships alongside it at
      // /logos/simon-business-school-vertical.png for stacked placements.
      src: "/logos/simon-business-school-horizontal.png",
      // Rendered box; intrinsic asset is 1054x339. See the note above.
      width: 107,
      height: 34,
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
      // The sub-line used to boast that the 209 seats were "built from the
      // office's own leadership roster rather than invented for a demo". Two
      // reviewers read that, correctly, as an advertisement that the demo
      // environment holds real student records — and the site then offered to
      // screen-share one. The structural point survives without it: what was
      // modelled is the office's org chart, not its people.
      label: "organizations modelled",
      sub: "209 seats, modelled on the office's real organizational structure — seeded counts, not active users",
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
      sub: "run against a real database on every build, alongside 320 unit tests",
      claimId: "C-015",
    },
  ],

  /**
   * Who the seat model serves. Same mechanism, a durable position that keeps
   * its knowledge, applied across every organization with turnover.
   *
   * WHY EACH ROW CARRIES A `sector` AND A PHOTO NOW.
   *
   * The site described a cross-industry product in university-only language. The
   * hero opened "Every spring the treasurer graduates", the problem section
   * measured the cost in "a semester", the FAQ priced "per club" — and the four
   * audiences below, the one place that said otherwise, were three routes deep on
   * /product where an SME or an NGO would never reach them. Read end to end, the
   * site was for student government.
   *
   * So this list is now the source for a compact sector card on the HOME page
   * (`components/home/Audiences.tsx`), one sector visible at a time, and it was
   * removed from /product rather than rendered in both places. `sector` is the
   * short tab label; `title` is the full heading inside the panel. The
   * university-flavoured product surfaces elsewhere on the site stay, and are
   * labelled as one worked example instead of standing in for the whole market.
   */
  audiences: [
    {
      sector: "Universities",
      title: "University organizations & the offices above them",
      photo: "/photos/students-laptop.jpg",
      alt: "Student organization members gathered around a laptop in a lecture hall",
      seat: "VP Finance & Operations · SCC-VP-FINA-OPER",
      cadence: "Leadership turns over every spring",
      // Two rows merged into one on 2026-08-18. "University organizations" and
      // "University administrations" were separate entries, which meant two of the
      // four audiences on the site were universities — the skew this list exists to
      // correct, restated inside the list itself. Both halves are kept: the org
      // sentence first, the office sentence second, because they are two seats on
      // one record rather than two markets.
      //
      // "No lost passwords" stays out: Tenure stores no credentials and has no
      // vault. "Compliance" stays out too — the six transcribed policies have no
      // enforcement path (C-020), while deadlines that persist by role are real and
      // shipped (C-018).
      body: "Run the organization and hand it off clean: finances, events, members, and a record the next board inherits on day one. The office above them gets the same record from the other side — approvals, spending and deadlines that persist by role, without approving every bake sale.",
    },
    {
      sector: "NGOs & nonprofits",
      title: "Nonprofits, NGOs and volunteer boards",
      photo: "/photos/team-charts.jpg",
      alt: "A board reviewing plans and charts together, seen from above",
      seat: "Board Chair · BRD-CHAI",
      cadence: "Annual board & volunteer rotation",
      // "The same engine already configures ... programs, committees, sites and
      // funder relations" asserted shipped, configured support for an entity
      // type nothing in the deploying repo evidences. The seat model genuinely
      // does generalise — that is the honest version of the same point.
      body: "Volunteer boards reset every year and relearn the same lessons. A board chair or a programme lead is a position with the record attached, so funder context, grant deadlines and the reasoning behind last year's decisions can persist across every term instead of resetting with the slate.",
    },
    {
      sector: "SMEs",
      title: "Small and mid-sized businesses",
      photo: "/photos/small-business.jpg",
      alt: "Two small-business owners packing and labelling orders in their studio",
      seat: "Head of Operations · OPS-HEAD-OPER",
      cadence: "Employees leave, roles remain",
      body: "When someone resigns, their vendors, pricing, playbooks and hard-won context should not leave with them. The seat model does not care that there is no term: an operations lead is still a position, and whoever takes it next reads the seat's record before their first day in it.",
    },
    {
      sector: "Associations",
      title: "Associations, chapters and committees",
      photo: "/photos/admin-boardroom.jpg",
      alt: "Members of a governing body seated at a formal table with microphones",
      seat: "Chapter President · CHP-PRES",
      cadence: "New slate every year, in every chapter",
      body: "A federated body runs the same seats dozens of times over, and every chapter relearns the same lessons in parallel. The seat is the unit that survives the slate, so a chapter's sponsors, budget history and run-of-show stay where the next holder will look for them.",
    },
  ],
} as const;

export type Site = typeof site;
