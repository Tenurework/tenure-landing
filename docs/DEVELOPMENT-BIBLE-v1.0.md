# Tenure Landing Website — Claude Code Development Bible v1.0

Use the complete text below as one Claude Code prompt. Do not extract only the task list; the authority model, truth gates, testing rules, and completion criteria are part of the work.

---

## BEGIN CLAUDE CODE PROMPT

You are the principal product engineer, design-systems lead, conversion strategist, accessibility engineer, technical SEO owner, QA lead, and claim-governance reviewer responsible for the public Tenure website.

Your working repository is:

- `https://github.com/satvikOS/tenure-landing`
- Production website: `https://www.tenurework.com/`

The two product repositories you must continuously reconcile against are:

- Canonical development engine: `https://github.com/satvikOS/Tenure-Parent`
- Current production/rollback tenant application: `https://github.com/satvikOS/Tenure`

Your job is not to make a prettier brochure. Your job is to turn the Tenure website into a precise, modern, high-conviction public expression of the real product while establishing a maintainable system for future refinement, upgrades, testing, and claim accuracy.

Work autonomously and finish implementation, testing, documentation, and a clean handoff. Ask a question only when a missing answer materially changes legal exposure, public customer claims, or an irreversible action. Do not stop at an audit, a plan, a mockup, or a list of suggestions. Implement verified improvements in the landing repository.

### 1. The Tenure thesis is immutable

Tenure’s moat and product thesis are institutional memory attached to the durable role, position, or seat—not the person temporarily occupying it.

The product promise is:

- People rotate; the seat persists.
- Work creates the record as it happens.
- Money, decisions, relationships, files, approvals, deadlines, context, and lessons remain attached to the durable seat.
- Incoming leaders inherit context instead of reconstructing it.
- Outgoing leaders lose authority without erasing history.
- Oversight belongs to the office and its durable roles as well as to the organizations it stewards.
- Tenure is not merely knowledge management, a wiki, a shared drive, a chatbot, a roster, or an approval tool. It is a governed system of record whose unique organizing object is the durable seat.

The current hero line is strong and should remain the north star unless a clearly superior version survives testing:

> People move on. The know-how stays.

Every public page must reinforce this thesis. Do not let secondary features bury it.

### 2. Repository authority and truth hierarchy

The repositories are not interchangeable. Apply this authority order whenever claims or behavior conflict:

1. **Current production behavior and the deploying `satvikOS/Tenure` code** determine what can be presented as live today.
2. **`satvikOS/Tenure-Parent` runtime code, generated evidence, execution ledger, and passing tests** determine what is canonical development truth and what may be described as built but pending cutover—only when the distinction is explicit.
3. **Written and signed customer/pilot evidence** determines what may be called a partnership, customer, deployment, pilot commitment, or active rollout.
4. **The landing repository’s claim register and current code** determine what the website presently says, but never override product truth.
5. **Architecture bibles, roadmaps, prompts, TODOs, comments, interfaces, schemas, mockups, and future strategy** express intent, not shipped capability.

Never promote a Parent-only capability to “available now” while production still deploys from `Tenure`. Never describe a declared interface, schema, Terraform resource, roadmap item, placeholder, or test fixture as a shipped user capability.

The strategic direction includes AWS-native global deployment, AWS Cognito for identity/SSO, and AWS Bedrock for Tenure AI. These are roadmap decisions unless and until the deploying repository proves them. At the audit baseline, both product repositories still call Anthropic’s API directly through `ANTHROPIC_API_KEY`. The website must remain honest about the current provider. Change public and legal copy to Bedrock only after all of the following are true:

- the deploying repository invokes Bedrock rather than `api.anthropic.com`;
- infrastructure, IAM, model policy, region behavior, tenant controls, secrets handling, failure modes, and observability are implemented;
- production-equivalent tests pass;
- the deployment/cutover is confirmed;
- Privacy, subprocessors, security copy, diagrams, and the claim register are updated in the same release.

### 3. Safety and repository rules

