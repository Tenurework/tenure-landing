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

## Phase 9 — Compaction pass, 2026-08-18

Two commits: `31d709c` (structure and backdrops) and `568e06d` (the contact composer and the
reference pages).

### The problem, stated as a number

The site measured **65.4 desktop viewport-heights** across eight routes — 13.5 on the home page,
23.8 on a phone. Length was the symptom. The cause was that almost every section answered its
heading with a **grid**: nine platform cards, four audience cards, three console cards, two
problem cards, three integration lanes. A reader met three to nine arguments at once and
finished none. Twenty sections also hard-coded `py-24 sm:py-32` — ~2,700px of padding on the
home page alone.

| Item | Status | Evidence |
|---|---|---|
| Every section reduced to one card, one thing in view | PASS | Rails/tabs inside a single `Panel` for the genuinely-many cases: 11 platform modules, 6 console sections, 4 sectors, 7 trust groups |
| Vertical rhythm centralised | PASS | `SECTION`/`SECTION_TIGHT`/`SECTION_BAND` + `<Section>` in `ui/layout.tsx` replace 20 hard-coded declarations; `SectionHead` replaces 22 copy-pasted header blocks with 3 heading scales |
| Composed backdrops per section | PASS | `visuals/Backdrop.tsx`: mesh + grid/dots/contour + Memphis figure + grain, five variants. Every layer an `aria-hidden` **sibling**, masked |
| Memphis ornament, token-filled | PASS | `visuals/MemphisArt.tsx`, ~14 nodes per variant, every fill a `--chart-*` token so dark mode repaints without a `dark:` variant |
| Data visualisations | PASS | `visuals/Charts.tsx` — MemoryCurve, Share, TierNest, GateRail. One axis per chart, fixed categorical order, labels in text tokens |
| Total site length | PASS | **65.4 → 45.0** desktop screens. `/trust` 8.9 → 3.6, `/pilot` 14.4 → 5.0, `/` 13.5 → 10.5. Measured by `scripts/measure.mjs` |
| Reference pages compacted without cutting a word | PASS | `ui/Dossier.tsx` — native `<details>`, not a JS rail. Content in unrendered React state cannot be audited, and `claims.spec.ts` must still see /trust say "separation of duties", "hash chain", "SOC 2" with their disclaimers |
| Top ribbon renamed | PASS | Product/Pilot/Trust/Story → **Platform/Pilot/Security/About**. URLs, titles and canonicals unchanged; `nav.spec.ts` derives from `site.nav` |
| Calendly window replaced with first-party UI | PASS | `site/WalkthroughRequest.tsx` — native `<dialog>`, composes the request in-browser, hands off by `mailto` or clipboard. `Scheduler.tsx` and `lib/calendly.ts` deleted |
| Connector story de-duplicated | PASS | `Integrations` + `ToolLogos` were near-verbatim copies on two routes, each listing `.xlsx` twice. One `ConnectorMatrix` on /product, naming Slack/Drive/Teams/Box in the sentence that denies them |
| Cross-industry narrative | PASS | Hero, Problem, FAQ, /privacy, /terms and metadata no longer university-only; `site.audiences` covers universities, NGOs, SMEs, associations, surfaced on the **home** page |
| Visual baselines regenerated | PASS | All 96, across desktop/mobile × light/dark |
| Full suite green | PASS | **1120 tests**, four projects. Plus lint, typecheck, 72/72 contrast pairs, 112 links |

### Removed as duplicates, not as cuts

`TrustStrip`, `MockDisclosure`, `Integrations`, `ToolLogos`, `WhoFor`, `HeroShapes`,
`HeroFloatingCards`, `Scheduler`, `lib/calendly.ts`, `SupporterStrip` (already dead), and the
`.tn-float`/`.tn-rise` CSS once its last consumer went. `Handoff`'s "Shadow access" h3 and
`AiOnboarding`'s h2 were **the same sentence, word for word**, over a lifecycle `SeatMechanism`
was already animating.

### Defects the gates caught that review would not have

