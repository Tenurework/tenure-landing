import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Wordmark } from "@/components/brand/Wordmark";
import { ContactSalesLink } from "@/components/ui/ContactSales";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-line-dark bg-ink">
      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pt-16 sm:px-8 sm:pt-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Wordmark tone="paper" />
            <p className="mt-5 max-w-xs text-[0.95rem] leading-relaxed text-paper/65">
              {site.tagline}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/40">
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
                    className="text-[0.95rem] text-paper/65 transition-colors hover:text-paper"
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
                <ContactSalesLink className="group inline-flex items-center gap-1.5 text-[0.95rem] text-paper transition-colors hover:text-grove-bright">
                  Contact Sales
                  <span
                    aria-hidden
                    className="text-grove-bright transition-transform duration-300 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </ContactSalesLink>
              </li>
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-[0.95rem] text-paper/65 transition-colors hover:text-paper"
                >
                  {site.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-8 sm:px-8">
        <div className="flex flex-col gap-4 border-t border-line-dark pt-7 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="h-4 w-4 text-grove" />
            <span className="text-sm text-paper/45">
              © {year} {site.name}. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {site.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-paper/45 transition-colors hover:text-paper"
              >
                {item.label}
              </Link>
            ))}
            <span aria-hidden className="h-3 w-px bg-line-dark" />
            <a
              href={site.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/45 transition-colors hover:text-paper"
            >
              LinkedIn
            </a>
            <span aria-hidden className="text-paper/30">
              /
            </span>
            <a
              href={site.socials.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-paper/45 transition-colors hover:text-paper"
            >
              X
            </a>
          </div>
        </div>
      </div>

      {/* giant embossed bloom + wordmark, at the very end, bleeding off the bottom */}
      <div
        aria-hidden
        className="pointer-events-none relative z-0 mt-12 flex select-none items-center justify-center gap-[2.5vw] overflow-hidden"
      >
        <Logo className="h-[15vw] max-h-[15rem] w-[15vw] max-w-[15rem] shrink-0 translate-y-[6%] text-[#244a70]" />
        <span className="wordmark-giant block translate-y-[12%]">Tenure</span>
      </div>
    </footer>
  );
}
