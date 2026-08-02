import Link from "next/link";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

/**
 * Branded 404.
 *
 * Previously unmatched URLs fell through to the framework's stock
 * "404: This page could not be found." rendered inside the site chrome — which
 * is also what /robots.txt and /sitemap.xml returned before those routes
 * existed.
 *
 * Note on status codes: Next 16 returns 200 for a *streamed* not-found response
 * and 404 only when the response is not streamed. This page has no suspending
 * data fetch and no loading.tsx above it, so it is not streamed and does return
 * a real 404. Next also injects `<meta name="robots" content="noindex">` on 404
 * responses automatically, so no manual noindex is needed here.
 */
export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[60vh] flex-col justify-center py-24">
        <p className="label-mono">Error 404</p>
        <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.08] tracking-tight text-text sm:text-5xl">
          That page moved on.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-text-secondary">
          The link is broken or the page no longer exists. The record, at least,
          is still where you left it.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Button href="/" arrow>
            Back to home
          </Button>
          <Button href="/product" variant="secondary">
            See the product
          </Button>
        </div>

        <div className="mt-12 border-t border-line pt-6">
          <p className="text-sm text-text-muted">
            Looking for something specific?{" "}
            <Link
              href="/contact"
              className="text-accent-text underline underline-offset-4 hover:text-accent"
            >
              Get in touch
            </Link>{" "}
            or email{" "}
            <a
              href={`mailto:${site.email}`}
              className="text-accent-text underline underline-offset-4 hover:text-accent"
            >
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </Container>
  );
}