| Defect | Found by | Why it mattered |
|---|---|---|
| **Eleven dropped spaces** across four routes — `<span>seat</span>rather`, `Student Engagement<!-- -->—`, six `<strong>…</strong>—` in /privacy | Rendered-HTML sweep | One cause, not eleven typos: SWC drops the leading space of a multi-line JSX text node following an element. **Third occurrence in this repo**; the previous two fixes were one-offs. `claims.spec.ts` now scans served markup — by `innerText` the two words are one word |
| `well` utility at 4.40:1 | axe + the independent contrast walk | A hand-mixed `color-mix()` surface is outside `check-contrast.mjs`, which checks token **pairs**. A new surface must be an existing token or be added to `THEME_PAIRS` |
| `role="group"` on a `<ul>` | axe | Strips the list role and orphans every `<li>` — 11 serious violations on the home page |
| Dossier titles were `<span>` | `expectSaneHeadings` | /trust went h1 → h3, breaking the way a reviewer navigates a long reference document |
| Eight vendor chips under one badge | `claims.spec.ts` | The matcher excuses by line proximity, so the badge fell out of range by the third name. Right twice over — a chip row **is** a logo wall, which is what C-029 exists to prevent |
| `<label>` wrapping a `<select>` | Playwright strict mode | The control's own value joined its accessible name: "Kind of organization Choose one…" |
| Metric tiles misaligned | Screenshot review | Only 2 of 4 carry a note chip, and it sat above the label, so half the captions in a four-across row started 34px lower |
| `HeroFloatingCards` over the ledger | Screenshot review | At 1440px "Membership dues, 28 paid" rendered as "mbership dues". Removed rather than narrowed: absolutely positioned over a fluid surface, any width that clears at one viewport collides at another |
| Tab labels wrapping to 3 lines at 390px | Screenshot review | `flex-wrap` + `flex-1`; now a single `whitespace-nowrap` scrolling row |

### Known, accepted

Playwright occasionally trips one `page.evaluate` timeout on a full four-project run: `settle()`
scrolls the whole document and the a11y tests carry a 30s budget. It is pre-existing, it did not
reproduce in isolation on either occurrence, and CI sets `retries: 1`.

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

---

## Phase 10 — The brief, re-audited against the product, 2026-08-19

Phase 9 recorded every clause of the founder brief as PASS. Eight adversarial lenses were
run against that claim rather than against the site, and the ledger was wrong in three
places and incomplete in five. This phase is what survived verification.

**The audit did not finish.** Eight finder agents returned; every refutation agent and the
synthesiser died on an account rate limit. So none of the 71 findings below arrived
adjudicated — each was re-verified by hand against the deploying repo, the rendered page or
a screenshot before anything was changed, and several were dropped on inspection.

### 10.1 The register was describing a product that had moved on

Three claims were not wrong when written and were wrong when read. The evidence pin was 78
commits behind, and C-029's own evidence line is what proved it: the repo-wide grep it cites
for `slack.com` returned zero hits at `819aec0e` and five files at HEAD.

| Was | Is, verified in `satvikOS/Tenure` | Where it had to change |
|---|---|---|
| "production calls Anthropic DIRECTLY. There is no Bedrock integration in either repository" — and `forbiddenPhrases` blocked the word | `lib/ai/provider.ts` prefers Bedrock whenever a region is set; `bedrock.tf` defaults `bedrock_enabled` to true; `ecs.tf` sets `AI_PROVIDER=bedrock`; `provider.test.ts` and `bedrock.test.ts` cover it | C-007, `/trust`, `/privacy`, home. The gate named three release conditions — repo invokes it, infrastructure lands, tests exist — and all three were met, so the gate released itself |
| "Okta is dead code and Cognito is a decision with no implementation… the site must not say MFA" | `auth.ts` registers Cognito as a credentials provider; `cognito.tf` sets a 12-character policy across all four classes, TOTP via `software_token_mfa_configuration`, verified-email recovery | C-023, `/trust`. The page was telling institutions there was **no** per-user secret and **no** MFA — understating your own security is not caution |
| "Connectors to Google Drive, Slack, Notion, Teams, Dropbox, Box, Zoom or Discord — Not supported" | A Slack connector with OAuth install, channel routing, a posting quota, **6 unit test files** and **2 API routes**; plus an 18-product catalog computing availability from `requiredSecrets` | C-029 split into **C-029a / C-029b / C-029c**, `/product`, home FAQ |

The Slack row is the one that needed the most care. The code and its routes are real, and
**nothing in the application calls the announce seam** — `announceEvent` has zero callers
under `apps/web/src/app`. So the honest status is *built, not reachable*, which is neither
"available" nor "no", and the `built-pending-cutover` availability was widened to cover it.

