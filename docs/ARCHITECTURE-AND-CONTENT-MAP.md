# Architecture and content map

What each route is for, what lives where, and why every section is now one card.

---

## Route jobs

Each route answers one audience's question. A route that cannot state its job in one line does
not deserve to exist — that is why there is no `/features` and no `/solutions`.

| Route | Job | Reader | Priority |
|---|---|---|---|
| `/` | Conviction and orientation. What Tenure is, and why the seat model matters. | Anyone, 60 seconds | 1.0 |
| `/product` | Mechanisms and surfaces. The data model, the weekly reality, and exactly what it connects to. | An evaluator who is already interested | 0.9 |
| `/pilot` | Operational scope of the planned Fall 2026 pilot: who does what, inputs, support, timeline. | An office deciding whether to proceed | 0.9 |
| `/trust` | Precise architecture, data handling, AI disclosure, implemented controls **and what is not built**. | IT, security, procurement | 0.8 |
| `/contact` | First-party conversion. A Tenure request composer plus an email fallback that cannot be blocked. | Someone ready to talk | 0.7 |
| `/story` | Why the company exists and who is building it. | An investor, a recruit, a curious buyer | 0.6 |
| `/privacy` | Legally-framed privacy notice. Founder draft, not counsel-reviewed. | Procurement, legal | 0.3 |
| `/terms` | Terms for early access and the planned pilot. Founder draft. | Procurement, legal | 0.3 |
| `not-found` | Branded recovery with a real 404 status. | Anyone with a stale link | — |

Routes are declared once in [`src/lib/routes.ts`](../src/lib/routes.ts). The sitemap, canonical
URLs, OpenGraph blocks and the SEO tests all derive from that file.

### The top ribbon

Renamed 2026-08-18 from Product / Pilot / Trust / Story to **Platform / Pilot / Security /
About**. The old labels named the page; these name the question the visitor arrived with. Nobody
scans a navigation bar for "Trust", and "Platform" is the site's own word for what it runs — the
home page section is "The platform" and its anchor is `#platform`. **Pilot** is kept because
every alternative ("Rollout", "Get started") implies a commitment C-021 forbids implying. URLs,
`<title>` values and canonicals are unchanged, so nothing indexed moved.

Labels live in `site.nav`; `nav.spec.ts` derives its header assertions from that list.

---

## The compaction pass (2026-08-18)

### What was wrong

The site measured **65.4 desktop viewport-heights** across eight routes — 13.5 on the home page
and 23.8 on a phone. Length was the symptom. The cause was that almost every section answered
its heading with a **grid**: nine platform cards, four audience cards, three console cards, two
problem cards, three integration lanes. A reader met three to nine arguments at once, read none
of them, and paid a full viewport for each set.

Twenty sections also hard-coded `py-24 sm:py-32` — 192px of padding on a phone and 256px on a
desktop, per section, about 2,700px on the home page alone.

### What replaced it

**Every section is one card, showing one thing at a time.** Where a section genuinely had many
items they became a rail or a tab row inside a single panel — eleven platform modules, six
console sections, four sectors, seven trust groups. The completeness argument survives (eleven
names scan faster than nine cards) while only one item is being read.

| Route | Before | After |
|---|---|---|
| `/` | 13.5 | 10.5 |
| `/product` | 9.2 | 7.7 |
| `/pilot` | 14.4 | 5.0 |
| `/trust` | 8.9 | 3.6 |
| `/story` | 4.9 | 4.2 |
| `/privacy` | 5.9 | 5.4 |
| `/terms` | 6.3 | 5.7 |
| **Total** | **65.4** | **44.4** |

Measured by `scripts/measure.mjs`, which reports viewport-heights, word count and section count
per route at both desktop and mobile widths.

**Not one word of `/trust` or `/pilot` was cut.** Those pages are what a security reviewer is
sent instead of a questionnaire, and a written proposal with its limits stated up front. They
are collapsed instead — see `Dossier` below.

### Removed as duplicates, not as cuts