- Read every applicable `AGENTS.md`, `CLAUDE.md`, README, decision record, and local instruction before editing.
- `tenure-landing` uses Next.js 16. Its `AGENTS.md` explicitly warns that this is not the Next.js you know. Before modifying Next.js behavior, read the relevant installed documentation under `node_modules/next/dist/docs/` and obey it.
- Begin with `git status`, branch, remotes, last commits, and a dirty-worktree check. Preserve unrelated work.
- Work on a dedicated branch. Do not force-push, rewrite history, merge to `main`, or deploy production without explicit authorization.
- Do not push to `satvikOS/Tenure`. Its `main` branch deploys the live pilot and may contain real student data. Treat it as read-only unless the user separately authorizes a production change and the repository’s own rules permit it.
- Do not arm or alter AWS-mutating workflows in `Tenure-Parent`. Its production workflows are deliberately disarmed.
- The product repositories are evidence sources for this task. The implementation target is `tenure-landing` unless a separately approved product correction is required.
- Do not expose credentials, personal student data, raw rosters, secrets, internal account IDs, or sensitive infrastructure output.
- Do not invent logos, customer endorsements, quotations, usage metrics, compliance status, partnership status, security certifications, or integration support.
- Do not use a customer or university logo unless repository evidence and the user confirm public usage rights.

### 4. Definition of done

This work is complete only when all of the following are true:

- the live site and all public routes have been audited before changes;
- the three repositories have been reconciled at their current commit SHAs;
- every material public product claim has evidence and a release status;
- P0 truth, legal, SEO, accessibility, and conversion defects are fixed;
- the home page tells the Tenure story with materially less cognitive load;
- light and dark modes are polished, low-fatigue, and fully tokenized;
- responsive behavior is verified at mobile, tablet, laptop, and large desktop widths;
- first-party automated E2E, accessibility, visual-regression, SEO, and interaction tests exist for the landing site;
- lint, type checking, build, and the new tests pass;
- no critical or high-severity axe violations remain;
- no internal link is broken;
- each indexable route has correct canonical and social metadata;
- `robots.txt` and `sitemap.xml` are present and correct;
- no fatal first-party console error occurs during tested flows;
- performance budgets are met or any exception is measured and documented;
- the repository documentation matches the actual design and architecture;
- a final evidence report lists commands, exit codes, screenshots, remaining risks, and any external/legal blocker.

A component, page, test, document, screenshot, or claim is not “done” because it exists. It is done when integrated, exercised, verified, and documented.

### 5. Mandatory Phase 0: establish current truth before editing

Do not start by redesigning. Execute this sequence first.

#### 5.1 Record repository baselines

For all three repositories, record:

- current commit SHA and date;
- branch and remotes;
- worktree state;
- package and framework versions;
- app routes, scripts, test suites, and deployment mechanisms;
- which repository currently deploys each public system;
- relevant open findings and ledger status.

In `Tenure-Parent`, read in this order before relying on the architecture spec:

1. `CLAUDE.md`
2. `README.md`
3. `docs/architecture/REVIEW-FINDINGS.md`
4. `docs/implementation/global-engine-execution-ledger.md`
5. `docs/decisions/PRODUCT-DECISIONS.md`
6. relevant ADRs
7. only then the broader architecture bibles/specifications

Where a review finding conflicts with an architecture proposal, the review finding wins until corrected in runtime code and tests.

#### 5.2 Run the live-site E2E audit read-only

Audit `https://www.tenurework.com/` before changing local code. Cover at minimum:

- `/`
- `/product`
- `/story`
- `/pilot`
- `/privacy`
- `/terms`
- a nonexistent route
- `/robots.txt`
- `/sitemap.xml`

Exercise without submitting external forms:

- desktop and mobile navigation;
- all internal navigation links;
- every Contact Sales CTA and its close/fallback behavior;
- the product-demo module tabs;
- term/succession controls;
- every FAQ accordion;
- keyboard order and visible focus;
- reduced-motion behavior;
- theme behavior after dark mode is implemented;
- external links and mail links;
- 404 recovery;
- first-party console warnings/errors;
- metadata, canonical, Open Graph, Twitter, structured data, `lang`, landmarks, headings, labels, and alt text;
- page density, DOM size, scroll length, and layout overflow.

Capture baseline screenshots before editing at 1440×1000, 1280×800, 1024×768, 768×1024, 390×844, 360×800, and 320×800. Disable animation and wait for fonts before screenshots so diffs are stable.

#### 5.3 Run repository baselines

Run the commands each repository prescribes. At minimum:

`tenure-landing`:

```bash
npm ci
npm run lint
npm run build
```

`Tenure-Parent`:

```bash
npm ci
npm run type-check
npm run lint
npm run test -- --ci
npm run test:platform
npm run build
npm run studio:type-check
npm run studio:build
npm run e2e -- --list
npm run e2e --workspace apps/system-studio -- --list
```

`Tenure`:

```bash
npm ci
npm run type-check
npm run lint
npm run test -- --ci
npm run build
npm run e2e -- --list
```

Run full product E2E only against a fresh, disposable, locally migrated and seeded database. Never aim mutating E2E at production. The suites are stateful; recreate/reseed between runs as repository instructions require.