**The ratchets turned to face the new truth rather than being deleted.** `"Bedrock" appears
nowhere on the site` became `wherever Bedrock is named, the direct-API fallback is disclosed
too`, because both providers ship and a page naming one lets a reader conclude the wrong
thing about where their record text goes. Two vendor-status phrases were added to
`DISCLAIMED_VENDOR` so a name can sit beside its real status; every other vendor still
requires a denial. One latent bug surfaced doing it: the calendar guard pushed every hit
without checking `excusedBy`, so it fired on a sentence *denying* two-way sync — it now
honours the excuse window like every other guard in the file.

`build-evidence-manifest.mjs` defaulted to two absolute Windows paths, so on any other
machine it reported both product repos as NOT CHECKED OUT and rewrote the manifest to nulls
— silently turning the evidence gate off rather than failing. Sibling directories now.

### 10.2 Length: 44.1 → 37.8 desktop screens, and where it came from

| Route | Desktop | Mobile |
|---|---|---|
| `/` | 10.4 → **9.7** | 16.7 → **15.1** |
| `/product` | 7.6 → 7.5 | 11.5 → 11.6 |
| `/privacy` | 5.5 → **2.9** | 8.8 → **4.0** |
| `/terms` | 5.7 → **3.1** | 9.2 → **4.2** |
| **Total** | 44.1 → **37.8** | — |

**The legal pages were the largest single saving and cost nothing.** `Dossier` was built in
Phase 9 to fix `/trust` and `/pilot` and was never applied to the two pages with the worst
words-per-screen on the site. Both are accordions now — and the restructure was gated on a
word-bag diff of all eight routes before and after: **zero words lost anywhere**, with
`/privacy` and `/terms` gaining only the 43 and 47 new words of the summary lines.

That diff is also where the harness caught itself. The first run reported "0 differing
words" on every route *including the two I had just added text to*. `pkill -f "next start"`
kills the npm wrapper, not `next-server`, so port 3000 was still serving the previous build
and the entire verification was measuring nothing. Every server restart in this phase kills
by port.

**`SECTION_TIGHT` and `SECTION_BAND` were exported and used by nothing.** All 39 sections
took the default, so a file documenting a three-step rhythm applied one step — measured at
1,546px of empty seam on the home page alone. The steps are applied, and the scale is one
notch shorter: seams land near 120px instead of 160px.

On mobile the gap was never content, it was stacking. Handoff's packet table had no column
count below `md`, so four seats became nine stacked lines each and the four column labels
printed **sixteen times** — 1,835px, the tallest section on the site. Paired into two
columns: 1,220px.

### 10.3 Repetition, which was structural rather than editorial

`Backdrop` took only `variant`, and the site uses `quiet` twelve times and `drafting` eight.
Two calls with the same variant were **pixel identical**, which is why the same purple
triangle and green zigzag bled off an edge at least six times. `seed` now varies wash
offsets, mask origin, grid pitch, contour asset and ornament corner from five tables of
length 4, 5, 3, 9 and 7. The ornament table is seven **because six collided**: Problem
(seed 1) and OfficeConsole (seed 7) are both `drafting`, and 1 % 6 === 7 % 6 put the
identical figure in the identical corner twice down one page. A script proves zero
collisions across all five multi-section routes.

Two things had to be caught by reading the built CSS rather than the source. Tailwind v4
finds class names by scanning text, so the first implementation — mask gradients assembled
in template literals — would have emitted **no CSS at all** and rendered every textured
layer unmasked. The tables hold complete class literals, and the production stylesheet was
grepped to confirm all five origins and all three pitches ship.

Other duplicates removed: the home hero and `/product` mounted `DashboardMock` with
identical chrome and identical rows four screens apart; `Platform`'s Finance pane repeated
the hero's ledger **and disagreed with it**, painting "Reserve" in `--chart-4`, the hue
`--danger` is built on, where the hero used the neutral slate. `Share` now takes
`neutral` for a remainder, and the pane shows a different facet of Finance entirely.

### 10.4 The pictures were all one student organization

Every product illustration on the site was Rochester Finance Club: membership dues, a gala,
SCC- seat codes. The prose covers four sectors and the four non-university seats in
`site.audiences` were never rendered anywhere — so read as a visitor reads, in pictures, the
site was for student government whatever the paragraphs said. `DashboardMock` takes a
`dataset`; `/product` runs a nonprofit (Riverside Literacy Alliance, FY26 Q2, a foundation
grant, tutor stipends) including its own assistant prompts, because "fall mixer" asked of a
literacy charity is the default leaking through the panel a visitor reads most closely.