| Component | Why it went |
|---|---|
| `TrustStrip` | A full bordered band for two logos and four chips. Now the hero's closing rail — same words, one less section boundary. |
| `MockDisclosure` | A standalone strip for one sentence, which now closes the hero rail next to the pilot hedge it belongs with. |
| `Integrations` + `ToolLogos` | Near-verbatim copies of each other on two routes — same three headings, same sentences, and `.xlsx` listed twice inside each. Replaced by one `ConnectorMatrix`, itself later rebuilt on `Dossier`: as a flat nine-row table behind a tab filter it was 1,698px, the tallest section on the site, showing nine rows at once — the nine-card platform grid again wearing a table. |
| `WhoFor` | Four audience cards, three routes deep on `/product` — the only place saying Tenure serves nonprofits, SMEs and associations, where none of them would look. Now `Audiences` on the home page. |
| `Handoff`'s "Shadow access" block | Its h3 and `AiOnboarding`'s h2 were the **same sentence, word for word**, over a lifecycle `SeatMechanism` was already animating. Stated once, in the seat panel. |
| `HeroShapes` | Four floating squares in a client component behind `hidden lg:block`. The Memphis figure in `Backdrop`'s aurora variant does the job with real composition. |
| `HeroFloatingCards` | Two cards floating over the dashboard at xl and above. At 1440px they sat **on top of the ledger** — "Membership dues, 28 paid" rendered as "mbership dues". They also duplicated the mock's own Calendar and Approvals panels. |
| `Scheduler` + `lib/calendly.ts` | The inline third-party embed. See `/contact` below. |
| `SupporterStrip` | Imported by nothing. Had been dead since before this pass. |
| `.tn-float` / `.tn-rise` CSS | Dead once both consumers above were removed. |

---

## Home page sequence

```
Hero            the thesis, with origin marks and scope chips in its closing rail
Problem         the cost of turnover, as one ledger read across
SeatMechanism   the durable seat            <- the differentiator, protected
Platform        eleven modules, one open
Handoff         the packet, assembled rather than written
AiOnboarding    questions over permission-scoped sources + the AI disclosure
OfficeConsole   what the body above gets
Audiences       who the model serves, across four sectors
MetricsBand     evidence, counted from the deploying repo
Faq / CtaBand   objections, then the ask
```

---

## Component layers

```
components/
  home/      page sections. Each owns its own copy; none is reused across routes
             except HowItWorks / ProductAtWork, which render on /product
  site/      chrome and cross-cutting surfaces
             SiteHeader, SiteFooter, PageHeader, CtaBand
             WalkthroughRequest  the first-party request composer (/contact)
             ThemeScript         inline, runs before paint
             ThemeToggle         system / light / dark, reads the DOM as its store
             StructuredData      Organization + WebSite JSON-LD
  ui/        primitives:
             Button, ContactSales, Reveal, StatusBadge
             Container/Section/SectionHead/Eyebrow/Rule   the vertical rhythm
             Panel/PanelBar/PanelRail/PanelWell/PanelNote the single card
             Segmented/RailList                           one-of-many selectors
             Dossier                                      long documents, collapsed
  visuals/   Backdrop        composed section backdrops
             MemphisArt      flat geometric ornament, token-filled
             Charts          MemoryCurve, Share, TierNest, GateRail
             ConnectorMatrix what Tenure connects to, including what it does not
             DashboardMock, Ribbons, SectionContour
  lib/       contours.ts  the marching-squares generator; scripts/build-contours.mjs
                          writes public/contours/*.svg at prebuild and
                          SectionContour paints them as CSS masks
  brand/     Logo, Wordmark
```

### The rhythm, in one place

`SECTION` / `SECTION_TIGHT` / `SECTION_BAND` in `ui/layout.tsx` replace the twenty hard-coded
`py-24 sm:py-32` declarations. `<Section>` also owns `relative isolate overflow-hidden`, which is
not optional: `Backdrop` renders at `-z-10`, and without a stacking context of its own that layer
escapes behind the *page* rather than behind the section.

`SectionHead` replaces an eyebrow/heading/lead block that was copy-pasted twenty-two times with
three different heading scales, four different top margins and two `max-w` values.

### Backdrops

`Backdrop` composes four ingredients per variant — mesh washes, a drafting grid or dot field, a
Memphis figure, and a 120px grain tile — so consecutive sections cannot look alike.

**The invariant:** a backdrop is an `aria-hidden` **sibling** of the copy, never an ancestor, and
always masked. That is an accessibility requirement, not a style choice. `a11y.spec.ts` resolves
the background behind each text node by climbing its **ancestors**: a `url()` layer makes the
backdrop unresolvable and the sample is silently *skipped*, and a gradient layer is expanded into
every one of its stops so the darkest becomes the assertion. A texture on a copy-bearing element
therefore either switches the contrast check off or fails it against a colour no reader sees. The
mask is a performance requirement, recorded in `SectionContour.tsx`: 3,101ms of style and layout
unmasked against 699ms masked.

