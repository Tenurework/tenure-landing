# Tenure Landing — Refinement Ledger

Working branch: `refine/landing-bible-v1`
Baseline commit: `fb6a3bd2f1cfaef20abb4c2e62085bc8d8a527dc`

Statuses are **PASS**, **FAIL**, **BLOCKED_EXTERNAL** or **NOT_APPLICABLE**. There is no
"partial": an item that is half done is FAIL until it is not.

An item is not done because it exists. It is done when it is integrated, exercised by something
that would fail if it broke, and documented.

---

## Repository baselines

Recorded 2026-08-02. All three fetched and verified at these commits.

| Repository | Role | Commit | Notes |
|---|---|---|---|
| `Tenurework/tenure-landing` | This repo | `fb6a3bd` | Next.js 16.2.9, React 19.2.4, Tailwind 4. Clean worktree at start. Recorded here as `satvikOS/tenure-landing`, which is now a redirect: the repository was transferred to the `Tenurework` organization, and the GitHub API resolves both names to `Tenurework/tenure-landing`. It is public. |
| `satvikOS/Tenure` | **Deploying** — determines what may be called live | `819aec0e` | App under `apps/web/`. 132 e2e across 28 specs; **320** unit tests across 23 jest suites — recorded here as 292, which `npx jest --ci` disproves at this very commit. |
| `satvikOS/Tenure-Parent` | Canonical development engine | `1c03db8f` | Now a full monorepo (675 files, ~79.6k lines). **3 commits ahead of the bible's stated baseline `e1cfbe82`.** |

**Correction to the bible's stated baseline.** §6 lists Parent at `e1cfbe82`. Parent had moved to
`1c03db8f` by the time work began, and the local checkout was 279 commits behind and still
docs-only. Both were resolved before any claim was verified.

---

## Phase 0 — Establish current truth

| Item | Status | Evidence |
|---|---|---|
| Record baselines for all three repositories | PASS | Table above |
| Read landing `AGENTS.md` / `CLAUDE.md` before editing | PASS | `AGENTS.md` warns Next 16 differs from training data; installed docs under `node_modules/next/dist/docs/` were read before any Next API was used |
| Read Parent review findings, ledger and decisions before trusting architecture docs | PASS | `REVIEW-FINDINGS.md`, `global-engine-execution-ledger.md`, `PRODUCT-DECISIONS.md` (PD-004) |
| Live-site read-only audit of every public route | PASS | 9 routes; metadata, density, console, keyboard, interaction |
| Baseline screenshots at 7 widths | PASS | 1440×1000, 1280×800, 1024×768, 768×1024, 390×844, 360×800, 320×800 |
| Landing baseline commands (`npm ci`, lint, build) | PASS | All exit 0 at baseline |
| Product-repo full E2E against a disposable database | NOT_APPLICABLE | Out of scope for a landing-site change. The product suites were enumerated, not executed; no claim in this work rests on a run that did not happen. |
| Claims register created | PASS | `src/lib/claims.ts` (32 claims) + generated `docs/PUBLIC-CLAIMS-REGISTER.md` |
| CI check that fails on an unsupported or unevidenced claim | PASS | `e2e/claims.spec.ts` |

### Baseline findings reproduced

The bible's §6 findings were re-checked rather than trusted. Fourteen reproduced; two did not
hold as written.

| # | Finding | Verdict |
|---|---|---|
| 1 | Every non-home route canonicalises to the home page | **CONFIRMED** |
| 2 | `/robots.txt` and `/sitemap.xml` return the 404 page | **CONFIRMED** |
| 3 | Home ≈3,176 words / 1,987 DOM / 51 headings / 19.6vh | **CONFIRMED** — measured 3,185 / 1,992 / 51 / 18.3vh |
| 4 | Other routes ≈5 viewport-heights | **CONFIRMED** — 3.4–5.3vh |
| 5 | Calendly popup + floating badge, third-party cookie panel | **CONFIRMED and worse** — loaded on all 7 routes including the 404 |
| 6 | Demo tabs work | CONFIRMED |
| 7 | Term/succession controls work | CONFIRMED |
| 8 | FAQ accordions work, one at a time | CONFIRMED — native `<details>` |
| 9 | No first-party console error | CONFIRMED |
| 10 | `/pilot` renders "Student Engagementisn't" | **CONFIRMED** |
| 11 | `/privacy` renders `hello@tenurework.comand` | **CONFIRMED** |
| 12 | All pages use the root description; route metadata incomplete | **PARTLY WRONG** — `<title>` and `<meta name=description>` *were* route-specific. What was actually shared site-wide was the **OpenGraph and Twitter block**, including `og:url`, and there was **no JSON-LD on any route**. Restated below. |
| 13 | Light mode only | **CONFIRMED** — `color-scheme: light` hard-pinned in three places |
| 14 | README describes an obsolete dark editorial/brass design | **CONFIRMED** |
| 15 | Muted text too low-contrast, needs measurement | **CONFIRMED and quantified** — 177 failures; `#8a97a4` at 2.98:1 caused 58 |
| 16 | Screenshot scripts but no Playwright suite | **CONFIRMED** |

