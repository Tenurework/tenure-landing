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
   * One conversion phrase, used everywhere.
   */
  ctaLabel: "Request a demo",

  /**
   * ADDRESSED MAIL, NOT A CATCH-ALL.
   *
   * The site ran every route — sales, security review, a privacy question, a
   * legal notice — into one `hello@` inbox. An enterprise buyer reads a single
   * generic address as a company too small to have functions, and a security
   * reviewer who cannot find a security address assumes there is no one behind
   * it. These are the real Google Workspace groups, each with an owner.
   *
   * Every one of these resolves: `operations@` (aliases hello@, onboarding@,
   * deployments@), `partnerships@` (aliases sales@, enterprise@), `support@`
   * (aliases help@, success@), `security@` (aliases privacy@, compliance@),
   * `legal@` (alias contracts@), `finance@` (aliases billing@, invoices@,
   * payments@), `technical@` (aliases integrations@, sso@, data@).
   *
   * Route by INTENT, not by department name: the address a page shows should be
   * the one whose owner can actually answer the question that page raises.
   */
  email: {
    /** Demos, pricing, procurement, anything commercial. */
    sales: "sales@tenurework.com",
    /** General company enquiries. */
    general: "hello@tenurework.com",
    /** Vulnerability reports and security review. Named on /trust. */
    security: "security@tenurework.com",
    /** Data-protection questions. Named on /privacy. */
    privacy: "privacy@tenurework.com",
    /** Notices and contracts. Named on /terms. */
    legal: "legal@tenurework.com",
    /** Existing customers. */
    support: "support@tenurework.com",
  },

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
    office: "Simon’s Office of Student Engagement",
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
    status: "deploying" as const,
    season: "Fall 2026",
    scope: "Every organization the office stewards, and the office itself",
    scopeShort: "Across the office’s organizations",
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
  /*
    THE TOP RIBBON, AND WHAT OPENS UNDER IT.

    NO PANEL'S TRAILING LINK POINTS AT /contact. Two of them did, and on /contact
    itself that is a control that navigates to the page you are already reading —
    the same dead-control defect the header CTA already guards against, which is
    why the interaction suite caught it. The trailing link is an OVERVIEW, in the
    reference's sense of "Models Overview ->": somewhere further into the subject,
    not the conversion path. The conversion path is the pill on the right of the
    bar, and it is there on every route.

    Every destination in `menu` is a route or an anchor that already exists. A
    dropdown is the easiest place on a site to invent structure — four tidy
    columns of links to pages nobody built — and a menu whose items 404 is worse
    than no menu. Where a panel has only two real places to send you, it sends
    you to two.

    `blurb` is the reason to click, not a restatement of the label. "Security ->
    Security" teaches nothing; "what is live, what is not, and the limits of
    each" is the actual promise of that page.
  */
  nav: [
    {
      label: "Platform",
      href: "/product",
      groups: [
        {
          label: "Platform",
          items: [
            { label: "The workspace", href: "/product", blurb: "Finance, events, members, documents and memory on one screen." },
            { label: "What connects", href: "/#platform", blurb: "The systems an office already runs on, and where Tenure sits." },
          ],
        },
        {
          label: "Mechanism",
          items: [
            { label: "How a handoff works", href: "/#handoff", blurb: "What the next holder inherits, and who has to write it." },
            { label: "The seat, not the person", href: "/#seat", blurb: "Why the record outlives whoever is holding it this year." },
          ],
        },
        {
          label: "Evidence",
          items: [
            { label: "What is live", href: "/trust", blurb: "Twenty-one controls, written from the code that deploys." },
            { label: "The first deployment", href: "/pilot", blurb: "Where it goes live, and on what terms." },
          ],
          more: { label: "The full control register", href: "/trust" },
        },
      ],
    },
    {
      label: "Pilot",
      href: "/pilot",
      groups: [
        {
          label: "Deployment",
          items: [
            { label: "Where it goes live", href: "/pilot", blurb: "The office, the scope, and the term it runs for." },
          ],
        },
        {
          label: "Before you start",
          items: [
            { label: "Talk to us about yours", href: "/contact", blurb: "What a deployment needs from your side before it begins." },
          ],
        },
        {
          label: "Evidence",
          items: [
            { label: "Counted from the code", href: "/trust", blurb: "Every number the site states is measured, and says where from." },
          ],
          more: { label: "See the platform", href: "/product" },
        },
      ],
    },
    {
      label: "Security",
      href: "/trust",
      groups: [
        {
          label: "Controls",
          items: [
            { label: "Controls by area", href: "/trust", blurb: "Twenty-one controls across seven areas, re-checked every release." },
          ],
        },
        {
          label: "Policies",
          items: [
            { label: "Privacy", href: "/privacy", blurb: "What is collected, what is not, and who can reach it." },
            { label: "Terms", href: "/terms", blurb: "The agreement that governs an account." },
          ],
        },
        {
          label: "Questions",
          items: [
            { label: "Ask the security team", href: "/contact", blurb: "Reviews, questionnaires and anything the page does not answer." },
          ],
          more: { label: "Read the full register", href: "/trust" },
        },
      ],
    },
    {
      label: "About",
      href: "/story",
      groups: [
        {
          label: "Company",
          items: [
            { label: "The story", href: "/story", blurb: "The handoff that went wrong, and what it turned into." },
          ],
        },
        {
          label: "Talk to us",
          items: [
            { label: "Contact", href: "/contact", blurb: "Sales, security, privacy and support, each to the right inbox." },
          ],
        },
        {
          label: "Origin",
          items: [
            { label: "Founded at Simon Business School", href: "/story", blurb: "University of Rochester. Origin and support, never customership." },
          ],
          more: { label: "Read the story", href: "/story" },
        },
      ],
    },
  ],

  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],

  /*
    LINKEDIN ONLY. The X handle was listed in the footer and published to search
    engines through `sameAs`, which asserts to Google that the profile is ours.
    There is one account today, so there is one link here — a dead social icon
    costs more trust than an absent one.
  */
  socials: {
    linkedin: "https://www.linkedin.com/company/tenurework",
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
      displayHeight: "3rem",
      href: "https://nextcorps.org/startup-wednesday-rochester-brings-founders-together-for-a-month-of-building-learning-and-launching/",
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
      displayHeight: "2.9rem",
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
      sub: "209 seats, modelled on the office’s real organizational structure",
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
      value: 163,
      suffix: "",
      label: "end-to-end tests",
      sub: "run against a real database on every build, alongside more than 1,100 unit tests",
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
  /**
   * THE INDUSTRIES GRID.
   *
   * This replaced `audiences` — Universities, NGOs, SMEs, Associations — which
   * described the four kinds of organization the founders had talked to rather
   * than the market the mechanism serves. "SMEs" and "Associations" are not
   * industries, and a reader in healthcare or energy scanning that list
   * concluded, correctly, that the product was not aimed at them.
   *
   * WHAT EACH LINE HAS TO DO. Name the role that turns over in that sector, and
   * name what is lost with it. A sector whose rotation problem cannot be stated
   * that specifically does not belong on this list — generic "improve
   * efficiency" copy is what makes an industries grid read as filler.
   *
   * WHAT NONE OF THEM MAY DO. Imply Tenure is deployed in that sector. There is
   * one deployment and it is a university office. These tiles are positioning —
   * the sectors the seat model applies to — exactly as an enterprise vendor's
   * industry grid is positioning rather than a customer list. C-021's blocklist
   * is live and per-sentence.
   */
  industries: [
    {
      key: "education",
      label: "Education",
      line: "Chairs, deans and student leadership turn over on a fixed calendar, and the reasoning behind last year’s budget leaves with them.",
      photo: "/photos/industry-education.jpg",
      alt: "An empty university lecture theatre",
    },
    {
      key: "public-sector",
      label: "Public sector",
      line: "Administrations change on a schedule. The commitments, casework and contracts they made belong to the office, not to whoever held it.",
      photo: "/photos/industry-public-sector.jpg",
      alt: "The colonnade of a civic building",
    },
    {
      key: "healthcare",
      label: "Healthcare",
      line: "Rotations, locums and committee chairs change constantly; the decisions behind a service line should not restart with each one.",
      photo: "/photos/industry-healthcare.jpg",
      alt: "A hospital corridor lit by a row of windows",
    },
    {
      key: "finance",
      label: "Financial services",
      line: "Coverage moves between relationship managers, and the terms, exceptions and history of an account have to move with the seat.",
      photo: "/photos/industry-finance.jpg",
      alt: "Office towers in a financial district, seen from below",
    },
    {
      key: "energy",
      label: "Energy and utilities",
      line: "Assets outlive the crews and contractors who maintain them, so the inspection, permit and vendor record has to survive every handover.",
      photo: "/photos/industry-energy.jpg",
      alt: "Wind turbines along a ridge at first light",
    },
    {
      key: "manufacturing",
      label: "Manufacturing",
      line: "Shift leads and plant engineers rotate; the changeover procedure and the reason a line was retooled cannot live in one person’s notebook.",
      photo: "/photos/industry-manufacturing.jpg",
      alt: "A production line running the length of a plant floor",
    },
    {
      key: "technology",
      label: "Technology",
      line: "On-call, ownership and the reason a system was built the way it was change hands faster than the system does.",
      photo: "/photos/industry-technology.jpg",
      alt: "An aisle of server racks in a data centre",
    },
    {
      key: "nonprofit",
      label: "Nonprofits and NGOs",
      line: "Volunteer boards reset every year, and funder relationships, grant deadlines and the reasoning behind last year’s decisions reset with them.",
      photo: "/photos/industry-nonprofits.jpg",
      alt: "Volunteers loading a distribution run",
    },
  ],
} as const;

export type Site = typeof site;
