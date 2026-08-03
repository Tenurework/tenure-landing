"use client";

import { useRef, useState } from "react";
import { loadCalendly } from "@/lib/calendly";
import { site } from "@/lib/site";
import { buttonClasses } from "@/components/ui/Button";

type State = "idle" | "loading" | "ready" | "failed";

/**
 * On-demand scheduling.
 *
 * Three rules this component exists to enforce:
 *  1. Nothing third-party loads until the visitor asks for it.
 *  2. The visitor is never stranded. The "open in a new tab" link is a plain
 *     anchor rendered from the start, so it works with the script blocked, with
 *     JavaScript off, and under a popup blocker — the failure mode the old
 *     button-plus-popup CTA had in production.
 *  3. If the embed fails, it says so and points at the two paths that still
 *     work, rather than leaving a blank rectangle.
 */
export function Scheduler() {
  const [state, setState] = useState<State>("idle");
  const host = useRef<HTMLDivElement>(null);

  async function show() {
    if (state === "loading" || state === "ready") return;
    setState("loading");
    try {
      await loadCalendly();
      if (!host.current || !window.Calendly) throw new Error("calendly");
      host.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        // NO hide_gdpr_banner. That parameter switches off a third party's own
        // consent prompt, and this site publishes no cookie notice of its own to
        // replace it — so suppressing it removed the only disclosure a visitor
        // would ever see. Calendly's banner stays on.
        url: `${site.calendlyUrl}?background_color=ffffff&primary_color=116d45`,
        parentElement: host.current,
      });
      setState("ready");
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        {/* Always present, never script-dependent. */}
        <a
          href={site.calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClasses("primary", "lg")}
        >
          <span className="relative z-10 inline-flex items-center gap-2">
            Book a walkthrough
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M6 3h7v7M13 3 3.5 12.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        {/* A real disclosure: the control stays put and reports its own state,
            rather than vanishing once expanded and leaving nothing to collapse. */}
        <button
          type="button"
          onClick={() => (state === "ready" ? setState("idle") : show())}
          disabled={state === "loading"}
          className={buttonClasses("secondary", "lg")}
          aria-controls="scheduler-embed"
          aria-expanded={state === "ready"}
        >
          <span className="relative z-10">
            {state === "loading"
              ? "Loading calendar…"
              : state === "ready"
                ? "Hide the calendar"
                : "Or pick a time here"}
          </span>
        </button>
      </div>

      <p className="mt-4 text-sm text-text-muted">
        Booking opens Calendly. Nothing from Calendly loads on this site until
        you choose one of the options above. Calendly is a third party: once it
        opens it sets its own cookies and receives the details you enter to book.
      </p>

      {state === "failed" && (
        <p
          role="status"
          className="mt-5 rounded-xl border border-line bg-warning-subtle px-4 py-3 text-sm text-warning"
        >
          The calendar could not load — it is often blocked on university
          networks. Use the button above to open it in a new tab, or just email{" "}
          <a
            href={`mailto:${site.email}`}
            className="underline underline-offset-4"
          >
            {site.email}
          </a>
          .
        </p>
      )}

      <div
        id="scheduler-embed"
        ref={host}
        className={state === "ready" ? "mt-8 min-h-[680px]" : "hidden"}
      />
    </div>
  );
}