### Defects found that the baseline did not list

| ID | Severity | Finding |
|---|---|---|
| N-01 | **P0** | **The conversion path failed silently.** With `calendly.com` blocked, all five "Contact Sales" CTAs did nothing: `openCalendlyPopup` awaited the third-party script and only then called `window.open`, outside the user-gesture window, so popup blockers dropped it. Reproduced against production. |
| N-02 | **P0** | **118 elements shipped at inline `opacity:0`** on the home page (27 `/product`, 23 `/story`, 30 `/pilot`) because motion serialises `initial` into a style attribute. Without JavaScript the page was largely invisible. |
| N-03 | **P0** | The primary CTA failed AA: white on `#1c8c5a` is **4.24:1**. |
| N-04 | P1 | OpenGraph/Twitter identical on every route; `og:url` pointed at the home page, so a share of `/pilot` unfurled as the home page. |
| N-05 | P1 | Zero structured data on any route. |
| N-06 | P1 | No skip link; first tab stop was the logo. |
| N-07 | P1 | Mobile menu never moved focus in or restored it on close. |
| N-08 | P1 | Term/succession controls measured **6×6 px** against the WCAG 2.2 24×24 minimum. |
| N-09 | P1 | No `aria-current` on the active navigation link. |
| N-10 | P1 | Only HSTS present. No CSP, Referrer-Policy, Permissions-Policy, X-Content-Type-Options or frame policy. |
| N-11 | P2 | A stray `C:\Users\adiab\package-lock.json` makes Next infer the wrong workspace root on every build. |
| N-12 | P2 | `--color-violet` / `--color-sky` shadow Tailwind's own scales, so `bg-violet` and `bg-violet-500` were different colours one keystroke apart. |

### Escalation — outside this repository, cannot be fixed here

| ID | Severity | Finding |
|---|---|---|
| **X-01** | **P0** | `github.com/satvikOS/Tenure` is **still a public repository, and the real student roster is still retrievable from git history.** Untracking it in `63db4eb` did not redact it: `git show d799608:scripts/roster-data.mjs` returns real names and `@simon.rochester.edu` addresses for ~153 students and 19 advisors, and `Tier1/*.xlsx` is likewise still reachable. The bible makes that repository read-only for this work, so it is escalated rather than fixed. Remediation is a history rewrite plus a GitHub cache purge, or making the repository private. **History is already exposed; treat the addresses as disclosed.** |
| X-02 | P1 | `ANTHROPIC_API_KEY` is injected as a **plaintext** ECS environment variable (`ecs.tf:204` uses `value =`), while every other secret in the same file uses `valueFrom`. Visible to anyone with `ecs:DescribeTaskDefinition`. |
| X-03 | P1 | Production runs `AUTH_DEV_LOGIN=true` **and** `ALLOW_DEV_LOGIN_IN_PRODUCTION=true`. The site correctly claims no SSO; this is a product exposure, not a copy defect. |

---

## Phase 1 — Truth, legal and indexing

**Gate: no knowingly false public claim; all public routes index correctly; build passes.** — **PASS**

| Item | Status | Evidence |
|---|---|---|
| Route-specific canonical | PASS | `src/lib/metadata.ts`; verified in build output for all 8 routes |
| Route-specific OpenGraph / Twitter | PASS | Each route emits its whole block; no inheritance |
| `robots.ts` | PASS | Serves at `/robots.txt` with absolute sitemap + host |
| `sitemap.ts` | PASS | 8 routes, derived from `routes.ts` |
| Branded 404 returning a real 404 status | PASS | `src/app/not-found.tsx`; verified `HTTP 404`, not the streamed 200 Next 16 would otherwise return |
| Organization + WebSite JSON-LD | PASS | `StructuredData.tsx`; deliberately omits rating/offers/address/foundingDate |
| `/pilot` spacing defect | PASS | Fixed with explicit `{" "}` |
| `/privacy` spacing defect | PASS | Fixed with explicit `{" "}` |
| Claims register established | PASS | 32 claims with evidence, commit, availability, owner, expiry |
| False/overstated claims corrected | PASS | See table below |
| Pilot/partner language resolved | PASS | Downgraded to planned/proposed on owner's confirmation that it is verbal only |
| Logo usage rights | PASS | Owner confirmed written permission for both marks (`C-022`) |
| AI provider gate | PASS | Verified first-hand in both repos; copy keeps Anthropic |
| Privacy/Terms status | PASS | Counsel-review banner added; entity position stated |
| README rewritten | PASS | See Phase 7 |

### Claims corrected in this phase

