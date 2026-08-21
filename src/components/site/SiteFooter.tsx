import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Wordmark } from "@/components/brand/Wordmark";
import { ContactSalesLink } from "@/components/ui/ContactSales";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line-dark bg-band">
      {/*
        `pb-12` is the fix for a rule cutting through a link. The column block had
        top padding and none at the bottom, and the bottom bar below it draws its
        own `border-t`, so on a wide viewport the Explore column's last item
        ("About") sat exactly on that line, with the rule crossing the text.
      */}
      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-4 pb-12 pt-16 sm:px-6 sm:pb-14 sm:pt-20 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark tone="paper" />
            <p className="mt-5 max-w-xs text-body leading-relaxed text-inverse/65">
              {site.tagline}
            </p>
            <p className="mt-4 max-w-xs text-body-sm leading-relaxed text-inverse/75">
              Founded at {site.origin.school}, {site.origin.university}.
            </p>
          </div>

          <nav className="md:col-span-3" aria-label="Explore">
            <p className="label-mono">Explore</p>
            <ul className="mt-4 space-y-3">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-body text-inverse/65 transition-colors hover:text-inverse"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <p className="label-mono">Get started</p>
            <ul className="mt-4 space-y-3">
              <li>
                {/*
                  No children: fall through to site.ctaLabel. site.ts retired
                  "Contact Sales" because it oversold a two-founder company and set
                  the wrong expectation for who picks up, but this call site passed
                  the literal string and overrode the decision on all eight routes.
                */}
                <ContactSalesLink className="group inline-flex items-center gap-1.5 text-body text-inverse transition-colors hover:text-grove-bright">
                  {site.ctaLabel}
                  <span
                    aria-hidden
                    className="text-grove-bright transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </ContactSalesLink>
              </li>
              {/*
                A LINK ACTUALLY CALLED "CONTACT".

                Neither the ribbon nor this footer contained one: /contact was
                reachable only behind a green button labelled "Book a
                walkthrough", so a visitor looking for a way to reach a human,                 or scanning a footer for the word every other site puts there,                 found nothing. It goes here rather than in the four-item ribbon,
                which has no room and whose labels name the question a visitor
                arrived with, not the pages that exist.
              */}
              <li>
                <Link
                  href="/contact"
                  className="text-body text-inverse/65 transition-colors hover:text-inverse"
                >
                  Contact
                </Link>
              </li>
              <li>
                <a
                  href={`mailto:${site.email.general}`}
                  className="text-body text-inverse/65 transition-colors hover:text-inverse"
                >
                  {site.email.general}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[90rem] px-4 pb-8 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-4 border-t border-line-dark pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="h-4 w-4 text-grove" />
            <span className="text-body-sm text-inverse/75">
              © {year} {site.name}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-body-sm">
            {site.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-inverse/75 transition-colors hover:text-inverse"
              >
                {item.label}
              </Link>
            ))}
            <span aria-hidden className="h-3 w-px bg-line-dark" />
            {/*
              MARKS, NOT WORDS, and only the two that exist. "LinkedIn / X" set
              in body copy read as two more footer links competing with Privacy
              and Terms; a glyph is recognised without being read. Each keeps a
              visually-hidden label, because an icon-only link with no accessible
              name is announced as its URL.
            */}
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-inverse/70 transition-colors hover:bg-inverse/10 hover:text-inverse"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-[18px] w-[18px]" fill="currentColor">
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0Z" />
              </svg>
              <span className="sr-only">Tenure on LinkedIn</span>
            </a>
            <a
              href={`mailto:${site.email.general}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-inverse/70 transition-colors hover:bg-inverse/10 hover:text-inverse"
            >
              <svg viewBox="0 0 24 24" aria-hidden className="h-[19px] w-[19px]" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                <path d="m3.5 7 7.6 5.3a1.6 1.6 0 0 0 1.8 0L20.5 7" strokeLinecap="round" />
              </svg>
              <span className="sr-only">Email Tenure</span>
            </a>
          </div>
        </div>
      </div>

      {/* giant embossed bloom + wordmark, at the very end, bleeding off the bottom */}
      <div
        aria-hidden
        className="pointer-events-none relative z-0 mt-12 flex select-none items-center justify-center gap-[2.5vw] overflow-hidden"
      >
        {/* Same value as the top stop of `.wordmark-giant`, so the logomark and
            the wordmark emboss at identical strength in both themes. */}
        <Logo className="h-[15vw] max-h-[15rem] w-[15vw] max-w-[15rem] shrink-0 translate-y-[6%] text-[color:color-mix(in_oklab,var(--inverse-raised)_100%,white_14%)]" />
        <span className="wordmark-giant block translate-y-[12%]">Tenure</span>
      </div>
    </footer>
  );
}
