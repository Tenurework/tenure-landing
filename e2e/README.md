# e2e — the landing site's test suite

Six spec files run against a **real production build**, never the dev server. That is not
incidental: prerendered metadata, the absence of `opacity: 0` in server-rendered HTML, and the
real 404 status code only behave correctly under `next build && next start`. `playwright.config.ts`
starts the server itself on port 3100 (`PORT=…` to change it), so you never start it by hand —
but you **must** have built first.

```bash
npm run build          # required before any of the commands below
npm test               # everything, all four projects
```

| Suite | Command | What it holds the site to |
| --- | --- | --- |
| Navigation & interaction | `npm run test:e2e` | routes resolve, links go where they say, the header/menu/scheduler behave |
| Accessibility | `npm run test:a11y` | axe, heading order, contrast, focus behaviour |
| SEO | `npm run test:seo` | titles, descriptions, canonicals, sitemap and robots agree with `src/lib/routes.ts` |
| Claims | `npm run test:claims` | the site never says something the product cannot back up |
| Visual | `npm run test:visual` | rendered pixels against committed baselines |

### The project matrix

Every spec runs four times: `desktop-light`, `desktop-dark`, `mobile-light`, `mobile-dark`.
Narrow a run while you work:

```bash
npx playwright test visual.spec.ts --project=desktop-light
npx playwright test --grep "mobile navigation"
npx playwright test --ui                      # pick and re-run individual tests
npx playwright show-report                    # last run, with traces and diffs
```

---

## Visual baselines

Baselines live in `e2e/visual.spec.ts-snapshots/` as
`<name>-<project>-<platform>.png` — 74 files, one per shot per project. They are committed, and
they are generated on **win32**; a machine on another platform writes a different filename and
will report every shot as missing rather than as a diff.

### Reading a failure

A failed visual test writes three images into `test-results/` — `…-expected.png`,
`…-actual.png`, `…-diff.png` — and `npx playwright show-report` puts them side by side with a
slider. The tolerance is `maxDiffPixelRatio: 0.01`, which absorbs antialiasing and font
rasterisation jitter. Anything that trips it moved, resized, changed colour, or disappeared.

**A changed screenshot is evidence, not a chore.** Look at the diff before you touch anything and
decide which of these it is:

1. **A regression.** Fix the site. The baseline was right.
2. **An intended design change.** Update the baseline — and say so in the commit message, so the
   next reader knows the new pixels were chosen rather than accepted.
3. **A defect the baseline was already recording.** These exist. A baseline captures what the site
   *does*, which is not always what it *should* do; see the note on `text-inverse` at the top of
   `visual.spec.ts`. Fixing such a defect is a legitimate reason for the diff, and the new
   baseline is the improvement.

Never run `--update-snapshots` to make a red build green. Rewriting the baseline deletes the only
record of what the page used to look like, and a suite that always agrees with the current build
detects nothing.

### Updating deliberately

```bash
npm run build
npm run test:visual:update                                   # all four projects
npx playwright test visual.spec.ts --project=mobile-dark -u  # or just the one that moved
git diff --stat e2e/visual.spec.ts-snapshots                 # review the PNGs before committing
```

Then run `npm run test:visual` **without** the flag and confirm it is green. An update run reports
success by definition; only a plain run proves the new baselines are stable.

### Determinism

Nothing is masked. There is no live data on this site, so a mask would only hide a regression.

Four surfaces do animate on a timer — `SeatMechanism`, `DashboardMock`, `AuditTrailDemo` and
`ProductAtWork` — and each would otherwise land on a random frame. All four are gated on
`useReducedMotion()` in source, so `visual.spec.ts` emulates reduced motion and then *asserts* the
page really sees it. `settle()` from `support.ts` handles the rest: it neutralises CSS animation
and transition, waits for fonts, and scrolls the reveal-on-view content into view. Every shot
waits for `[data-reveal]` to have resolved, so a screenshot can never capture a page with half its
copy still invisible.

If a shot ever becomes genuinely non-deterministic, say what varies in the PR. Do not reach for a
mask first.

---

## Reading a `claims.spec.ts` failure

This is the suite that fails the build over a sentence. It exists because the pilot is verbally
agreed and not contracted, and because several capabilities the copy could plausibly imply do not
exist. `src/lib/claims.ts` is the machine-readable register; `docs/PUBLIC-CLAIMS-REGISTER.md` is
rendered from it by `npm run claims:build`.

The failure message names the claim ID. Look it up in `src/lib/claims.ts`, read its `evidence` and
`qualification`, and match the failure to one of these shapes:

- **A forbidden phrase appeared in the copy.** `forbiddenPhrases` names the phrase, the reason and
  the claim that forbids it — for example `hash-chained`, because `AuditEvent` has no hash column,
  or `SOC 2` outside a sentence that also says *roadmap*. The site is wrong. **Rewrite the copy.**
- **Pilot language overstated the relationship.** `forbiddenPilotPhrases` (governed by C-021)
  catches *partner*, *sponsored by*, *in partnership with*, *is rolling out*. Permitted:
  *planned*, *targeting Fall 2026*, *proposed scope*.
- **A metric rendered without a `claimId`.** Every number in `site.metrics` must point at a row in
  the register. Add the claim, with its evidence, before adding the number.
- **A claim is stale.** `lastVerified` is older than `reviewBy`. Re-verify it against the
  deploying repo and move both dates, or downgrade its `availability`.
- **A `live` claim is only evidenced in Tenure-Parent.** Only `satvikOS/Tenure` — the repository
  that actually deploys — supports "available today". Parent work is *built, pending cutover*, and
  only when said explicitly.

The one move that is never correct is loosening the register to match the copy. The register is
the record of what is true; the copy is what we are allowed to say about it.