If Docker/PostgreSQL is unavailable, record the blocker and run the inventories, builds, unit suites, and platform guards. Do not imply the full E2E suite passed.

#### 5.4 Create or refresh a claims register

Create `docs/PUBLIC-CLAIMS-REGISTER.md` or an equivalent structured source plus a readable generated view. Every material claim must include:

| Field | Meaning |
|---|---|
| Claim ID | Stable identifier |
| Exact or normalized claim | What the public site says |
| Route/component | Where it appears |
| Capability category | Product, customer, security, AI, integration, compliance, metric, roadmap |
| Evidence repository | `Tenure`, `Tenure-Parent`, external agreement, or other source |
| Evidence commit | Commit SHA verified |
| Evidence path/test | Exact implementation and test references |
| Availability | Live production, built pending cutover, pilot target, roadmap, unsupported |
| Qualification | Limits that must accompany the claim |
| Owner | Who revalidates it |
| Last verified | Date |
| Review/expiry | When it must be rechecked |

Add a CI check that fails when a public claim is marked unsupported, lacks evidence, uses an expired verification date, or claims live availability from Parent-only evidence.

### 6. Verified audit baseline from 2026-08-02—recheck, do not blindly trust

The following findings were observed at these commits and should be treated as a starting hypothesis:

- `tenure-landing`: `fb6a3bd2f1cfaef20abb4c2e62085bc8d8a527dc`
- `Tenure-Parent`: `e1cfbe82ea2fcf0186edd748b544e95e5e3461a9`
- `Tenure`: `819aec0ebc6648b2ac6768fcffc1992899334233`

Baseline verification at that point:

- Landing lint and static production build passed.
- Parent type-check and build passed; 1,560 unit tests and 96 platform guards passed; 152 web E2E scenarios and 170 System Studio E2E scenarios were enumerated.
- Production `Tenure` type-check and build passed; 320 unit tests passed; 132 E2E scenarios were enumerated.
- Full database-backed E2E was not run in that environment because Docker and PostgreSQL were unavailable.
- Parent was more than 11,000 added/changed lines ahead of the current production app, so “built in Parent” and “live in Tenure” were materially different states.

Live-site findings at that point:

1. Every non-home route declared `https://www.tenurework.com/` as its canonical URL.
2. `/robots.txt` and `/sitemap.xml` returned the generic 404 page.
3. The home page contained approximately 3,176 visible words, 1,987 DOM nodes, 51 headings, and 19.6 desktop viewport-heights of scroll—too dense for the desired minimal, low-fatigue experience.
4. `/product`, `/story`, and `/pilot` were roughly five viewport-heights each and were structurally healthier.
5. Contact Sales worked, but loaded a global Calendly popup with a prominent third-party cookie panel and a visual system unrelated to Tenure. A separate floating Calendly badge duplicated site CTAs.
6. The interactive Finance, Calendar, Approvals, Members, and Memory demo tabs worked.
7. The three term/succession controls worked.
8. FAQ accordions worked and allowed one open item at a time.
9. The browser emitted no observed first-party application error; noise came from the browser extension and Calendly storage warning.
10. The Pilot page visibly concatenated “Student Engagementisn’t”.
11. The Privacy page visibly concatenated `hello@tenurework.comand`.
12. All pages used the root metadata’s long description; route-specific metadata was incomplete.
13. The site had only light mode even though Tenure’s design direction requires excellent light and dark modes.
14. The current README described an obsolete dark editorial/brass design while runtime CSS used a light paper/navy/grove system.
15. Current muted/faint text appeared too low-contrast in important hero and secondary-page copy and requires measured WCAG verification.
16. The landing repository had screenshot scripts but no first-party Playwright test suite in `package.json`.

Reproduce these findings before fixing them. If the site changed, record the new truth rather than forcing the old report to remain true.

### 7. P0 claim and legal corrections

Resolve these before visual embellishment.

#### 7.1 Partnership and pilot language

The current site speaks as if every organization under Simon’s Office of Student Engagement and the office itself are definitely rolling out Tenure in Fall 2026 and labels OSE as a partner. Do not publish this as fact without written confirmation or explicit user approval.

Create an explicit decision gate:

- **Confirmed and publicly authorized:** use precise, approved wording and approved logo treatment.
- **Interested or planning but not contracted:** say “planned,” “proposed,” “design partner discussions,” or “targeting a Fall 2026 pilot,” depending on evidence.
- **No permission to use the mark:** remove the mark and use text-only origin language.

Never imply procurement completion, contractual partnership, production usage, sponsorship, or university endorsement from a discovery conversation.

#### 7.2 Metrics

Remove or properly qualify unmeasured or false metrics, including:

- “100% of actions logged” unless a generated test proves the exact scope and the copy states that scope;
- “3-day onboarding” unless explicitly labeled as a pilot target rather than measured outcome;
- absolute “zero knowledge lost” unless clearly presented as design intent, not observed outcome;
- test counts or roster counts that are hardcoded into public copy without a generated source and a reason they help a buyer.

Do not use a large animated number when the number is not independently measured. Mechanism is stronger than theater: shadow access, durable seats, generated handoff packets, and inherited records are credible proof.

#### 7.3 Audit, isolation, and compliance wording

- Do not call the product “Postgres row-level security” when it uses query-layer enforcement.
- Do not claim every model or every query is isolated when the tenancy registry explicitly marks models as unenforceable at the query layer.
- Do not call an application-managed append-only table cryptographically immutable, tamper-proof, hash-chained, or WORM unless those properties are actually implemented.
- “SOC 2 roadmap” is not SOC 2 readiness, certification, compliance, or controls operating effectively.
- Do not claim FERPA compliance or FERPA alignment without counsel, institutional review, and implemented controls. Aspirational “FERPA-conscious” wording still requires review.
- Do not claim separation of duties if an OSE user holding a club president seat can submit and later approve the same request.
- Do not claim self-service configuration when System Studio or its current write surfaces cannot safely provision and deploy the promised system end to end.

Public trust language should distinguish:

- implemented and tested controls;
- operational process;
- roadmap;
- compliance aspiration;
- third-party certification.

#### 7.4 AI wording

At the baseline, direct Anthropic API usage is current production truth. The Privacy page’s provider disclosure is directionally correct and must not be silently changed to Bedrock because Bedrock was selected strategically.

Verify before retaining claims that the provider never trains on submitted API data. If retained, ground the statement in current contractual terms and legal review; do not rely on memory. State that Tenure filters sources by the requester’s permissions before synthesis only to the exact scope proven by code. Avoid absolute “never hallucinates,” “never invents,” “instant,” or “answers anything.”

Describe graceful degradation honestly: when synthesis is unavailable or disabled, permission-scoped ranked sources may still be shown if that remains true in the deploying code.

#### 7.5 Integrations

Do not display an integration logo merely because Tenure can import a file produced by that vendor.

At baseline, defensible mechanisms included:

- Excel file import, interpretation, and editing;
- Word, PowerPoint, PDF, and spreadsheet preview/editing to the exact supported scope;
- a signed, one-way calendar subscription usable in Outlook, Google Calendar, or Apple Calendar.

Do not imply two-way sync, OAuth account connection, Google Drive, Slack, Notion, Box, Teams, Gmail, Dropbox, Discord, Zoom, or other integration support without actual connector code and E2E proof in production.

### 8. Information architecture: make the site minimal without making Tenure look small

The home page currently tries to carry the entire sales deck, product manual, security review, pilot page, and architecture argument. Reduce repetition and assign each page a job.

Recommended public architecture:

- `/` — conviction and orientation
- `/product` — mechanisms and product surfaces
- `/pilot` — pilot scope, eligibility, operating model, and evidence
- `/story` — why the company exists and who is building it
- `/security` or `/trust` — precise architecture, data handling, AI provider disclosure, implemented controls, roadmap labels, and security contact
- `/contact` — first-party conversion surface with scheduling and email fallback
- `/privacy` — legally reviewed privacy notice
- `/terms` — legally reviewed terms
- branded `not-found`

Do not add pages solely to inflate the sitemap. If a route has no distinct audience job, keep it as a section.

#### 8.1 Home-page narrative

Target a material reduction from the 2026-08-02 baseline: ideally 1,400–1,800 words, approximately 9–12 desktop viewport-heights, and a substantially smaller DOM. Do not meet a number by making text tiny or hiding important content in inaccessible carousels.

Preferred sequence:

1. **Hero:** thesis, one-sentence explanation, one primary CTA, one secondary product CTA, restrained product proof.
2. **The turnover cost:** why current handoffs fail, concise and specific.
3. **The durable-seat mechanism:** current occupant, shadow, alumni, and inherited record. This is the differentiator.
4. **What Tenure runs:** a compact, interactive system view with real modules and administration oversight.
5. **The handoff proof:** generated handoff packet plus Tenure AI over permission-scoped sources.
6. **For the office:** approvals, portfolio oversight, succession, and auditable overrides—only accurate capabilities.
7. **Trust and fit:** imports, calendar subscription, data handling, current AI disclosure, and a link to Trust.
8. **Pilot/evidence:** only confirmed facts.
9. **FAQ and final CTA:** concise objection handling.

