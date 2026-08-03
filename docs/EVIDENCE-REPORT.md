# Release evidence — `refine/landing-bible-v1`

Branch: `refine/landing-bible-v1` · head `d0f8cb5` · base `fb6a3bd`
Nothing merged. Nothing deployed. No production side effect.

---

## Commands run, and their results

All run on Windows 11, Node 24.16.0, from the repository root.

| Command | Exit | Result |
|---|---|---|
| `npm ci` | 0 | clean install; 5 high-severity advisories inherited from the dependency tree |
| `npm run lint` | 0 | no errors, no warnings |
| `npm run typecheck` | 0 | clean |
| `npm run build` | 0 | 12 routes prerendered |
| `npm run check:contrast` | 0 | **72/72** token pairs pass WCAG 2.2 AA across both themes; dark blocks agree on all 38 tokens |
| `npm run check:links` | 0 | **111** internal links, **0** broken |
| `npm run claims:build` | 0 | 32 claims, 20 forbidden phrases |
| `npx playwright test` (all 4 projects) | 0 | **1,052 passed · 0 failed · 16 skipped** (6.2 min) |

### Test suites

Four browser projects: `desktop-light`, `desktop-dark`, `mobile-light`, `mobile-dark`.

| Suite | Tests | Result |
|---|---|---|
| `nav.spec.ts` | routing, links, mobile menu, skip link, 404 | pass |
| `interaction.spec.ts` | theme, CTA, third-party gating, FAQ, reduced motion, no-JS | pass |
| `seo.spec.ts` | 69 | pass — metadata, canonical, sitemap, robots, JSON-LD |
| `claims.spec.ts` | 42 | pass — the claim-accuracy ratchet |
| `a11y.spec.ts` | axe + keyboard, target size, reflow, zoom, measured contrast | pass — 268/268 across 4 projects |
| `visual.spec.ts` | 74 baselines | pass; regenerated and confirmed stable on a second run |

**All suites pass.** The two failures recorded in the first draft of this report are fixed: an infinite opacity loop in ProductAtWork that put text below AA forever, and its two successor forms.

### Skipped tests

16 skips across 4 projects = 4 distinct `test.fixme` entries, each pinning a defect in a file
its own suite does not own, with a comment explaining why:

- `claims.spec.ts` × 2 — the register attributes three absence-proof claims (`C-028`, `C-029`,
  `C-030`) to a repository while citing no file, because "grep returns zero hits" has no path.
  The live test therefore demands a path only from claims asserting a capability exists.
- `interaction.spec.ts` × 1, `visual.spec.ts` × 1 — environment-dependent guards.

Three other `test.fixme` entries were **un-pinned** after I fixed their defects at source, and
now pass: the SOC 2 "in progress" chip, the three over-long meta descriptions, and the
`og:image` dimension mismatch.

---

## Before and after

Measured from prerendered HTML, and against production for the baseline.

| | Before | After |
|---|---|---|
| Home words | 3,185 | **1,975** (−38%) |
| Home headings | 51 | **33** (−35%) |
| Home DOM elements | 1,992 | 1,561 (−22%) |
| Home HTML payload | 640 KB | **453 KB** (−29%) |
| Prerendered `opacity:0` elements (home) | 118 | 8 |
| Measured WCAG AA failures | **177** | **0** |
| Routes canonicalising to the home page | 5 of 5 sub-pages | 0 |
| Routes with JSON-LD | 0 | 8 |
| Routes loading Calendly | 7 (incl. the 404) | 1, after an explicit click |
| Security headers | HSTS only | CSP + 5 |
| First-party tests | 0 | **1,052** passing across 4 projects |

---

## Highest-risk claims corrected or blocked

| Claim | Disposition |
|---|---|
| "100% of actions logged" | Corrected — real coverage is 49 of 63 server actions, stated on `/trust` |
| Five-step approval chain with an "Advisor" gate | Corrected — two gates, seven request types. No Advisor gate exists |
| "policy v4 · frozen 2026-09-12 · append-only snapshot" | Removed — an invented artifact. `policySnapshot` is never read back |
| Messaging "in-app, email, and push" | Corrected — every write is `in_app`; there is no mail or push path |
| "least-access by default" | Corrected — any institution account can read every organization |
| "instant answers" | Corrected — retrieval is keyword AND-matching, no embeddings |
| "SOC 2 roadmap, in progress" | Removed — no audit, no controls, no report |
| OSE pilot stated as fact | **Downgraded to planned/proposed** — verbally agreed, not contracted |
| "Founding Fall 2026 pilot" / "Every org OSE stewards" | Downgraded — asserted a settled scope |
| "Partner: OSE" | Changed to "Built with" — no partnership implication |
| "never trains on your data, by us or by Anthropic" | **Split** — the "by us" half is verifiable; the Anthropic half is now attributed to Anthropic's terms |
| 11 integration vendor logos | Deleted from `public/` — no connector code exists for any of them |

### Live vs Parent vs roadmap

The distinction is enforced, not merely observed. `src/lib/claims.ts` records an
`evidenceRepo` per claim, and `claims.spec.ts` fails the build if a claim marked `live` or
`ci-verified` is sourced to `Tenure-Parent` or to nothing. **No claim on the site today rests on
Parent-only evidence.**

