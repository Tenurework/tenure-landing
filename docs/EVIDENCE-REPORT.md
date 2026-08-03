# Release evidence — `refine/landing-bible-v1`

Branch: `refine/landing-bible-v1` · base `fb6a3bd` · repository `Tenurework/tenure-landing`
Nothing merged. Nothing deployed. No production side effect.

Two passes are recorded here. **Pass 1** (2026-08-02) did the refinement. **Pass 2**
(2026-08-03) re-ran every gate on the assumption that nothing written down was true until
re-checked, and is the reason this document has been rewritten rather than appended to.

---

## Outcome

The site is materially more accurate and materially faster than it was this morning, and one
release gate is still not met.

- The **performance gate had never been measured**. Measured, it failed on all eight routes —
  Performance 63–84 against a budget of 90. After six fixes, five routes pass and three do
  not. That is recorded below as a measured exception, not as a pass.
- **29 claim defects survived independent adjudication** while a 1,052-test suite was passing
  green, including one P0: `/terms` made every user liable for activity under their account,
  against a pilot sign-in with no individual credential behind it.
- Accessibility, Best Practices and SEO measure **100 on all eight routes**, and CLS **0.000**.
  That part of pass 1's work holds up under re-measurement.

---

## 1. What changed, and why

### Truth and legal

| Change | Why |
|---|---|
| `/terms` no longer holds a user responsible for activity under their account | There is no individual credential. `auth.ts:43-61` checks one platform-wide passphrase and then looks the user up by email with no per-user secret. A liability clause written against a shared credential is unenforceable, and it is the first sentence a procurement lawyer would stop on |
| `/trust` no longer says "no password policy you can configure" | The phrase presupposes a password. It now names the property an institution actually needs: access is not gated on a secret held by one person and nobody else |
| "292 unit tests" → **320** | Published under a heading reading "Every number below is counted from the repository that deploys — not an estimate, not a projection." `cd apps/web && npx jest --ci` reports `Tests: 320 passed, 320 total` across 23 suites. `/pilot` also attached "run against a real database" to the unit half; `jest.config.js` excludes the database tests from that run |
| "Credential" removed from the knowledge-card kinds | The product **retired** that type: `MemoryRecord.content` is an unencrypted Json column any active seat can write, so a kind called "Login or access info" invited people to paste passwords into a shared database against an encryption control that was never written. The row also omitted `Thread` and `Budget`, which are creatable |
| Audit coverage: "49 of 63 server actions" → no fraction | The figure did not survive a recount — three methods gave three answers — and its exclusion list was wrong on its own terms: `resources/actions.ts` routes both writes through an audited helper, and document summarisation writes a `Document.Summarized` row. Both "resource writes append nothing" and "AI … not recorded at all" were false |
| Anthropic subprocessor: one flow → **three** | `summarizeDocument` sends up to 24,000 characters of a file's contents and `draftText` sends the user's typed instruction. Neither is "retrieved record text at question time", and `/trust`'s "document file contents are not indexed" made the omission more misleading, not less |
| Every AI demo rewritten as keyword queries | `search.ts:39` is `terms.every(...)` — an AND over every query token longer than one character, with no stemming or stopword removal. "What's our sponsorship pipeline?" is a four-term AND including "what" and "our" and returns nothing. The site's most prominent proof depicted a result the product cannot produce |
| Hero mock caption made module-independent | It read "Ask about the **finance** this seat has recorded" while `/trust` states finance figures are not in the corpus at all. `loadSearchCorpus` builds from five kinds; Budget, Transaction, Vendor and User are not among them |
| Institution-wide approval override disclosed on `/trust` and `/pilot` | The home page renders "both gates bypassed" and an `approval.force_approved` audit line; the word "override" appeared **zero** times on the two pages that exist to tell a reviewer what to worry about, while both listed the *lesser* bypasses. Registered as C-037 |
| `/trust` tenancy limit rewritten | It said all 24 non-scoped models are reached through a scoped parent. The registry it cites says otherwise: five are platform-global, and `DirectoryPerson` — which holds real student and advisor contact details — has `reachableVia: "(none)"` |
| `/story` "Built with" → "Proposed pilot with", plus the non-endorsement note | Nothing has been built with the office. `/pilot` says "Who would sign — Nobody yet". `/story` was also the only route showing the university mark with no disclaimer |
| `/pilot` "no date appears on this page" rewritten | The page names Fall 2026 ten times |
| Excel/Outlook/Google marks replaced with file-format chips | C-029, the site's own rule: no vendor logo without connector code and an end-to-end test. There is no Microsoft or Google connector — spreadsheets are parsed from bytes and the calendar is a one-way ICS feed |
| "Every answer cites its sources" → "Answers link the records they came from" | Citation is an instruction in the system prompt with no verification, and the route calls the model even when retrieval matched nothing, passing `(none found)` |
| "versioned" removed from the document features | `Document.version` is an optimistic-lock counter. There is no `DocumentVersion` model, no prior-version retrieval and no restore; saves overwrite the same S3 key |
| "Contact Sales" → `site.ctaLabel` everywhere | `site.ts:24-27` retired the phrase for overselling a two-founder company, and two call sites passed the literal string and overrode that decision on all eight routes |
| Home mocks carry an "illustrations, not screenshots" line | `index.html` contained zero occurrences of "illustration" — while rendering a treasury balance, a ledger, a handoff packet naming a person at a plausible `@u.rochester.edu` address, and an override row. `MetricsBand`'s "counted, not projected" heading sits directly beneath them |

