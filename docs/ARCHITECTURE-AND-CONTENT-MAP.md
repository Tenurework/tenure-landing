# Architecture and content map

What each route is for, what lives where, and why the home page stopped carrying all of it.

---

## Route jobs

Each route answers one audience's question. A route that cannot state its job in one line does
not deserve to exist — that is why there is no `/features` and no `/solutions`.

| Route | Job | Reader | Priority |
|---|---|---|---|
| `/` | Conviction and orientation. What Tenure is, and why the seat model matters. | Anyone, 60 seconds | 1.0 |
| `/product` | Mechanisms and surfaces. The data model, the weekly reality, what is live vs planned. | An evaluator who is already interested | 0.9 |
| `/pilot` | Operational scope of the planned Fall 2026 pilot: who does what, inputs, support, timeline. | An office deciding whether to proceed | 0.9 |
| `/trust` | Precise architecture, data handling, AI disclosure, implemented controls **and what is not built**. | University IT, security, procurement | 0.8 |
| `/contact` | First-party conversion. Scheduling plus an email fallback that cannot be blocked. | Someone ready to talk | 0.7 |
| `/story` | Why the company exists and who is building it. | An investor, a recruit, a curious buyer | 0.6 |
| `/privacy` | Legally-framed privacy notice. Founder draft, not counsel-reviewed. | Procurement, legal | 0.3 |
| `/terms` | Terms for early access and the planned pilot. Founder draft. | Procurement, legal | 0.3 |
| `not-found` | Branded recovery with a real 404 status. | Anyone with a stale link | — |

Routes are declared once in [`src/lib/routes.ts`](../src/lib/routes.ts). The sitemap, canonical
URLs, OpenGraph blocks and the SEO tests all derive from that file, so adding a page there is
enough to get it indexed correctly, and adding one anywhere else fails `seo.spec.ts`.

---

## Home page: what happened to every section

The home page ran 16 sections, ~3,185 words and 18.3 viewport-heights — about five times the
length of any other route, with four arguments made twice.

| Section | Decision | Rationale |
|---|---|---|
| Hero | **Keep** | The thesis. Headline no longer animates: it is the LCP element |
| TrustStrip | **Keep** | One-line orientation, ~20 words. Pilot chips rewritten to hedged language |
| Problem | **Keep** | The turnover cost. Already tight |
| SeatMechanism | **Keep — protected** | The durable seat. This is the differentiator and the reason the product is not a wiki |
| HowItWorks | **Move → `/product`** | A second telling of the seat mechanism plus the handoff. The hero and SeatMechanism already made it |
| Platform | **Keep, compressed** | What Tenure actually runs. Module descriptions cut to one line each; the interactive view kept, because losing the surfaces makes the product look smaller |
| Handoff | **Keep, compressed** | The proof. Prose that duplicated the mock was cut, the mock kept |
| AiOnboarding | **Keep, compressed** | The second half of the handoff proof. **Now carries the AI provider disclosure** |
| MetricsBand | **Keep, compressed** | Evidence. Every number recounted from the deploying repo |
| ProductAtWork | **Move → `/product`** | Product surfaces belong on the product page |
| Governance | **Merge → OfficeConsole + `/trust`** | Addressed the office in the third person while OfficeConsole addressed it directly. The security detail is better served on `/trust`, where a reviewer will look for it |
| OfficeConsole | **Keep, compressed** | "For the office". Absorbed Governance's office-facing argument |
| WhoFor | **Move → `/product`** | Audience segmentation is a consideration-stage question |
| Integrations | **Keep, compressed** | Trust and fit. Three honest mechanism lanes; the one-way calendar qualifier is load-bearing. The Excel, Outlook and Google Calendar marks were removed on 2026-08-03 and replaced with file-format chips: C-029 forbids a vendor logo without connector code and an end-to-end test, and there is none — spreadsheets are parsed from bytes, and the calendar is a one-way ICS feed no vendor participates in. Under a heading reading "Fits your stack", a vendor mark reads as an integration whatever the sentence beneath it says |
| Faq | **Keep, compressed** | Reduced to the four questions asked first; depth links to `/trust` |
| CtaBand | **Keep** | The ask |

