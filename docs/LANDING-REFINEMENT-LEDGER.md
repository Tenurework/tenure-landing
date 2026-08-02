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
| `satvikOS/tenure-landing` | This repo | `fb6a3bd` | Next.js 16.2.9, React 19.2.4, Tailwind 4. Clean worktree at start. |
| `satvikOS/Tenure` | **Deploying** — determines what may be called live | `819aec0e` | App under `apps/web/`. 132 e2e across 28 specs, 292 unit tests. |
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
| Audit coverage | "100% of actions logged" | Privileged actions, create-only, allows **and** denials. Real coverage 49/63 stated on `/trust` |
| Approval chain | 5 steps incl. a phantom "Advisor" gate | Draft → President → OSE → Approved (2 gates, 7 types) |
| Policy snapshot | "snapshots the exact policy in force, so you can prove the rules" + "policy v4 · frozen 2026-09-12" | Records the deciding seat, transition and reason. `policySnapshot` is never read back, so the old claim was unprovable |
| Messaging | "delivery across in-app, email, and push" + "sensitivity" | Four conversation types. Every write is `in_app`; `Message` has no sensitivity field |
| Access model | "least-access by default" | "Access follows the seat" — an institution account can read every organization |
| AI speed | "instant answers" | "sourced answers" — retrieval is keyword AND-matching, no embeddings |
| Approval types | 6 of 7 listed | All 7, including `EXCEPTION` |
| Metrics band | 3-day onboarding, 0 knowledge lost | 26 organizations / 209 seats, 2 gates / 7 types, 0 records deleted, 132 e2e tests — all counted from the deploying repo |
| Pilot | "OSE **is** standing Tenure up across every org" | "We are **planning** a Fall 2026 pilot… proposed, not contracted" |
| Story record | "Partner: OSE" | "Built with: OSE" |

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
| Security headers | *pending* | Phase 5 |

---

## Phase 5 — Test and performance system

| Item | Status | Evidence |
|---|---|---|
| Playwright functional suite | *pending* | `e2e/nav.spec.ts`, `e2e/interaction.spec.ts` |
| Accessibility suite | *pending* | `e2e/a11y.spec.ts` |
| SEO suite | *pending* | `e2e/seo.spec.ts` |
| Claims ratchet | *pending* | `e2e/claims.spec.ts` |
| Visual baselines | *pending* | `e2e/visual.spec.ts` |
| Internal link checker | PASS | `scripts/check-links.mjs` — 111 links, 0 broken |
| Contrast gate | PASS | `scripts/check-contrast.mjs` — 72/72 |
| CI workflow, pinned actions, least privilege | *pending* | |
| Performance budgets | *pending* | |

---

## Phase 6 — Adversarial review

*pending*

---

## Phase 7 — Release evidence and handoff

*pending*

---

## Blocked on something engineering cannot resolve

| ID | Item | Owner | Needs |
|---|---|---|---|
| `C-021` | Fall 2026 pilot is verbal, not contracted | Almamy Diaby | A signed document before any definite language returns |
| `C-027` | FERPA wording | Almamy Diaby | Counsel review; currently framed as intent only |
| `C-030` | "Anthropic does not train on your data" | Almamy Diaby | The commercial terms in force. Now attributed to Anthropic's terms rather than asserted as Tenure's guarantee |
| `C-032` | Operating legal entity | Almamy Diaby | Incorporation. Privacy and Terms carry a founder-draft banner meanwhile |
| `X-01` | Student roster in public git history | Satvik Adyanthaya | History rewrite or private repo, in `satvikOS/Tenure` — read-only for this work |