| Claim | Was | Now |
|---|---|---|
| Audit coverage | "100% of actions logged" | Privileged actions, create-only, allows **and** denials. Phase 1 replaced the false 100% with "49 of 63 on `/trust`"; **Phase 8 withdrew that fraction too** — it did not survive a recount and its exclusion list was wrong. No fraction is published now |
| Approval chain | 5 steps incl. a phantom "Advisor" gate | Draft → President → OSE → Approved (2 gates, 7 types) |
| Policy snapshot | "snapshots the exact policy in force, so you can prove the rules" + "policy v4 · frozen 2026-09-12" | Records the deciding seat, transition and reason. `policySnapshot` is never read back, so the old claim was unprovable |
| Messaging | "delivery across in-app, email, and push" + "sensitivity" | Four conversation types. Every write is `in_app`; `Message` has no sensitivity field |
| Access model | "least-access by default" | "Access follows the seat" — an institution account can read every organization |
| AI speed | "instant answers" | "sourced answers" — retrieval is keyword AND-matching, no embeddings |
| Approval types | 6 of 7 listed | All 7, including `EXCEPTION` |
| Metrics band | 3-day onboarding, 0 knowledge lost | 26 organizations / 209 seats, 2 gates / 7 types, 0 records deleted, 132 e2e tests — all counted from the deploying repo |
| Pilot | "OSE **is** standing Tenure up across every org" | "We are **planning** a Fall 2026 pilot… proposed, not contracted" |
| Story record | "Partner: OSE" | "Built with: OSE" — and **Phase 8 downgraded it again**, to "Proposed pilot with". Nothing has been built with the office: `/pilot` says "Who would sign — Nobody yet" |

---

## Phase 2 — Information architecture and copy compression

**Gate: content review, word/DOM/scroll comparison, no lost buyer answer.** — **PASS**

| Item | Status | Evidence |
|---|---|---|
| Every section mapped keep/merge/move/remove | PASS | [`ARCHITECTURE-AND-CONTENT-MAP.md`](ARCHITECTURE-AND-CONTENT-MAP.md) |
| Home-page density materially reduced | PASS | Measured, below |
| Distinct job per route | PASS | `/trust` and `/contact` added; `routes.ts` records each route's intent |
| No essential buyer answer lost | PASS | Moved content landed on `/product`; security depth landed on `/trust` |

### Measured, prerendered HTML, before vs after

| Route | Words | Elements | Headings |
|---|---|---|---|
| `/` | **3,185 → 1,975** (−38%) | 1,992 → 1,561 (−22%) | **51 → 33** (−35%) |
| `/product` | 721 → 1,274 | 463 → 708 | 12 → 24 |
| `/pilot` | 663 → 708 | 348 → 374 | 15 → 15 |
| `/story` | 441 → 463 | 296 → 322 | 8 → 8 |
| `/privacy` | 743 → 908 | 202 → 234 | 11 → 11 |
| `/terms` | 702 → 777 | 195 → 224 | 11 → 11 |
| `/trust` | new — 1,611 | new — 433 | new — 37 |
| `/contact` | new — 292 | new — 228 | new — 7 |

> **This table is a Phase 2 snapshot, and Phase 6 invalidated part of it.** Re-measured on
> 2026-08-03 it does not hold: `/pilot` is not 708 words but roughly 3,180, and `/trust`,
> `/terms` and `/privacy` all grew substantially too. Nothing was misreported at the time —
> Phase 6 rewrote `/pilot` into an operational proposal and added governing law, confidentiality,
> a wind-down clause and a 72-hour incident obligation to `/terms`, and nobody re-measured
> afterwards. Current figures are in Phase 8. The lesson worth keeping is that a measurement
> table needs a date and a re-run, or it silently becomes a claim about a build that no longer
> exists.
>
> A note on method, because the two passes count differently: the figures above count the main
> content, the Phase 8 figures count every word in the prerendered document including nav,
> footer and screen-reader-only text. Neither is wrong; they are not comparable.

`/product` grew because three sections moved onto it; `/privacy` and `/terms` grew because each
gained a counsel-review notice and an honest statement of a limit. Those are the intended
trades: the home page carries the argument, the other routes carry the detail.

**Home landed at 1,975 words against the bible's 1,400–1,800 target — 175 over, and recorded
rather than hidden.** The remaining copy is disproportionately evidence rather than prose: the
handoff packet mock (seat rows, position codes, contacts, budget figures) is ~117 words, and
Platform's tag rows carry the seven approval types, six knowledge-card kinds, four conversation
types and the three seat states in about thirteen words. Cutting those would meet the number by
deleting the proof, which §8.1 explicitly forbids. Prose proper fell far harder than the
headline figure suggests — Handoff's prose went 265 → 112, Platform's descriptions 411 → 209.

### Payload