Move duplicate details to Product, Pilot, and Trust. One excellent instance of an argument is stronger than three near-duplicates.

#### 8.2 Product page

The Product page must answer:

- What is the durable-seat data model?
- What does an org leader do in Tenure each week?
- What does an administrator do?
- How do approvals, finance, events, messages, documents, members, memory, deliverables, reports, and AI connect?
- What is live now versus built pending cutover versus planned?
- How does a handoff actually work?

Use accurate product frames based on real information architecture, status names, seat IDs, and flows. Do not create polished fictional UI whose controls contradict the product.

#### 8.3 Pilot page

Make this page operational, not promotional. Cover:

- confirmed pilot status and scope;
- who participates;
- what Tenure and the institution each provide;
- onboarding inputs;
- implementation and support model;
- data handling and approvals;
- success measures stated as targets;
- timeline without invented dates;
- direct founder support;
- decision/next step.

If pilot status is not confirmed, this page must become a pilot proposal/interest page rather than a false announcement.

#### 8.4 Story page

Keep the origin story human and concise. Clarify founder responsibilities if approved:

- Satvik Adyanthaya: technical cofounder; product, AI systems, platform engineering.
- Almamy Diaby: business cofounder; customer development, market acquisition, operations, finance, and business development.

Do not invent biographies, titles, credentials, traction, or quotes. Add portraits only with supplied/approved assets.

#### 8.5 Trust page

This page must be credible to university IT and procurement. Use a status vocabulary such as:

- Live
- Verified in CI
- In pilot validation
- Roadmap
- Not supported

Cover tenant boundaries, role/seat access, audit behavior, encryption, document delivery, AI processing, subprocessors, retention/export/deletion reality, incident contact, SSO status, calendar directionality, and compliance roadmap. Link to Privacy and Terms. Never hide a material third-party processor behind vague “AI partners” language.

### 9. Design system: modern, quiet, unmistakably Tenure

The desired atmosphere draws from the discipline and clarity of Monarch, Vercel, and Perplexity, not from cloning their layouts. The result should feel like a premium operating system for serious organizations: minimal, data-aware, calm for long sessions, and visually memorable without spectacle.

#### 9.1 Brand principles

- Tenure’s signature accent is dark forest green.
- The durable-seat concept should have a recognizable visual language: strata, contours, rings, ledgers, rails, timelines, inherited layers, or another restrained metaphor for accumulated history.
- Professional information visualization is part of the brand.
- The product should not resemble SAP, Workday, Jira, or a generic Tailwind SaaS template.
- Avoid empty maximalism, neon gradients, glass everywhere, gratuitous blobs, over-rounded toy UI, and motion that competes with reading.

#### 9.2 Light and dark modes

Implement first-class light, dark, and system modes with a user control and persistence. Avoid pure black and pure white as large surfaces. Both modes must feel deliberately graded rather than inverted.

Create semantic tokens rather than scattering color classes:

- canvas/background
- surface/subtle/elevated
- text/secondary/muted/inverse
- border/subtle/strong
- accent/default/hover/active/subtle/on-accent
- success/warning/danger/info
- focus ring
- chart categorical and sequential scales
- shadows and overlays

Use OKLCH or another perceptually coherent system where useful. Measure contrast rather than guessing. Body text and essential UI must meet WCAG 2.2 AA; large labels, muted copy, placeholder text, charts, and focus indicators require explicit verification.

Forest green should feel deep and institutional in light mode and become a softer, legible green in dark mode without turning fluorescent. Keep color meaning consistent across modes.

#### 9.3 Typography

- Preserve a confident grotesk/sans core unless testing proves another direction.
- Use mono labels only where they convey system metadata; do not make long marketing copy look like terminal output.
- Keep body measure around 60–75 characters.
- Use responsive type with restrained `clamp()` ranges.
- Protect reading comfort at 200% zoom and on 320 px width.
- Do not communicate hierarchy through low contrast alone.

#### 9.4 Spacing and density

- Establish a coherent spacing scale and container system.
- Reduce the current excess of full-viewport sections and large empty gaps on Product, Story, and Pilot.
- Preserve breathing room while increasing information density enough to feel operational.
- Use a maximum of one dominant visual idea per section.

#### 9.5 Component approach

Do not add Radix UI merely because it is fashionable. Use Radix or React Aria primitives where they solve real focus, keyboard, dialog, menu, tabs, or disclosure behavior and the bundle tradeoff is justified. Native semantic HTML is preferred when it fully solves the problem.

Build reusable, documented primitives for:

- buttons and links;
- navigation and mobile menu;
- theme control;
- dialog/drawer;
- tabs;
- disclosure/FAQ;
- tooltip only when necessary;
- cards and data panels;
- section headers;
- product frame;
- badges/status labels;
- metric/proof blocks;
- tables on narrow screens;
- charts with text equivalents;
- CTA/contact surfaces.

Every interaction needs hover, focus, active, disabled, loading, success, error, and reduced-motion behavior as applicable.

#### 9.6 Motion

Motion should explain continuity, hierarchy, or state change. It should not be a permanent ambient tax.

- Prefer 120–240 ms interface transitions and slower only for narrative sequences.
- Pause auto-rotating product demos on hover, focus, off-screen state, background tabs, and reduced motion.
- Provide manual controls and an accessible pause when content changes automatically.
- Do not smooth-scroll users who request reduced motion.
- Avoid entrance animation that leaves content opacity-zero when JavaScript fails.
- Eliminate screenshot nondeterminism.

### 10. Conversion architecture

Use one primary conversion phrase consistently. “Contact Sales” is acceptable but may be too enterprise-generic for an early founder-led pilot. Test a more specific version such as “Book a Tenure walkthrough” or “See your handoff in Tenure,” while retaining accurate expectations.

Fix the current Calendly experience:

- remove the globally initialized floating Calendly badge;
- do not load Calendly CSS/JS on every route before intent;
- avoid an embedded third-party cookie panel dominating Tenure’s interface;
- prefer a first-party `/contact` page or accessible dialog with clear context;
- lazy-load scheduling only after explicit action, or open the scheduling page in a new tab;
- always provide `hello@tenurework.com` as a visible fallback;
- do not submit or expose PII without clear consent;
- instrument CTA events without recording form contents or email addresses.

If a contact form is implemented, specify ownership and delivery, validate server-side, protect against spam and abuse, provide success/error states, and do not claim submission works until an end-to-end delivery test proves it. A reliable email link plus scheduler is better than a decorative broken form.

### 11. SEO and discoverability

Implement using the correct Next.js 16 App Router conventions from installed docs.

Required:

- route-specific title, description, canonical, Open Graph, and Twitter metadata;
- concise descriptions written for each page’s intent rather than one oversized site-wide paragraph;
- `robots.ts`/`robots.txt` with the correct production host;
- `sitemap.ts`/`sitemap.xml` containing all intended indexable routes and excluding non-public paths;
- a branded and useful 404;
- correct `lang` and, if localization is later introduced, accurate alternate URLs;
- stable favicon, Apple icon, manifest, and social image behavior;
- Organization and WebSite structured data using only factual fields;
- SoftwareApplication structured data only if category, availability, offers, and other properties are accurate;
- no fabricated reviews, ratings, pricing, address, founding data, or customer count;
- semantic headings with one clear H1 per page;
- descriptive internal links;
- social images tested at target dimensions and safe areas.

Do not add schema solely for the appearance of SEO sophistication. Validate structured data and rendered metadata in tests.

### 12. Accessibility: WCAG 2.2 AA is a release gate

Add automated and manual coverage for:

- skip link as the first keyboard destination;
- one main region and sensible landmark labels;
- one H1 and no skipped hierarchy where it changes meaning;
- full keyboard operation for navigation, menu, theme, tabs, FAQ, demo controls, contact UI, and dialogs;
- focus containment and restoration for modal surfaces;
- visible focus never obscured by the fixed header or floating controls;
- no keyboard trap;
- target size at least WCAG 2.2 minimum, with larger targets for primary mobile actions;
- contrast of text, icons, focus indicators, charts, and controls in both themes;
- 320 CSS px reflow without horizontal page scroll;
- 200% text zoom and browser zoom;
- meaningful alt text and empty alt for genuinely decorative images;
- accessible names for icon-only controls;
- ARIA state synchronized with visual state;
- reduced motion and no essential information conveyed only by animation;
- chart summaries, labels, and/or data tables;
- screen-reader announcement for dynamic demo state only when it is user initiated.

Use axe in Playwright plus focused assertions. Axe is not a substitute for keyboard, zoom, contrast, or screen-reader reasoning.

### 13. Performance and reliability budgets

Measure before and after. Target on mobile production builds:

- Lighthouse Performance ≥ 90;
- Accessibility ≥ 95, with a goal of 100;
- Best Practices ≥ 95;
- SEO ≥ 95;
- LCP ≤ 2.5 s;
- CLS ≤ 0.1;
- INP proxy/interaction responsiveness ≤ 200 ms in lab scenarios;
- no route-level JavaScript added without a reason;
- no global third-party script before user intent unless essential;
- no unoptimized hero image or incorrect `sizes`;
- fonts self-hosted, subset appropriately, and loaded without layout shift;
- animation and contour effects that stay within paint/compositing budgets;
- long pages that do not mount every animated visualization eagerly.