### Resulting sequence

```
Hero            the thesis
TrustStrip      orientation
Problem         why handoffs fail today
SeatMechanism   the durable seat            <- the differentiator
Platform        what Tenure runs
Handoff         the packet, assembled not written
AiOnboarding    questions over permission-scoped sources + AI disclosure
OfficeConsole   what the office gets
Integrations    how it fits, and what it does not connect to
MetricsBand     evidence, counted from the deploying repo
Faq             objections
CtaBand         the ask
```

### One regression this restructure caused, and how it was caught

Removing `Governance` from the home page silently removed the **only** mention of Anthropic as
the AI subprocessor — a §7.4 disclosure requirement. A grep for "Anthropic" across
`src/components` after the merge returned exactly one hit, in the file that had just been
deleted. The disclosure now lives in `AiOnboarding`, which is where a reader meets the AI
anyway, and `claims.spec.ts` asserts that both `/` and `/trust` name the provider.

The general lesson: merging sections moves obligations, not just paragraphs.

---

## Component layers

```
components/
  home/      page sections. Each owns its own copy; none is reused across routes
             except HowItWorks / ProductAtWork / WhoFor, which now render on /product
  site/      chrome and cross-cutting surfaces
             SiteHeader, SiteFooter, PageHeader, CtaBand, SupporterStrip
             ThemeScript      inline, runs before paint
             ThemeToggle      system / light / dark, reads the DOM as its store
             Scheduler        on-demand Calendly, always with a plain-anchor fallback
             StructuredData   Organization + WebSite JSON-LD
  ui/        primitives: Button, ContactSales, Reveal, StatusBadge, MockDisclosure,
             Container/Eyebrow/Rule
  visuals/   product mocks and decoration: DashboardMock, AuditTrailDemo, Ribbons,
             SectionContour, ToolLogos
  lib/       contours.ts  the marching-squares generator, moved out of the component
                          tree. scripts/build-contours.mjs writes public/contours/*.svg
                          at prebuild and SectionContour paints them as CSS masks; it
                          used to render inline SVG, which put 60 KB gzipped of path
                          data in the home document and the same again in the RSC
                          payload
  brand/     Logo, Wordmark
```

### Where the rules live

| Concern | File | Enforced by |
|---|---|---|
| Route truth | `src/lib/routes.ts` | `seo.spec.ts` |
| Per-route metadata | `src/lib/metadata.ts` | `seo.spec.ts` |
| What the site may claim | `src/lib/claims.ts` | `claims.spec.ts` |
| Copy and constants | `src/lib/site.ts` | `claims.spec.ts` (metrics must carry a claimId) |
| Colour and theme | `src/app/globals.css` | `scripts/check-contrast.mjs`, `a11y.spec.ts` |
| Security headers | `next.config.ts` | reviewed in `nav.spec.ts` |

---

## Conversion architecture

One phrase, used everywhere: **"Book a walkthrough."** It replaced "Contact Sales", which
oversold a two-founder company and set the wrong expectation about who picks up.

Every CTA is a `<Link href="/contact">` — a real anchor. It is not a button that calls a
third-party API, because that is exactly what failed in production: the old handler awaited
Calendly's script and only then called `window.open`, outside the user-gesture window, so with
`calendly.com` blocked every CTA on the site silently did nothing.

`/contact` then offers, in order of reliability:

1. a plain `<a>` to the scheduler, opening in a new tab — works with JavaScript off;
2. an on-demand inline embed, loaded only after an explicit click;
3. a visible `hello@tenurework.com` fallback that never depends on anything.

If the embed fails it says so and points at 1 and 3, rather than leaving a blank rectangle.
`interaction.spec.ts` tests the blocked-Calendly path specifically.