The decorative contour field emitted 208 `<path>` elements and 200KB of path data, which ships
twice — once in the DOM and again in the RSC flight payload — for a background rendered at
6–13% opacity. Roughly two thirds of the home page's HTML was ornament.

| | Before | After |
|---|---|---|
| Home HTML | 640 KB | **453 KB** (−29%) |
| Contour grid | 66 × 38, 1-decimal coords | 48 × 28, integer coords |

---

## Phase 3 — Design foundations

**Gate: contrast and responsive foundations pass before route polishing.** — **PASS**

| Item | Status | Evidence |
|---|---|---|
| Semantic tokens | PASS | `globals.css` — canvas/surface/text/border/accent/status/chart, with legacy names aliased onto them |
| Light, dark and system themes | PASS | `ThemeScript.tsx` + `ThemeToggle.tsx`, persisted, no flash |
| Theme persistence without hydration flash | PASS | Inline head script per Next 16's documented pattern; `next/script` `beforeInteractive` explicitly does not block hydration and was rejected |
| Measured WCAG AA across both themes | PASS | `scripts/check-contrast.mjs` — **72/72** pairs |
| Guard against dark-theme drift | PASS | Same script asserts the two dark blocks agree on all 38 tokens |
| Colour literals removed | PASS | 78 replaced across 24 files; zero `rgba(` and zero raw hex remain in `src/` |
| Focus ring visible on every surface | PASS | Separate `--focus-ring-inverse` for the navy bands, which the light ring hit at 2.11:1 |

---

## Phase 4 — Route and component implementation

| Item | Status | Evidence |
|---|---|---|
| Global Calendly badge removed | PASS | Deleted; zero calendly references in prerendered HTML on all routes |
| First-party `/contact` | PASS | Plain-anchor scheduler + visible email fallback + on-demand embed |
| `/trust` implemented | PASS | Five-level status vocabulary; states what is **not** supported |
| Skip link | PASS | First focusable element on every route |
| Mobile menu focus management | PASS | Focus moves in, is contained, and returns to the trigger on Escape |
| `aria-current` on active nav | PASS | Desktop and mobile |
| No-JS content readable | PASS | Prerendered `opacity:0`: 118 → 8 on home; 0 on `/story`, `/pilot`, `/trust`, `/contact` |
| Security headers | PASS | `next.config.ts` — CSP + X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options, HSTS, with a wider CSP scoped to `/contact` alone so Calendly cannot be introduced anywhere else without a reviewable diff. This row said *pending → Phase 5* long after the work landed, and Phase 5 had no row to receive it. |

---

## Phase 5 — Test and performance system

**Gate: all suites pass locally; no production deployment as a side effect.** — **PASS**

> **Corrected 2026-08-03.** This gate read *FAIL (2 tests)* and the table below recorded
> "1,030 passed · 2 failed". That was stale: the two `ProductAtWork` contrast failures were
> fixed before the branch head, and `EVIDENCE-REPORT.md` recorded the corrected figure while
> this file kept the old one. Re-run on 2026-08-03 against the branch head: **1,052 passed ·
> 0 failed · 16 skipped**, exit 0, 8.6 minutes, four browser projects. The performance-budget
> row below was the genuinely unmet part of this gate, and it is now measured — see Phase 8.

| Item | Status | Evidence |
|---|---|---|
| Playwright functional suite | PASS | `nav.spec.ts`, `interaction.spec.ts` — 64 passed, 0 failed |
| SEO suite | PASS | `seo.spec.ts` — 69 tests |
| Claims ratchet | PASS | `claims.spec.ts` — 42 tests |
| Accessibility suite | PASS | `a11y.spec.ts` — 268/268 across 4 projects. The 2 `/product` failures this row used to record were fixed before the branch head |
| Visual baselines | PASS | 74 snapshots, 4 projects, stable on a second run |
| Internal link checker | PASS | 111 links, 0 broken |
| Contrast gate | PASS | 72/72 across both themes |
| CI workflow, pinned actions, least privilege | PASS | SHA-pinned, `contents: read`, never deploys |
| Performance budgets | FAIL → measured in Phase 8 | Payload cut 29% and the cause identified, but no Lighthouse measurement was taken. Taking one was the first thing Phase 8 did, and it failed on all 8 routes |

**Full suite, four projects: 1,052 passed · 0 failed · 16 skipped** (re-run 2026-08-03).

The 2 `/product` failures this section used to describe — `ProductAtWork`'s card transitioning
opacity, caught mid-transition by the contrast walk — were fixed at source before the branch
head. They are recorded here because the fix, not the failure, is the useful history: an
infinite opacity loop had been putting text below AA permanently, and two successor forms of
the same bug were fixed with it.

### What the suite caught that nothing else did