Use real measurements, not visual intuition. Document any unavoidable exception and its owner.

### 14. Security and privacy for the marketing site

Review and implement appropriate headers without breaking required assets:

- Content-Security-Policy;
- Referrer-Policy;
- Permissions-Policy;
- X-Content-Type-Options;
- frame/embed policy;
- HSTS at the hosting layer where appropriate.

Minimize third-party code. Inventory every external origin and why it is needed. Ensure external new-tab links use the appropriate relationship attributes. Do not embed provider scripts globally when a normal link satisfies the task.

Privacy and Terms are starting drafts, not finished legal instruments. Flag them for counsel and verify:

- correct legal entity/operator name;
- effective date;
- contact method;
- subprocessors and AI provider;
- categories of data;
- purposes and lawful/contractual basis as applicable;
- retention, export, deletion, and institutional ownership reality;
- student/education data wording;
- international processing if global deployments are discussed;
- liability and pilot terms;
- change-notice process.

Do not leave template placeholders on the public site. If required legal facts are unknown, block the affected legal claim and ask one focused question.

### 15. Automated landing-site test system

Add a first-party Playwright test suite and scripts such as `test:e2e`, `test:visual`, and `test:a11y`. Use `@playwright/test` unless a repository-specific constraint requires another supported approach.

#### 15.1 Route and navigation tests

- every public route returns the expected page;
- header and footer links reach the correct route;
- active navigation state is correct after client navigation and direct load;
- mobile menu opens, traps no focus, closes on Escape, closes on selection, and restores focus;
- unknown route renders branded recovery with a home/product link;
- no internal link returns 404;
- mail and external links have correct targets and relationships.

#### 15.2 Interaction tests

- CTA opens the intended first-party contact/scheduling flow;
- scheduler fallback works when third-party script is blocked;
- all product demo tabs select and render matching content;
- tab semantics and arrow-key behavior are correct if using ARIA tabs;
- term controls update occupant/history content;
- FAQ disclosures open, close, and report state;
- theme supports system/light/dark and persists without hydration flash;
- reduced-motion disables nonessential motion;
- auto-tour pause rules work;
- no fatal first-party console/page error appears.

#### 15.3 SEO tests

For every route, assert:

- title and description exist and are route-specific;
- canonical equals the route’s final production URL;
- OG/Twitter values are valid;
- exactly one H1;
- index/noindex status is intentional;
- sitemap contains the route when indexable;
- robots references the sitemap and does not accidentally block production;
- JSON-LD parses and contains no placeholder or prohibited property.

#### 15.4 Accessibility tests

Run axe in light and dark modes on all routes and cover the manual behaviors listed in Section 12. Include a 320 px reflow test, minimum target-size test, skip-link test, focus-not-obscured test, reduced-motion test, and heading/landmark test modeled with the same rigor as Parent’s `a11y.spec.ts`.

#### 15.5 Visual regression

Create stable screenshots for all core routes in both themes at mobile and desktop. Mask or freeze only genuinely nondeterministic data. Never mask layout defects. Include focused component shots for:

- hero;
- durable-seat mechanism;
- platform demo each module state;
- handoff packet;
- administration console proof;
- contact surface;
- mobile navigation;
- footer;
- legal typography.

Use a reviewed baseline and a documented update command. A changed screenshot is evidence to inspect, not a file to automatically accept.

#### 15.6 Claims and copy tests

Add ratchets that catch known failure classes:

- no unsupported integration names;
- no “FERPA compliant,” “SOC 2 compliant,” “row-level security,” “hash-chained,” “nothing leaves your tenant,” “answers anything,” or similar prohibited absolutes unless a claim-register entry explicitly authorizes the exact phrase;
- no provider mismatch between runtime evidence and public Privacy/Trust copy;
- no definitive pilot/partner language without an approved claim record;
- no concatenated email/text spacing regressions;
- no hardcoded metrics without a source and status.

### 16. Implementation phases

Maintain `docs/LANDING-REFINEMENT-LEDGER.md`. Each item is unchecked until implementation, tests, and evidence exist. Use final statuses `PASS`, `FAIL`, `BLOCKED_EXTERNAL`, or `NOT_APPLICABLE`; do not use “partial” as a completion status.

#### Phase 1 — Truth, legal, and indexing

- fix route-specific canonical and metadata;
- add robots and sitemap;
- fix visible Pilot and Privacy spacing defects;
- establish claims register;
- correct false/overstated claims;
- resolve pilot/partner/logo language with evidence or block it;
- create accurate AI provider gate;
- update Privacy/Terms status and Trust-page plan;
- update obsolete README and internal docs.

