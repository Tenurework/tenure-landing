# Tenure — marketing site

The public site for **Tenure**, a governed system of record for organizations where leadership
turns over on a schedule. The organizing object is the **durable seat**: money, decisions,
files, approvals, deadlines and context attach to the position, not to the person temporarily
holding it, so the next leader inherits the record instead of rebuilding it.

Live: **[tenurework.com](https://www.tenurework.com)**

---

## Ground rules

This site describes a real product that is still early. Two rules keep it honest, and both are
enforced by tests rather than by good intentions:

1. **A capability may only be described as available on the strength of the repository that
   actually deploys** (`satvikOS/Tenure`). Something built in `satvikOS/Tenure-Parent` but not
   yet cut over may be described only as built-pending-cutover, and only explicitly.
2. **Every material public claim has a row in the claims register** with the commit it was
   verified against and the file that proves it — see
   [`docs/PUBLIC-CLAIMS-REGISTER.md`](docs/PUBLIC-CLAIMS-REGISTER.md), generated from
   [`src/lib/claims.ts`](src/lib/claims.ts).

`e2e/claims.spec.ts` fails the build if a forbidden phrase reappears in rendered copy, if a
metric is added without a register entry, or if a claim asserts more than its evidence supports.

---

## Stack

- **Next.js 16.2.9** (App Router, React 19, TypeScript), statically prerendered
- **Tailwind CSS v4** with CSS-first tokens in `src/app/globals.css`
- **motion** for the few remaining animated surfaces; scroll reveals are plain CSS
- Self-hosted **General Sans** (display + body) via `next/font/local`, **IBM Plex Mono**
  (labels, data) via `next/font/google`
- **Playwright** for functional, accessibility, SEO, claims and visual-regression tests
- Deployed on **Vercel**

> Next 16 is not the Next.js most references describe. `middleware.ts` is deprecated in favour
> of `proxy.ts` (Node runtime only), `next/image`'s `priority` is deprecated in favour of
> `preload`, `next lint` is gone, and `not-found.tsx` returns **200** for streamed responses.
> Read `node_modules/next/dist/docs/` before changing framework behaviour — see `AGENTS.md`.

---

## Design system

A calm, high-density light **and** dark system. Signature accent is a dark forest green; the
deep navy bands are a structural device, not a theme.

### Tokens

`src/app/globals.css` declares two layers:

- a **semantic layer** on `:root` — `--canvas`, `--surface`, `--text`, `--text-muted`,
  `--border`, `--accent`, `--on-accent`, status colours, `--chart-1..6`, elevation. These are
  the only values that change between themes.
- a **Tailwind layer** (`@theme inline`) mapping utilities onto those variables. Because the
  mapping is `inline`, Tailwind emits `var(--canvas)` rather than a literal, so every utility
  follows the theme at runtime and there is no `dark:` variant anywhere in the codebase.

Legacy brand names (`text-ink`, `bg-paper`, `text-grove`…) are kept as aliases onto the semantic
roles, which is what let ~230 existing utilities become theme-aware without touching the
components. **Prefer the semantic names in new code.**

Colours are OKLCH so the ramps stay perceptually even. Every foreground/background pair the UI
actually renders is verified against WCAG 2.2 AA:

```bash
npm run check:contrast     # 72 pairs across both themes; fails CI on a regression
```

It also guards against the two dark-theme blocks (the `prefers-color-scheme` one and the
`[data-theme="dark"]` one) drifting apart, which CSS cannot express in a single rule.

### Theming

`ThemeScript` writes `data-theme` onto `<html>` during HTML parsing, before first paint. It is a
raw inline `<script>` on purpose: `next/script` with `beforeInteractive` explicitly *does not*
block hydration, so the first paint would still use the wrong theme. `<html>` carries
`suppressHydrationWarning` because React would otherwise treat the attribute as a hydration
error and re-render, reintroducing the flash.

`"system"` removes the attribute rather than writing a value, so the OS preference keeps
applying if it changes mid-session.

### Motion

Scroll reveals are CSS, scoped behind a `.js` class the inline script adds. The hidden state
therefore applies **only when JavaScript is running** — without it, everything renders visible.
The previous implementation used `motion`'s `initial={{ opacity: 0 }}`, which React serialises
into an inline style, shipping 118 invisible elements on the home page alone.

The hero headline has no entrance animation at all: it is the LCP element.

---

## Project structure

```
src/
  app/
    layout.tsx            root metadata, theme script, skip link, JSON-LD
    page.tsx              home
    product|pilot|trust|story|contact|privacy|terms/
    not-found.tsx         branded 404 (returns a real 404 status)
    robots.ts             /robots.txt
    sitemap.ts            /sitemap.xml
    globals.css           design tokens, both themes
  components/
    home/                 home-page sections
    site/                 header, footer, theme control, scheduler, JSON-LD
    ui/                   Button, ContactSales, Reveal, StatusBadge, layout primitives
    visuals/              DashboardMock, AuditTrailDemo, ContourField, Ribbons
    brand/                Logo, Wordmark
  lib/
    routes.ts             single source of route truth (sitemap, metadata, tests read this)
    metadata.ts           per-route canonical/OpenGraph/Twitter composition
    claims.ts             claims register + forbidden phrasings
    site.ts               site constants and marketing content
    fonts.ts  cn.ts  calendly.ts
e2e/                      Playwright suites (see e2e/README.md)
scripts/
  check-contrast.mjs      WCAG gate over the tokens
  check-links.mjs         static internal-link checker
  build-claims-doc.mjs    regenerates the claims register document
  shot.mjs / og.mjs       screenshots and the social card
docs/
  PUBLIC-CLAIMS-REGISTER.md   generated — do not edit by hand
  LANDING-REFINEMENT-LEDGER.md
```

### Adding a route

Add it to `src/lib/routes.ts` and nothing else needs wiring: the sitemap, the canonical URL, the
OpenGraph block and the SEO tests all derive from that entry. A route that exists without a
`routes.ts` record fails `seo.spec.ts`.

---

## Develop

```bash
npm ci
npm run dev            # http://localhost:3000
npm run build
npm run lint
npm run typecheck
```

### Tests

```bash
npm run test           # everything, across 4 projects (light/dark × desktop/mobile)
npm run test:e2e       # routing, navigation, interaction
npm run test:a11y      # axe + keyboard, target size, reflow, zoom, measured contrast
npm run test:seo       # metadata, canonical, sitemap, robots, JSON-LD
npm run test:claims    # the claim-accuracy ratchet
npm run test:visual    # visual regression
npm run test:visual:update   # re-baseline — review every changed image first
```

A changed screenshot is **evidence to inspect, not a file to accept**. If a diff is a real
improvement, update it and say so in the commit; if it is not, it is a regression.

```bash
npm run check:contrast
npm run check:links    # after a build
npm run check:perf     # Lighthouse budgets — needs a server, see below
npm run claims:build   # regenerate the register document from src/lib/claims.ts
npm run claims:evidence # resolve every evidence path against the product repos
npm run build:contours # regenerate public/contours/*.svg (also runs from prebuild)
npm run verify         # lint + typecheck + contrast + build + tests
```

### Performance budgets

`check:perf` measures the bible's §13 targets with Lighthouse against a real production
build. It needs the site already running, in another terminal:

```bash
npm run build && npm run start -- -p 3100   # terminal 1
npm run check:perf                          # terminal 2
npm run check:perf -- --runs=3              # median of 3, for a number worth quoting
npm run check:perf -- --only=/product       # one route
```

It is **not** in CI, deliberately. This is a lab measurement of a local server, and it is
sensitive to whatever else the machine is doing — measured on a developer workstation with a
chat client and a browser open, TBT for the same build swung between 45 ms and 424 ms on
routes that ship almost no JavaScript. A hard budget gate on a shared runner would fail for
reasons that have nothing to do with the commit, and a flaky gate teaches people to ignore
gates. Run it locally, take the median of three, and compare like with like.

The scores that *are* stable run to run — Accessibility, Best Practices, SEO and CLS — are
worth trusting from a single run. Performance, LCP and TBT are not.

---

## Editing content

Most copy and links live in **`src/lib/site.ts`**. Two areas are governed rather than free:

- **Pilot language.** The Fall 2026 pilot with Simon's Office of Student Engagement is
  **verbally agreed and not contracted**. Nothing may state it as settled, call the office a
  partner, customer or sponsor, or imply university endorsement. Use *planned*, *proposed* or
  *targeting*. `claims.spec.ts` enforces this.
- **Metrics.** Every entry in `site.metrics` must carry a `claimId` that resolves to a live or
  CI-verified claim. Numbers are counted from the deploying repository, and each names a
  mechanism rather than an outcome — nothing measures onboarding duration, so there is no
  "3-day onboarding" counter.

**Privacy** and **Terms** are founder-written drafts that have not been reviewed by counsel, and
both say so on the page. Tenure is not yet an incorporated entity.

---

## Security headers

Set in `next.config.ts`. The site-wide CSP is strict; `/contact` alone is permitted to reach
Calendly, and only after an explicit click. Nonces are deliberately not used: Next 16 disables
static rendering entirely for nonce-based CSP, which is a bad trade for a fully static
marketing site with no user data.