The AI provider gate was checked first-hand in both repositories: both call
`https://api.anthropic.com/v1/messages` directly, model `claude-haiku-4-5-20251001`. There is no
Bedrock integration anywhere — the only occurrence of the word in Parent's executable code is
inside a list of clients to *forbid*. Public and legal copy therefore still says Anthropic, and
`claims.spec.ts` asserts the word "Bedrock" appears nowhere on the site.

---

## Light, dark, responsive and accessibility

- **Both themes ship.** Verified three ways: the OKLCH source through
  `scripts/check-contrast.mjs`, the hex Lightning CSS actually emits, and an independent
  hex→luminance computation. All three agree — e.g. the dark canvas is `#0a1118` by every route.
- **No flash.** The theme is applied by an inline `<head>` script during HTML parsing, the
  pattern Next 16 documents. `next/script` `beforeInteractive` was rejected: its execution
  explicitly does not block hydration.
- **Responsive** at 320, 360, 390, 768, 1024, 1280 and 1440 px. No horizontal scroll at 320 px
  on any route; no sideways scroll at 200% text size.
- **Target size** — the term controls were 6×6 CSS px against the 24×24 minimum. Fixed without
  changing how they look.
- **Keyboard** — skip link is the first focusable element on every route; the mobile menu moves
  focus in, contains Tab, and restores focus to its trigger on Escape.
- **Without JavaScript** the site renders. Prerendered `opacity:0` elements went from 118 to 8
  on the home page and to zero on four routes.

---

## Artifacts

| What | Where |
|---|---|
| Visual baselines | `e2e/visual.spec.ts-snapshots/` — 74 PNGs, 4 projects |
| Playwright HTML report | `playwright-report/` (gitignored) |
| Claims register | `docs/PUBLIC-CLAIMS-REGISTER.md` (generated) |
| Ledger | `docs/LANDING-REFINEMENT-LEDGER.md` |
| Content map | `docs/ARCHITECTURE-AND-CONTENT-MAP.md` |
| Governing document | `docs/DEVELOPMENT-BIBLE-v1.0.md` |
| Adversarial review | `docs/ADVERSARIAL-REVIEW-FINDINGS.md` — 144 findings, 8 personas |

Baseline screenshots of the **pre-change** production site were captured at all seven widths
during Phase 0 and kept out of the repository deliberately: they are recoverable from production
and would add ~40 PNGs of pre-change state to the history. The measurements taken from them are
recorded in the ledger.

---

## Remaining risks and blockers

### Cannot be fixed by engineering

| ID | Item | Needs |
|---|---|---|
| `C-021` | The Fall 2026 pilot is verbal, not contracted | A signed document before definite language returns |
| `C-027` | FERPA wording | Counsel review; currently framed as intent only |
| `C-030` | "Anthropic does not train on your data" | The commercial terms in force |
| `C-032` | No operating legal entity | Incorporation. Privacy and Terms carry a founder-draft banner meanwhile |

### Escalated — outside this repository

**`X-01` (P0): `github.com/satvikOS/Tenure` is public and the student roster is still in git
history.** `git show d799608:scripts/roster-data.mjs` returns real names and
`@simon.rochester.edu` addresses for ~153 students and 19 advisors; the `Tier1/*.xlsx`
spreadsheets are likewise reachable. Untracking them in `63db4eb` did not redact history. The
development bible makes that repository read-only for this work, so it is escalated rather than
fixed. Remediation is a history rewrite plus a GitHub cache purge, or making the repository
private. **Treat those addresses as already disclosed.**

`X-02` (P1): `ANTHROPIC_API_KEY` is a plaintext ECS environment variable while every other
secret in the same file uses `valueFrom`.

`X-03` (P1): production runs `AUTH_DEV_LOGIN=true` and `ALLOW_DEV_LOGIN_IN_PRODUCTION=true`.

### Open engineering items

1. The 2 failing `a11y` tests on `/product` (`ProductAtWork` opacity animation).
2. **Phase 6 P1/P2 backlog.** The review ran and produced 144 findings; all 22 P0s are fixed, but 53 P1s are recorded rather than resolved — chiefly the legal gaps in /terms, the deletion contradiction between /privacy and /trust, the undisclosed subprocessors, and the missing backup/retention/DR statements. See ADVERSARIAL-REVIEW-FINDINGS.md.
3. Visual baselines are Windows-only. CI omits the `visual` suite for that reason, with the
   remedy documented inline in the workflow.
4. Performance budgets were not measured with Lighthouse. Payload was reduced 29% and the cause
   of the bloat identified, but no Lighthouse score was taken, so §13's numeric targets are
   unverified.

---

## The precise next safe action

**Make `satvikOS/Tenure` private, or rewrite its history.** Everything else on this list can
wait; that one is disclosing real students' names and email addresses right now.

After that, in order: take the legal gaps in /terms to counsel (procurement will not sign the
current document); reconcile the /privacy deletion promise with /trust; disclose AWS and Calendly
as subprocessors; take a Lighthouse measurement. Then review this branch and merge.

The adversarial gate has now been met for P0. It has NOT been met for P1 — 53 findings are
recorded and unresolved, and most of the legal ones would stop a university signing.