### Performance

| Change | Mechanism |
|---|---|
| `PageHeader` no longer wraps its `h1` in `Reveal` | `.js [data-reveal]{opacity:0}` applies before first paint, so **LCP waited for hydration on seven routes**. `Hero.tsx:12-35` already documented this exact rule for the home page and `PageHeader` never got it |
| Contours generated at build time as static SVGs, painted as CSS masks | The marching-squares geometry shipped **twice per response** — as DOM and again in the RSC flight payload |
| `Button` renders `#hash` links as plain anchors | Next resolved `#platform` against the current route, so the home page **prefetched itself**: a 42.5 KB `?_rsc=` request inside the LCP window |
| Both auto-tour `setInterval`s gated on an IntersectionObserver | Neither checked visibility; one did not check for a backgrounded tab either. They ran for the life of the page |
| `tailwind-merge` removed | A 27 KB class table reachable from the site header, so it loaded on every route including `/privacy` and `/terms` |
| Supporter logos given rendered rather than intrinsic dimensions | `width={2000}` made Next build a 2× srcset capped at `w=3840` for a mark that paints ~128 px wide |

---

## 2. Highest-risk claims corrected or blocked

| Claim | Disposition |
|---|---|
| "You're responsible for the activity that happens under [your account]" | **Removed (P0)** — replaced with an explicit statement that we will not treat an action recorded under a name as proof that person took it |
| "132 end-to-end tests and **292** unit tests" | Corrected to 320, with the command that produces it recorded in C-015 |
| "Coverage is 49 of 63 server actions" + its exclusion list | **Withdrawn** — no fraction is published until one is generated in the deploying repo |
| Knowledge-card kind "Credential" | **Removed** — a retired type, held now by a test against the product's own enum |
| Every AI demo question | Rewritten to the query shape the retriever actually serves |
| "Ask about the finance this seat has recorded" | Replaced — finance is not in the search corpus |
| Anthropic receives "record text needed to answer a question" | Corrected to all three outbound flows |
| Institution-wide approval override | **Newly disclosed** (C-037) — previously visible only as a home-page mock |
| "The other 24 models are reached through their parent relation" | Corrected — five are platform-global and `DirectoryPerson` has no parent at all |
| "Built with: Simon's Office of Student Engagement" | Downgraded to "Proposed pilot with" |
| "Every answer cites its sources" | Corrected to `/trust`'s already-accurate wording |
| "versioned" documents | Removed |
| Excel / Outlook / Google Calendar marks | Deleted from `public/` — no connector code exists |

### Live vs Parent vs roadmap

Unchanged and re-verified. `claims.spec.ts` still fails the build if a claim marked `live` or
`ci-verified` is sourced to `Tenure-Parent` or to nothing, and **no claim on the site rests on
Parent-only evidence**. The AI provider gate was re-checked first-hand: both repositories call
`https://api.anthropic.com/v1/messages` directly and there is no Bedrock integration anywhere,
so public and legal copy still says Anthropic. One correction — the model id is
`process.env.ANTHROPIC_MODEL ?? "claude-haiku-4-5-20251001"`, unvalidated, so `/trust` now says
"by default" rather than naming it as a guarantee, and Parent's reviewed-model allowlist stays
off the site because it does not deploy.

---

## 3. Measurements

### Document weight, prerendered, gzipped

| Route | Before | After |
|---|---|---|
| `/` | 99 KB | **40 KB** (−60%) |
| `/product` | 47 KB | **23 KB** (−51%) |
| `/pilot` | 39 KB | **29 KB** |
| `/story` | 22 KB | **12 KB** (−45%) |