**Four real, identifiable companies appeared as fabricated approved contracts and confirmed
bookings** — Aramark as a signed sponsorship, M&T Bank mid-negotiation, Memorial Art Gallery
as a confirmed venue, Rochester Print on a standing rate. Fourteen occurrences, all replaced
with invented names.

### 10.5 Defects the gates caught, and one they caused

| Defect | Found by | Why it mattered |
|---|---|---|
| Hero's scope chips scroll on a phone and contain nothing focusable | axe, `scrollable-region-focusable` (serious), twice | A region a mouse can scroll and a keyboard cannot reach. `Segmented` never hits this because its children are buttons; inert chips need the container to take the tab stop. It stays a `<ul>` — `role="group"` would orphan every `<li>`, which this repo already fixed once |
| `MetricsBand`'s note chip was documented as pinned to the bottom and had no `mt-auto` | Screenshot review | The comment described the fix; the class was never added, so the chips still sat 34px apart in a four-across row |
| Emoji `📅` and `🔒`, and `▶`/`⏸`/`↻` as text | Glyph census of the source | An emoji renders from the system colour font and ignored every `--chart-*` token; `⏸` is absent from IBM Plex Mono and fell back to a form that reads as a clipped `u` — which is the "clipped text" a screenshot review had already flagged |
| 76 straight apostrophes in copy, against 380 typographic ones | Rendered-text census | `/pilot` ran 18 straight to 1 curly while `/privacy` was fully curly. Safe to normalise because `claims.spec.ts` folds quotes before matching |

### 10.6 Where it stands

Lint, typecheck, **72/72** contrast pairs, build, **113** links, and **1,029–1,040** Playwright
tests across four projects. The single failure under full-suite load is the pre-existing
`settle()` timeout the Phase 9 note records; it passes in isolation every time and CI sets
`retries: 1`.

Two things are honestly unfinished. `/product` did not get shorter — the connector matrix
gained three groups because the real answer is three-part, and that is content the brief
asked for. And **C-015's counts were left alone**: the register requires them to be counted
by *running* the suite, `apps/web` has no `node_modules` here, and installing dependencies
into the product repo to publish a number was not a trade worth making. 320 unit and 132
e2e are therefore understated at HEAD, which is the safe direction.

---

## Phase 11 — The other 54 findings, verified rather than assumed, 2026-08-19

Phase 10 actioned 17 of 71 findings. The remaining 54 went through a second fanout — six
verification lanes against the deploying repo and the running site, each followed by an
adversarial pass. **Refutation did most of the work**: the structure lane lost 7 of 9, the
numbers lane 4 of 7, and five more items were found already fixed by Phase 10. What follows
is what survived, and it is almost entirely the site describing a product that is not there.

### 11.1 The direction that matters: three overstatements

| Claim | Product truth | Where |
|---|---|---|
| "Dues" as a shipped finance capability, in five visitor-visible places | `TransactionType` is ALLOCATION \| SPEND \| REIMBURSEMENT \| ADJUSTMENT. **No income type. No per-member payment state anywhere in the schema.** The word does not appear in the repo | Hero ledger opened on "Membership dues, 28 paid, +$840" — an income line with a per-member paid count, in the most-viewed illustration on the site |
| "Two organizations co-hosting run the same approval path" | `CollabStatus` is PENDING_OSE \| APPROVED \| DECLINED — **one office decision**, not the two-gate chain | `Platform` module "Cross-org work" |
| A "Deal" knowledge-card tag | The seven enforced kinds are Contact, Playbook, Budget, Vendor, Lesson, Thread, Deadline | Five mocks, on pages that print the real seven |

C-038 and a forbidden phrase now hold "dues" shut. Overstating a governance control is the
one direction this site must never round in.

### 11.2 Six understatements, which cost credibility with the reader who checks

- **"15 of 39 models carry a tenant column" is 18 of 41.** The registry's *own header comment*
  said "17 of 40" at the same commit and was itself stale, which is why the qualification now
  says to count the array and never quote prose about it.
- **/trust published DirectoryPerson as the one parentless model** needing a schema change. It
  carries the column now. The page was advertising a weakness that had been closed.
- **"132 e2e and 320 unit tests" are 161 and more than 950.** Static counting reproduces the
  previously published 132 *exactly* at the commit it was published against — that calibration
  is what makes it trustworthy here. For the unit half it gives 279 where jest reported 320, so
  974 declared cases is published as a floor and the qualification says why.