The a11y suite found a defect the contrast gate structurally could not: `text-inverse` resolved
to the navy **surface** token, because Tailwind generates `text-*` from every `--color-*` entry.
61 usages across 13 files were painting navy text on navy at **1.00:1** — invisible. The token
gate validates PAIRS; this was a NAMING collision. Both layers were needed, and the second one
found what the first could not see.

---

## Phase 6 — Adversarial review

**Gate: resolve every P0/P1 or record a named external blocker.** — **PASS**

> **Status corrected 2026-08-03.** This read `PARTIAL`, which is not one of the four statuses
> this document allows — the rule at the top says an item that is half done is FAIL until it
> is not. At the time it was written the P1 backlog was genuinely open, so the honest label
> was FAIL. It has since been closed (see "P1 backlog — resolved" below) and the remaining
> items are named external blockers, so the gate is now PASS on its own terms rather than by
> inventing a fifth status.

Eight personas reviewed the site independently: university IT security, OSE director, incoming
treasurer, procurement/legal, enterprise operations, keyboard/low-vision, slow mobile, and
investor/recruiter. Full output in
[`ADVERSARIAL-REVIEW-FINDINGS.md`](ADVERSARIAL-REVIEW-FINDINGS.md).

**144 findings: 22 P0 · 53 P1 · 47 P2 · 22 P3.**

The signal worth acting on first was agreement: five separate personas independently flagged the
same pilot-language defect, four flagged the same "immutable" contradiction, and four flagged
the same unanswerable AI demos.

### What they caught that the automated gates could not

| Finding | Why the ratchet missed it |
|---|---|
| Home page chip read **"Immutable audit trail"** while `/trust` warns buyers to interrogate that exact word | `forbiddenPhrases` blocked `tamper-proof` and `hash-chained`, never `immutable` |
| `/story` asserted the uncontracted pilot in the **present tense** — "Every organization … puts Tenure to work" — under a heading boasting about honesty | The hedge test only fired on sentences containing both the office name **and** the literal string "Fall 2026". This said "this fall" |
| `/pilot` told third-party organizations **"you're in"** | Same gap |
| Every AI demo showed an answer the retrieval layer **cannot produce** — a budget figure, a caterer's overspend, a `Bylaws §4` citation | The ratchet checks words, not whether a rendered mock is answerable |
| **"policy v4 snapshot"** still shipped in `HeroFloatingCards` | It was removed from `DashboardMock` only. The evidence report wrongly recorded it as gone |
| **"Ask anything"** shipped inside the hero mock | Not in the blocklist |
| `/trust` documented **no authentication control at all** | Nothing tests for an absent section |
| `/pilot` said advisors see only their own orgs; `/trust` says any institution account reads every organization | No cross-page consistency check exists |
| Two auto-rotating regions could only be paused **with a mouse** — WCAG 2.2.2, Level A | axe cannot detect a missing pause affordance |

### Resolved in this pass

All P0s above are fixed, plus four new ratchet rules (`immutable`, `ask anything`, `policy vN`,
`days not a semester`) so they cannot return. The last of those immediately caught a surviving
instance on `/product` that the personas had also flagged — the rule paid for itself before it
was committed.

The pause controls fixed a real Level A gap **and** a test flake: the parallel a11y run had been
failing intermittently because axe sampled an auto-rotating region mid-transition. Root cause and
symptom were the same defect.

### P1 backlog — resolved