**A new surface must be an existing verified token, or be added to `THEME_PAIRS` and checked.**
The `well` utility was first written as a hand-mixed `color-mix(...)`, and `--text-muted` on it
measured 4.40:1 against a 4.5:1 requirement — caught by axe and by the independent contrast walk,
on two different labels. It is `--surface-subtle` now.

### The Dossier

`/trust` and `/pilot` use native `<details>`, not the JavaScript rail the other pages use. Three
reasons, and the first is the one that matters:

1. `claims.spec.ts` asserts /trust still says "separation of duties", "hash chain", "row-level
   security", "single sign-on" and "SOC 2" **with their disclaimers**. Content held in React
   state that is not rendered cannot be audited — the ratchet would go green because the page
   stopped saying anything, which is the worst possible way for it to pass. The spec opens every
   `<details>` before reading.
2. Ctrl+F has to work. A reviewer searches for "SOC 2" and "backup retention"; browsers find text
   inside a closed `<details>`, and find nothing in an unmounted React subtree.
3. It works with no JavaScript, which a reference document should.

---

## Conversion architecture

One phrase, used everywhere: **"Book a walkthrough."** It replaced "Contact Sales", which
oversold a two-founder company and set the wrong expectation about who picks up.

Every CTA is a `<Link href="/contact">` — a real anchor, not a button that calls a third-party
API. That is exactly what failed in production: the old handler awaited Calendly's script and
only then called `window.open`, outside the user-gesture window, so with `calendly.com` blocked
every CTA on the site silently did nothing.

### `/contact` — what opens is now Tenure's own

The inline Calendly widget is gone. A third party's typography, form controls and cookie banner
opened in the middle of a page that had spent eight sections establishing that this product is
careful about where data goes — the first interactive surface a prospect touched was somebody
else's software.

`WalkthroughRequest` replaces it: a native `<dialog>` that composes the request **in the browser**
and hands it to the visitor's own mail client or clipboard. The site is statically exported, so a
form that appeared to submit would either be a lie or would need a new subprocessor — and C-036
requires the subprocessor list to stay complete and be disclosed on `/privacy` first. The dialog
says plainly that the page sends nothing on its own, and the visitor keeps a copy in their sent
items, which a POST to an unwatched queue does not give them.

The three paths, in order of reliability — the two that never needed JavaScript still do not:

1. a plain `mailto:` anchor to `hello@tenurework.com` — works with everything blocked;
2. the composer, which needs JavaScript and is rendered *beside* (1), never instead of it;
3. a plain `<a target="_blank">` to the scheduler. Calendly stays a disclosed subprocessor
   because a visitor who follows that link still books with them; nothing from it loads here.

`interaction.spec.ts` asserts no Calendly request is made on any route, including while the
composer is open, and that what is typed actually reaches the `mailto` href.

---

## Where the rules live

| Concern | File | Enforced by |
|---|---|---|
| Route truth | `src/lib/routes.ts` | `seo.spec.ts` |
| Per-route metadata | `src/lib/metadata.ts` | `seo.spec.ts` |
| What the site may claim | `src/lib/claims.ts` | `claims.spec.ts` |
| Copy and constants | `src/lib/site.ts` | `claims.spec.ts` (metrics must carry a claimId) |
| Colour and theme | `src/app/globals.css` | `scripts/check-contrast.mjs`, `a11y.spec.ts` |
| Page length | — | `scripts/measure.mjs` (reported, not gated) |
| Security headers | `next.config.ts` | reviewed in `nav.spec.ts` |

### One defect class worth knowing about

**SWC drops the leading space of a multi-line JSX text node that follows an element or an
expression.** `</span> rather\n than…` compiles to `</span>rather than…`. The source looks
correct; only the output is wrong.

This has now bitten the repo three times — "Student Engagementisn't", "hello@tenurework.comand",
and a sweep on 2026-08-18 that found **eleven** more across four routes, including
`<span>seat</span>rather`, `Student Engagement<!-- -->—` and six `<strong>…</strong>—` in
`/privacy`. The first two fixes were one-offs; nothing generalised them.

`claims.spec.ts` now checks the **served markup** for the boundary signature, because by the time
it reaches `innerText` the two words are one word and indistinguishable from a compound. The fix
is always an explicit `{" "}`.