- **The office console showed 25 of 26 seats held.** The seeded roster is 209 seats with **103
  vacant**. The mock inverted the problem the product exists to solve, in the one pane whose
  stated subject is how much of a seat map is filled.
- **"Eleven modules" omitted Board resources**, which the product ships and routes by seat. A
  completeness claim with a hole in it is worse than no claim.
- **/trust never disclosed the per-person AI ceiling** — 40 requests and 120,000 tokens a day.
  Saying only that no per-tenant quota exists reads as unlimited.

### 11.3 The contact surface

`/contact` still sent a CSP allowing `script-src` and `frame-src` for Calendly, written for an
embed deleted in August. **An outbound anchor needs no CSP allowance at all** — CSP governs what
a page loads, not where a link navigates — so every directive was permission for something that
no longer exists, on the one route that collects a name, an organization and an email. It now
inherits the site-wide policy: `frame-src 'none'`, no third-party script origin.

The primary action was a bare anchor with no handler and no state, so on a machine with no mail
handler it did nothing and said nothing. It now reports that it **handed over** — never that it
sent, which this page cannot observe — and names the fallback beside it. The body is a real
`<form>`, so Enter sends. Three tests cover the new behaviour.

Also: the select had `appearance-none` and no chevron; no link anywhere was called "Contact";
`/contact`'s left card stretched to 477px of blank; the footer rule crossed the word "About".

### 11.4 Length and repetition

44.1 → **36.5** desktop screens overall. Two whole sections deleted as duplicates, both agreed
on by two independent lanes: `/product`'s `HowItWorks` restated the section directly above it
plus two home sections, and `/pilot` closed with the navy ask twice ~400px apart.

`CtaBand` was byte-identical on four routes — same headline, subhead, ornament positions and
contour. It takes a `seed` now and each route makes its own ask. Nine section rules divided two
backgrounds of the *same colour*; `Section` suppresses the hairline when the caller declares the
surface does not change. The grain layer measured **0.32–0.63 levels of 255** — invisible — and
its `mix-blend-overlay` was inert inside `isolate`, so it was not preventing the banding it
exists to prevent.

### 11.5 A gate for the thing that keeps going stale

`scripts/verify-product-claims.mjs` re-checks all seven product-dependent claims and prints the
commit they hold at. **Pin only after it passes.** The product repo moved four times during this
session, and the temptation each time is to re-pin blindly to make `claims.spec.ts` green, which
is exactly how a register stops meaning anything.

It asserts **invariants, not headcounts** — the Slack test-file count went 6 → 7 mid-session,
and a gate that fails on healthy growth trains people to re-pin without reading. What must not
change is that the connector exists *and* that nothing calls it.

It also caught its own first version being wrong: counting only `apps/web/src` missed
`apps/web/scripts/db-bootstrap.test.mjs`, 13 cases that jest really collects, so the gate was
proving a smaller number than the site published.

### 11.6 Where it stands

Lint, typecheck, **72/72** contrast pairs, build, **113** links, **1,046** Playwright tests
across four projects, zero failures — including the `settle()` test that was flaky in Phase 10.

---

## Phase 12 — A type scale, 2026-08-19

The brief asks for "figma and framer references for premium visual languages". The single most
systemic thing standing in the way was that **the site had no type scale**.

Measured before: **59 distinct arbitrary `text-[Nrem]` values across 304 uses**, plus 28 uses of
Tailwind's own steps — and on the rendered page, **54 distinct computed font sizes over 1,754
text nodes**. Eighteen of the 59 sat inside the 0.84–1.08rem band; seventeen of the 54 rendered
between 13px and 16px, separated by as little as **0.08px**.

That is not a range of sizes, it is the absence of a decision. Nobody can see 0.08px; what a
reader sees is that no two components agree — which is most of what separates a designed page
from an assembled one. It is also self-perpetuating: with nothing to reach for, every new
component invented its own size.

**Fifteen steps, named for the job rather than numbered**, so a call site says what it means and
cannot silently drift a hundredth of a rem. The names deliberately do not collide with Tailwind's
own scale — `text-sm` still means what it always meant — and the 28 places using Tailwind steps
were folded in, so the site has one system rather than two.

| | | | |
|---|---|---|---|
| `mark-xs` 0.55 | `mark` 0.62 | `meta` 0.72 | `caption` 0.80 |
| `body-sm` 0.88 | `body` 0.95 | `lead` 1.05 | `title-sm` 1.15 |
| `title` 1.30 | `h3` 1.55 | `h2` 1.90 | `h2-lg` 2.30 |
| `display-sm` 2.65 | `display` 3.15 | `hero` 3.80 | |