Home `<path>` elements 208 → 144 — exactly the 64 contour paths, now static assets shared
across every route (109 KB raw / 39 KB gzipped for all nine seeds, cached once).

### Lighthouse, mobile lab, median of 3 runs

| Route | Perf | LCP | TBT | | Perf before | LCP before | TBT before |
|---|---|---|---|---|---|---|---|
| `/story` | **99** | 2,196 ms | 43 ms | | 78 | 3,279 ms | 556 ms |
| `/privacy` | **98** | 2,267 ms | 74 ms | | 80 | 3,242 ms | 489 ms |
| `/terms` | **98** | 2,272 ms | 84 ms | | 81 | 3,257 ms | 469 ms |
| `/contact` | **97** | 2,175 ms | 70 ms | | 84 | 3,112 ms | 388 ms |
| `/pilot` | **95** | 2,934 ms | 45 ms | | 74 | 3,458 ms | 705 ms |
| `/trust` | 87 | 2,319 ms | 424 ms | | 79 | 3,264 ms | 554 ms |
| `/product` | 81 | 3,452 ms | 405 ms | | 66 | 4,215 ms | 822 ms |
| `/` | 81 | 3,721 ms | 323 ms | | 63 | 4,339 ms | 889 ms |

Accessibility 100, Best Practices 100, SEO 100 and CLS 0.000 on **all eight routes**, before
and after.

**This gate is FAIL with a documented exception.** Two things must be said plainly about the
numbers above:

1. **The measurement environment cannot be trusted for TBT.** These were taken on a developer
   workstation running a chat client, a video-call app and several dozen browser processes.
   In the same sweep `/trust` measured 424 ms while `/pilot` — which ships *more* JavaScript —
   measured 45 ms. That ordering is not physical. Byte counts, Accessibility, Best Practices,
   SEO and CLS are stable and reproducible; Performance, LCP and TBT are directional.
2. **There is a framework floor.** `/trust` ships 17.7 KB gzipped of application JavaScript and
   still cannot reach TBT ≤ 200 ms, because the React 19 + Next 16 runtime alone costs ~872 ms
   of bootup on a 4×-throttled mobile CPU.

### The motion migration

`/` and `/product` were the only two routes carrying `motion`, 138 KB minified and 45.6%
unused. All 19 animated elements across five components now use `LazyMotion` with the
`domAnimation` feature set and `motion/react-m` instead of the `motion` proxy, which cannot
tree-shake because it does not know at build time which features an element will use.

Two things were checked against the installed source rather than assumed, and one of them
reversed a wrong assumption of mine:

- **Nothing here needs the layout or drag feature sets.** A repo-wide search for `layout`,
  `layoutId`, `drag`, `useScroll`, `useTransform` and `useSpring` returns nothing in `src/`.
- **`AnimatePresence mode="popLayout"` is safe under `domAnimation`.** I expected it to require
  layout projection and it does not: `PopChild.mjs` measures in `getSnapshotBeforeUpdate` and
  injects an absolute-positioning rule. Had I trusted the assumption, the obvious strategy would
  have been rejected for a reason that is not true.

`strict` is on, so any missed `motion.*` throws at runtime rather than silently falling back.

**Measured in bytes, not in scores.** The re-measurement after this change is not reportable:
in the same sweep `/story` went 99 → 88, `/privacy` 98 → 83 and `/pilot`'s TBT 45 → 614 ms —
on five routes that do not load `motion` at all and whose bytes are identical before and after.
That is the workstation, not the code, and it is the second time the environment has produced
an impossible ordering. What is deterministic:

| | Before | After |
|---|---|---|
| Motion route chunk, raw | 172,979 B | **118,726 B** (−31%) |
| Motion route chunk, gzipped | ~56,900 B | **~40,840 B** (−16,060 B per route) |

Rendering is unchanged by design, so the visual baselines do not move — which is the reason this
strategy was chosen over deleting `motion` outright.

**Still not done, deliberately.** A parallel investigation recommended removing `motion`
entirely and replacing all 19 animations with CSS keyframes, worth the remaining ~138 KB. Its
plan is detailed and largely convincing, and it is **not** being executed here: the agent whose
job was enumerating which of the 1,080 tests constrain the migration failed mid-run, so the plan
arrived without its risk analysis. The parts it did surface are not trivial — the reduced-motion
block does not currently zero `animation-delay`, which combined with `animation-fill-mode:
backwards` would hold a hidden state through the delay and reintroduce exactly the permanent
contrast defect Phase 6 fixed. That is a change to make with the test analysis in hand.

---

## 4. Commands run

All on Windows 11, Node 24.16.0, from the repository root.

