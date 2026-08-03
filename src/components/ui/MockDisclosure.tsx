import { Container } from "@/components/ui/layout";

/**
 * "Illustrations, not screenshots", said once, where it is actually needed.
 *
 * /product carried this disclosure scoped to "the two panels below". The home
 * page — which renders a treasury balance, a category breakdown and ledger, a
 * handoff packet naming a person at a plausible @u.rochester.edu address, an
 * administration console with a live-looking override and audit row, and two AI
 * exchanges — carried none at all. The prerendered index.html contained zero
 * occurrences of the words "illustration" or "screenshot".
 *
 * That matters more on this page than anywhere else, because MetricsBand sits
 * below the same mocks under the heading "Counted, not projected — every number
 * below is counted from the repository that deploys". A reader has no way to know
 * the guarantee stops at the band and does not extend upward.
 *
 * The honest fix is one quiet line, not a watermark over the design. Replacing
 * the mocks with real captures of the seeded environment remains a content
 * deliverable, and this component should be deleted when that happens.
 */
export function MockDisclosure({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Container>
        <p className="mx-auto max-w-3xl text-center text-[0.8rem] leading-relaxed text-ink-faint">
          The product surfaces shown on this page are illustrations, not
          screenshots. They draw behaviour the product really has; the names,
          balances and figures in them are representative rather than measured.
        </p>
      </Container>
    </div>
  );
}