| Theme | Disposition |
|---|---|
| **Legal, `/terms`** | Deemed acceptance removed (30 days' notice, no retroactive application, exit with export). Added governing law and venue, mutual confidentiality, publicity, notices, assignment, severability, entire agreement, a 72-hour incident obligation, a wind-down clause, a fees clause, and a plain statement that with no entity we cannot offer indemnities or insurance. "Process it to provide **and improve** the service" removed — that phrase swallows the school-official posture. |
| **Deletion contradiction** | `/privacy` now splits it honestly: personal details removable, an organization's whole record exportable and deletable, individual entries **not** erasable from a seat's history on a departing person's say-so — which is the product working as designed. `/trust` states the same limit from the product side. |
| **Subprocessors** | Full list published on `/privacy`: AWS (hosting, US regions), Anthropic (model), Vercel (this website only), Calendly (scheduling, `/contact` only). `/trust` cross-references it. Registered as `C-036`. |
| **Missing `/trust` controls** | Added encryption in transit (TLS 1.2, verified), backups with **one-day retention stated as the number to push us on**, restore testing as *Not supported*, and the breach commitment. Registered as `C-033`–`C-035`. |
| **Tenant isolation headline** | "15 of 39 models" moved from the footnote into the heading. |
| **University mark captioned as a pilot** | Now "Origin & support" with an explicit non-endorsement note. |
| **`MetricsBand` rendered 0** | Root cause removed: `useInView` with a 40% threshold is gone, the real value is the server-rendered and every-degraded-path state, and the count-up cannot strand it. The seeded count carries "Seeded model — not customers, not users" on its face. |
| **Performance** | `SmoothScroll` no longer changes element type after hydration — it was unmounting and remounting the whole document one frame in. Lenis never loads on a coarse pointer. The header's session-long backdrop blur is a near-opaque fill, blurred only for fine pointers. |
| **Hero** | Paragraph and both CTAs paint with the document; opens on a concrete image; and there is finally a path for someone who already has Tenure. |
| **Secondary buttons** | Moved onto a token that clears 3:1, so the control's edge is perceivable. |
| **Calendly consent** | `hide_gdpr_banner` removed — we were switching off a third party's consent prompt while publishing no cookie notice of our own. |
| **Founders anonymous** | Each now carries a specific responsibility split. No invented biography, credential or photograph. |

### Still open

| Item | Why it is not a code change |
|---|---|
| **No screenshots, video or demo recording** | Nothing on the site is independently checkable. `ProductAtWork` now states plainly that its surfaces are illustrations rather than screenshots, but real artefacts are a content deliverable. |
| **No application URL** | There is no public app host anywhere in the repository, so the new sign-in path points at `/contact` rather than an invented hostname. Confirm the URL and the link can be direct. |
| **`/pilot` success measures** | Restructured as an operational proposal, but the targets are ours. They should be agreed with the office before the page claims them jointly. |

---

## Phase 7 — Release evidence and handoff

**PASS** — see [`EVIDENCE-REPORT.md`](EVIDENCE-REPORT.md).

| Item | Status |
|---|---|
| Lint, typecheck, contrast, links, build | PASS |
| Test suites run and reported honestly | PASS |
| Before/after measurements | PASS |
| No secrets or personal data in the diff | PASS |
| Committed to the working branch | PASS — **12** commits, head `2c13adc`. This row said "6 commits, head " with the SHA missing; `git rev-list --count origin/main..2c13adc` returns 12 |
| Not merged, not deployed | PASS |

---

## Phase 8 — Verification pass, 2026-08-03

A second pass over the same bible, starting from the assumption that nothing in these
documents was true until re-checked. Two things came out of it: the one performance gate that
had never been measured was measured and failed, and 29 claim defects survived independent
adjudication despite a 1,052-test suite passing green.

### 8.1 What re-running the gates found

| Gate | Recorded state | Re-measured 2026-08-03 |
|---|---|---|
| lint · typecheck · contrast · build | PASS | PASS — 0, 0, 72/72, 0 |
| Full Playwright suite | "FAIL, 1,030 passed · 2 failed" (ledger) vs "1,052 passed · 0 failed" (evidence report) | **1,052 passed · 0 failed · 16 skipped**, exit 0, 8.6 min. The ledger was stale; the evidence report was right |
| Internal links | 111 / 0 broken | 111 / 0 broken |
| **Lighthouse §13** | never taken | **failed on all 8 routes** |

The two documents disagreeing with each other in the same commit is the finding, not the two
tests. A ledger that is not re-run is a claim like any other.

### 8.2 The performance gate, measured

First measurement, mobile lab, production build, simulated Slow 4G:

| Route | Perf | A11y | BP | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| `/` | **63** | 100 | 100 | 100 | 4,339 ms | 0.000 | 889 ms |
| `/product` | **66** | 100 | 100 | 100 | 4,215 ms | 0.000 | 822 ms |
| `/pilot` | **74** | 100 | 100 | 100 | 3,458 ms | 0.000 | 705 ms |
| `/trust` | **79** | 100 | 100 | 100 | 3,264 ms | 0.000 | 554 ms |
| `/story` | **78** | 100 | 100 | 100 | 3,279 ms | 0.000 | 556 ms |
| `/contact` | **84** | 100 | 100 | 100 | 3,112 ms | 0.000 | 388 ms |
| `/privacy` | **80** | 100 | 100 | 100 | 3,242 ms | 0.000 | 489 ms |
| `/terms` | **81** | 100 | 100 | 100 | 3,257 ms | 0.000 | 469 ms |

Accessibility, Best Practices and SEO were a clean 100 everywhere and CLS a perfect 0.000 —
the previous pass's work holds up. Performance failed on every route.

### 8.3 Causes, and what each was worth

Four parallel investigations attributed the failure; a fifth adjudicated them against source.
Two of its conclusions are worth recording because they were wrong on first pass and were
caught by insisting on isolation:

- A cross-route regression fit `styleLayout = 308 + 0.337·domNodes + 0.217·contourSegments`
  with **R² = 0.9963** and attributed 1,300 ms of style and layout to the contour SVGs. It was
  an artifact: the two predictors correlate at 0.963, and an isolated benchmark of all eight
  real contour SVGs measured **6 ms**. The contours were a bytes problem, not a layout one.
- `tailwind-merge` was reported as resolving no conflicts anywhere. Diffing all 2,642 rendered
  class attributes showed it resolving exactly one, 25 times — and resolving it *wrongly*.

| Fix | Mechanism | Measured worth |
|---|---|---|
| `PageHeader` no longer wraps its `h1` in `Reveal` | `.js [data-reveal]{opacity:0}` applies before first paint, so LCP waited for hydration on 7 routes | FCP→LCP gap of **~800–870 ms** on `/product`, `/pilot`, `/trust`, `/story`, gone. Observed LCP now equals observed FCP on all 8 routes |
| Contours generated at build time into `public/contours/*.svg`, painted as a CSS mask | The geometry shipped twice per response — as DOM and again in the RSC flight payload | Home document **99 KB → 40 KB gzipped (−60%)**; `/product` 47→23, `/story` 22→12, `/pilot` 39→29 |
| `Button` renders `#hash` links as plain anchors | Next resolved `#platform` against the current route, so home prefetched **itself** | 42.5 KB `?_rsc=` request removed from the LCP window |
| Both auto-tour `setInterval`s gated on an IntersectionObserver | Neither checked visibility; one did not even check for a backgrounded tab | ~1,053 ms of style and layout on home, ~957 ms of it after the page was otherwise idle |
| `tailwind-merge` removed | 27 KB table reachable from the header, so it loaded on every route | −8.5 KB gzipped everywhere, including the routes already closest to budget |
| Supporter logos given rendered rather than intrinsic dimensions | `width={2000}` made Next build a 2× srcset, capped at `w=3840`, for a mark painting ~128 px | ~45 KB of image transfer on home |

### 8.4 Where performance landed

Median of 3 runs per route, same lab conditions:

| Route | Perf before → after | LCP before → after | TBT before → after |
|---|---|---|---|
| `/story` | 78 → **99** | 3,279 → 2,196 ms | 556 → 43 ms |
| `/privacy` | 80 → **98** | 3,242 → 2,267 ms | 489 → 74 ms |
| `/terms` | 81 → **98** | 3,257 → 2,272 ms | 469 → 84 ms |
| `/contact` | 84 → **97** | 3,112 → 2,175 ms | 388 → 70 ms |
| `/pilot` | 74 → **95** | 3,458 → 2,934 ms | 705 → 45 ms |
| `/trust` | 79 → **87** | 3,264 → 2,319 ms | 554 → 424 ms |
| `/product` | 66 → **81** | 4,215 → 3,452 ms | 822 → 405 ms |
| `/` | 63 → **81** | 4,339 → 3,721 ms | 889 → 323 ms |

**Status: FAIL, with a measured and documented exception.** Five of eight routes clear
Performance ≥ 90; `/`, `/product` and `/trust` do not, and LCP ≤ 2,500 ms is met on four.
Accessibility, Best Practices and SEO hold at 100 on all eight, and CLS at 0.000.

Two honest qualifications on these numbers:

1. **The measurement environment is not trustworthy for TBT.** These were taken on a developer
   workstation running a chat client, a video-call app and several dozen browser processes.
   `/trust` measured 424 ms while `/pilot`, which ships *more* JavaScript, measured 45 ms in
   the same sweep — that ordering is not physical. The stable, repeatable figures are
   Accessibility, Best Practices, SEO, CLS and the byte counts; treat Performance, LCP and TBT
   as directional. `npm run check:perf -- --runs=3` is the reproduction.
2. **There is a framework floor.** `/trust` ships essentially no application JavaScript —
   17.7 KB gzipped of header, Reveal and tokens — and still cannot reach TBT ≤ 200 ms,
   because the React 19 + Next 16 runtime alone costs ~872 ms of bootup on a 4×-throttled
   mobile CPU. `/` and `/product` additionally carry `motion`, 138 KB minified and 45.6%
   unused, which is the one remaining structural difference between them and the five routes
   that pass. Removing or lazy-loading it is the next lever and is **not** attempted here:
   it is a five-component migration whose failure mode is a runtime throw, and it belongs in
   its own change with its own verification rather than bolted onto this one.

### 8.5 The motion migration

The five routes that met the performance budget and the three that did not differed in one
structural way: `/` and `/product` were the only routes loading `motion`, at 138 KB minified
and 45.6% unused. All 19 animated elements across five components moved to `LazyMotion` with
`domAnimation` and `motion/react-m`; the `motion` proxy cannot tree-shake, because it cannot
know at build time which features an element will use.

| | Before | After |
|---|---|---|
| Route chunk, raw | 172,979 B | **118,726 B** (−31%) |
| Route chunk, gzipped | ~56,900 B | **~40,840 B** |

Two facts were verified in the installed source instead of assumed, and one of them corrected me:
nothing in `src/` uses `layout`, `layoutId`, `drag`, `useScroll`, `useTransform` or `useSpring`;
and `AnimatePresence mode="popLayout"` does **not** need layout projection — `PopChild.mjs`
measures in `getSnapshotBeforeUpdate` and injects an absolute-positioning rule. I had assumed the
opposite, which would have ruled out the correct strategy for a reason that is false.

`strict` is enabled, so a missed `motion.*` throws rather than silently degrading.

Once the workstation was quiet enough for a coherent sweep, **seven of eight routes met
Performance ≥ 90**: `/story` 99, `/terms` 99, `/pilot` 98, `/privacy` 97, `/trust` 95,
`/contact` 95, `/product` 94, `/` 85. TBT is inside budget everywhere except home. Against the
opening measurement of 63–84 failing on all eight, that is the gate substantially met — but
**still FAIL**, because home is not there and LCP is marginal on three routes.

**Measuring in this environment needs a control.** Three sweeps produced impossible results.
After the hero components moved to CSS, home measured 72 against 85 — an apparent serious
regression. `/terms`, a route that change cannot touch, had gone 99 → 81 in the same window: the
machine, not the code. No performance claim here is worth anything without a control measurement
on an unchanged route, and the server needs warming before the first sweep.

Removing `motion` altogether remains available and is worth the other ~138 KB. It is not done
here because the investigation that planned it lost the agent responsible for analysing which
tests constrain it, and what it did surface is not cosmetic: the reduced-motion block does not
zero `animation-delay`, which with `animation-fill-mode: backwards` would hold a hidden state
through the delay — the same shape as the permanent-contrast defect Phase 6 fixed.

### 8.6 Claim defects found with the suite green

Four independent reviewers produced 53 alleged defects; adjudication against the deploying
repo confirmed 29, refuted 8 outright and merged 10 as cross-lens duplicates. The refutations
mattered as much as the confirmations — one would have driven a rewrite of three accurate
security rows on the strength of an authority rule the register does not contain.

The suite could not have caught any of the 29, for three structural reasons, all now closed:

| Gap | Consequence | Closed by |
|---|---|---|
| `claims.spec.ts` regex-matched the *shape* of an evidence path and never resolved one | A non-existent file, a literal `...` placeholder and a spec testing something else all passed green | **Closed.** `npm run claims:evidence` resolves every citation against real checkouts into `docs/evidence-manifest.json`, and the suite asserts against it because CI has no product-repo checkout: **68 paths, all resolving**, at `Tenure@819aec0` and `Tenure-Parent@1c03db8` — the commits the register cites, which a third test checks. Both directions are enforced, so a newly added claim cannot pass unverified. Plus elided segments rejected and `ci-verified` required to name a real test |
| Nothing read `claim.where` | The register's central rule — that a limit travels with its claim wherever it appears — had no enforcement on any claim | **Closed.** Two tests now read `where`: every route a claim names must exist, and a qualification stating an "N of M" figure must state it on every route in `where`. C-003 was the live violation — the home page asserted query-layer isolation with no scope while the register required "15 of 39" to accompany it |
| Published counts were never re-derived | "292 unit tests" shipped under a heading reading "counted from the repository that deploys". The real figure is **320** | Recount recorded in C-015 with the command that produces it |

The 29 are listed with their fixes in [`EVIDENCE-REPORT.md`](EVIDENCE-REPORT.md).

A thirtieth was found by the visual suite rather than by any reviewer, and only because the
diff was inspected instead of accepted: `SeatMechanism`'s "Ask this seat" panel asked "Who did
we use for catering, and why did we switch?" — an eleven-term AND that returns nothing. The
same inspection showed the committed baseline rendering a *different* exchange again, with the
invented "$1,240 over" figure Phase 6 had removed, proving the baselines predated the source
and were passing only because the changed region fell under the 1% pixel tolerance. Both are
fixed; all 42 affected baselines are regenerated and stable across two runs.

---

## Blocked on something engineering cannot resolve

| ID | Item | Owner | Needs |
|---|---|---|---|
| `C-021` | Fall 2026 pilot is verbal, not contracted | Almamy Diaby | A signed document before any definite language returns |
| `C-027` | FERPA wording | Almamy Diaby | Counsel review; currently framed as intent only |
| `C-030` | "Anthropic does not train on your data" | Almamy Diaby | The commercial terms in force. Now attributed to Anthropic's terms rather than asserted as Tenure's guarantee |
| `C-032` | Operating legal entity | Almamy Diaby | Incorporation. Privacy and Terms carry a founder-draft banner meanwhile |
| `X-01` | Student roster in public git history | Satvik Adyanthaya | History rewrite or private repo, in `satvikOS/Tenure` — read-only for this work |
| `C-023` | The pilot sign-in mechanism cannot be described publicly | Satvik Adyanthaya | A decision. `/terms` no longer makes anyone liable for activity under their account, and `/trust` now says access is not gated on a per-user secret, because a liability clause written against a shared credential is not defensible. Saying more than that needs C-023 lifted; saying less would put the clause back |