| Command | Exit | Result |
|---|---|---|
| `npm run lint` | 0 | no errors, no warnings |
| `npm run typecheck` | 0 | clean |
| `npm run check:contrast` | 0 | **72/72** token pairs pass WCAG 2.2 AA across both themes |
| `npm run build` | 0 | 12 routes prerendered; `prebuild` regenerates 9 contour SVGs |
| `npm run check:links` | 0 | **111** internal links, **0** broken |
| `npm run claims:build` | 0 | 37 claims, 23 forbidden phrases |
| `npm run check:perf -- --runs=3` | 1 | 5 of 8 routes meet every §13 budget; see above |
| `npx jest --ci` *(in `satvikOS/Tenure`)* | 0 | 23 suites, **320 tests** — the recount behind C-015 |

---

## 5. Remaining risks and blockers

### Cannot be fixed by engineering

| ID | Item | Needs |
|---|---|---|
| `C-021` | The Fall 2026 pilot is verbal, not contracted | A signed document before definite language returns |
| `C-023` | The pilot sign-in mechanism cannot be described publicly | A decision. `/terms` and `/trust` now say as much as that instruction allows; saying less would put an indefensible liability clause back |
| `C-027` | FERPA wording | Counsel review; currently framed as intent only |
| `C-030` | "Anthropic does not train on your data" | The commercial terms in force |
| `C-032` | No operating legal entity | Incorporation. Privacy and Terms carry a founder-draft banner meanwhile |

### Escalated — outside this repository

**`X-01` (P0): `satvikOS/Tenure` is public and the student roster is still in git history.**
`git show d799608:scripts/roster-data.mjs` returns real names and `@simon.rochester.edu`
addresses for ~153 students and 19 advisors. Untracking them in `63db4eb` did not redact
history. Remediation is a history rewrite plus a GitHub cache purge, or making the repository
private. **Treat those addresses as already disclosed.**

`X-02` (P1): `ANTHROPIC_API_KEY` is a plaintext ECS environment variable while every other
secret in the same file uses `valueFrom`.

`X-03` (P1): production runs `AUTH_DEV_LOGIN=true` **and** `ALLOW_DEV_LOGIN_IN_PRODUCTION=true`.
This is the product-side cause of the `/terms` P0 above.

### Open engineering items

1. **Performance on `/`, `/product` and `/trust`** — see §3. The next lever is `motion`.
2. ~~`claim.where` is still not enforced.~~ **Closed.** Two tests now read `where`: every
   route a claim names must be a real route, and any qualification stating a figure of the
   form "N of M" must state it on every route in `where`. The second is what C-003 violated —
   the home page asserted query-layer isolation with no scope while the register required
   "15 of 39" to travel with it. Verified non-vacuous: the figure appears in exactly
   `index.html` and `trust.html`, C-003's two routes.
3. **Evidence paths are still not resolved.** CI has no checkout of the product repo, so the
   ratchet can only reject an elided path and require `ci-verified` to name a test file. A
   committed manifest of paths and SHAs would close it properly.
4. **The committed visual baselines were stale, and the tolerance hid it.** Inspecting the
   `home-seat-mechanism` diff rather than accepting it showed the *baseline* rendering a demo
   exchange — "Who's our caterer, and what did we overpay last year?" answered with a
   fabricated "$1,240 over" — whose text appears nowhere in the source. That is the invented
   overspend figure Phase 6's adversarial review removed. The baselines predate that fix and
   had been passing anyway, because the changed text was a small enough share of a full-page
   screenshot to sit under `maxDiffPixelRatio: 0.01`. A one-pixel layout shift from the new
   mock disclosure finally pushed the total over the line and exposed it.

   So the visual suite has been protecting less than it appeared to: a copy change confined to
   a small region can alter a claim on the page and still pass. All 42 changed baselines have
   been regenerated and verified stable across two consecutive runs. Worth considering next:
   component-level shots for anything carrying a claim, where the changed region is a large
   enough fraction of the image for the tolerance to bite.
5. Visual baselines remain Windows-only; CI omits the `visual` suite for that reason.
6. No screenshots, demo recording or public application URL exist — a content deliverable.

---

## The precise next safe action

**Make `satvikOS/Tenure` private, or rewrite its history.** Everything else on this list can
wait; that one is disclosing real students' names and email addresses right now, and it is also
the repository whose `ALLOW_DEV_LOGIN_IN_PRODUCTION=true` is the reason `/terms` could not
honestly hold anyone responsible for their account.

After that, in order: decide C-023, so `/trust` can describe the sign-in mechanism properly;
take `/terms` and `/privacy` to counsel; then do the `motion` migration behind its own
verification pass.