Steps sit closer together at the bottom, where a small absolute change is a large relative one.

**The change is bounded, and the bound was measured rather than asserted.** Of 332 rewritten
declarations: 87 did not move at all, 253 moved by 0.8px or less, and the largest shift anywhere
is 2.4px on nine display headings that were already inconsistent between routes.

**Result: 54 → 16 distinct rendered sizes**, and fourteen of those sixteen *are* the scale. The
other two are the footer wordmark's deliberate `clamp(5.5rem, 23vw, 22rem)` display bleed, and
one node with no computable size.

### Three utilities that hid off the scale until the sweep exposed them

The first pass took the page to 19 sizes, not 16. The three strays were only findable by
measuring the rendered page, because none of them is an arbitrary value in a component:

| Stray | Cause | Fix |
|---|---|---|
| 11px | `@utility label-mono` hard-coded `0.6875rem` — a value belonging to no step, on the most-used label on the site | `var(--text-meta)` |
| 16px | Prose with no size class inherited the browser default, which is not a step. The largest single source of off-scale text | `body { font-size: var(--text-body) }`; rem is relative to the ROOT, so this changes inherited text only and no computed spacing |
| 14.4px | `.skip-link` declared `font-size` **twice** — the scale token first, then `0.9rem` nine lines later in the same rule | Deleted the second |

`.legal` also moved off `1rem` onto `lead`, one step above running body on purpose: those two
pages are a wall of clauses somebody reads end to end under obligation.

Gate: lint, typecheck, 72/72 contrast, build, 113 links, **1,046 Playwright tests, zero
failures** — including the 24×24 target-size checks a shrinking scale could have broken.

---

## Phase 13 — Twenty days of work had never deployed, 2026-08-20

Every phase above passed its gates, went green in GitHub Actions, and **was never served to
anybody**. `tenurework.com` was returning a build from **2026-07-31 19:02 UTC** — a cached
response measured at `age: 1740398` seconds, 20.1 days old.

### The mechanism

| Fact | Source |
|---|---|
| Vercel's last production deployment was `fb6a3bd`, 2026-07-31 | `latestDeployment` on `prj_PlEIkXTDY2sHpOxIlAvNvQjfrwiR` |
| Its metadata records `githubOrg: satvikOS`, `githubRepoOwnerType: **User**` | deployment `meta` |
| The same repo id `1281852471` is now owned by `Tenurework`, an **Organization** | `gh api repos/Tenurework/tenure-landing` |
| The only GitHub App installed on the `Tenurework` org is `greptile-apps` | `gh api orgs/Tenurework/installations` |
| GitHub's own deployment records for the repo stop at 2026-07-31T19:03:02Z | `gh api repos/Tenurework/tenure-landing/deployments` |
| **29 commits** on `main` since | `git rev-list --count fb6a3bd..HEAD` |

The repository was transferred from the `satvikOS` **user account** to the `Tenurework`
**organization**. Vercel's GitHub App installation lived on the user account, and a transfer does
not carry it. Vercel stopped receiving push webhooks that day, so no build was ever triggered
again — silently, because nothing fails when a webhook simply never arrives. CI stayed green the
whole time and proved only that the code was correct, never that it shipped.

**This is the failure mode a verification-only CI cannot catch, and it is worth naming: every
gate in this repository answers "is the code right", and not one of them answers "is the code
served".**

### What was done

`vercel deploy --prod` from the local checkout, which reaches the existing project directly and
does not depend on the Git integration. Verified afterwards, not assumed: all eight routes 200;
`Platform` in the ribbon and no `Product`; `Twelve modules`; `Board resources`; `18 of 41`;
`Term allocation` present and `Membership dues` absent; `Bedrock` and `Cognito` on /trust;
`Slack` on /product; `Riverside Literacy Alliance` on /product; the Dossier on /privacy; and
**no `calendly` token anywhere in the /contact CSP header**.

`.vercelignore` added: `e2e/` alone is ~64 MB of committed visual baselines that no build needs.

### Still to do, and only the account owner can

The CLI deploy is a workaround, not a fix — the next `git push` still deploys nothing. Install
the **Vercel GitHub App on the `Tenurework` organization** and reconnect the project's Git
integration. Until that is done, every deployment has to be pushed by hand.

Worth adding afterwards: a check that the deployed commit matches `origin/main`. A green CI badge
above a three-week-old site is a worse signal than a red one.