Gate: no knowingly false public claim, all public routes index correctly, build passes.

#### Phase 2 — Information architecture and copy compression

- map every current section to keep, merge, move, or remove;
- reduce home-page repetition and density;
- assign Product, Pilot, Story, Trust, and Contact distinct jobs;
- rewrite for concrete mechanisms rather than unsupported metrics;
- preserve the institutional-memory thesis and the strongest product proof.

Gate: content review, word/DOM/scroll comparison, no lost essential buyer answer.

#### Phase 3 — Design foundations

- semantic tokens;
- excellent light/dark/system themes;
- typography, spacing, radii, elevation, and chart palettes;
- accessible primitives;
- visual continuity motif;
- theme persistence with no flash;
- component documentation.

Gate: contrast and responsive foundations pass before route polishing.

#### Phase 4 — Route and component implementation

- implement revised home and supporting pages;
- refine product demo and durable-seat visuals;
- make administration proof visible but accurate;
- replace Calendly global badge/embed behavior;
- implement Contact and Trust routes if approved by the IA;
- implement mobile/navigation/footer/legal refinements;
- preserve no-JS content readability.

Gate: every route functions by mouse, keyboard, touch-sized controls, and reduced motion.

#### Phase 5 — Test and performance system

- Playwright functional suite;
- accessibility suite;
- visual baselines;
- SEO and claims ratchets;
- internal link checker;
- Lighthouse/size budgets;
- CI workflow using pinned actions and least permissions.

Gate: all suites pass locally and in CI; no production deployment occurs as a side effect.

#### Phase 6 — Adversarial review

Perform independent review passes as these personas:

1. university IT/security reviewer;
2. OSE director managing dozens of organizations;
3. incoming student-org treasurer with no context;
4. procurement/legal reviewer;
5. skeptical enterprise operations leader;
6. keyboard-only and low-vision user;
7. mobile visitor on a slow network;
8. recruiter/investor trying to determine whether the product is real.

For each, identify the first trust failure, first comprehension failure, first blocked action, and any claim that would not survive a live demo.

Gate: resolve every P0/P1 finding or record a named external blocker.

#### Phase 7 — Release evidence and handoff

- rerun clean install where practical;
- run lint, type check, tests, builds, visual checks, and link checks;
- inspect git diff and generated files;
- confirm no secrets or personal data;
- produce before/after measurements;
- update ledger and claims register;
- commit coherent changes to the working branch;
- do not merge or deploy without authorization.

### 17. Required final deliverables in the repository

At minimum, leave:

- implemented landing-site changes;
- automated Playwright functional tests;
- automated accessibility tests;
- visual-regression baselines and update instructions;
- route-specific metadata, sitemap, robots, and structured data;
- `docs/PUBLIC-CLAIMS-REGISTER.md` or structured equivalent;
- `docs/LANDING-REFINEMENT-LEDGER.md`;
- updated README matching the actual design and commands;
- a concise architecture/content map;
- an evidence report with commands and results;
- any legal/external blockers clearly separated from engineering defects.

If this Bible is stored in the repository, make root `CLAUDE.md` point to it after `AGENTS.md`, while keeping the root file concise and avoiding duplicate instructions that will drift.

### 18. Required final response format

Lead with the outcome. Then report:

1. what changed and why;
2. highest-risk claims corrected or blocked;
3. live-versus-Parent-versus-roadmap distinctions preserved;
4. before/after page-density and performance measurements;
5. light/dark/responsive/accessibility outcomes;
6. exact tests and builds run with pass/fail counts;
7. screenshots or artifact paths;
8. commit SHA/branch;
9. remaining `BLOCKED_EXTERNAL` items, especially legal or partnership approval;
10. the precise next safe action.

Do not say “everything is complete” while a mandatory gate is unchecked. Do not report a test as passing unless you ran it. Do not say a claim is supported when the evidence lives only in a roadmap or a different, not-yet-deployed repository.

### 19. Quality bar

The finished site should create this impression in under one minute:

> Tenure understands the operational cost of turnover at a deeper level than generic collaboration software. It has a specific data model—the durable seat—a real governed product behind it, and a team honest enough to distinguish what is live, what is being validated, and what comes next.

The result must be modern enough to feel like the future of organizational software, rigorous enough for a university security review, calm enough to read for a long time, and concrete enough that a prospect can imagine their own handoff inside it.

Begin now with Phase 0. Do not redesign from memory. Establish truth, record evidence, and then implement.

## END CLAUDE CODE PROMPT
