/**
 * Calendly loader.
 *
 * Previously this ran on every page: a global floating badge in the root layout
 * called it on mount, so calendly.com's script, stylesheet and cookie panel
 * loaded on all seven routes — including the 404 — before any user had asked to
 * schedule anything.
 *
 * It is now called from exactly one place: the scheduler on /contact, and only
 * after an explicit click. Every path that reaches Calendly also has a plain
 * <a href> fallback that works when this never loads.
 */
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

let loadPromise: Promise<void> | null = null;

/** Idempotently inject Calendly's stylesheet + script; rejects if either fails. */
export function loadCalendly(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (loadPromise) return loadPromise;

  loadPromise = new Promise<void>((resolve, reject) => {
    if (!document.querySelector("link[data-calendly]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = CALENDLY_CSS;
      link.setAttribute("data-calendly", "");
      document.head.appendChild(link);
    }

    const existing = document.querySelector<HTMLScriptElement>("script[data-calendly]");
    if (existing) {
      if (window.Calendly) resolve();
      else {
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", () => reject(new Error("calendly")));
      }
      return;
    }

    const script = document.createElement("script");
    script.src = CALENDLY_JS;
    script.async = true;
    script.setAttribute("data-calendly", "");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      // Reset so a retry can re-attempt rather than resolving from a dead cache.
      loadPromise = null;
      reject(new Error("calendly"));
    });
    document.body.appendChild(script);
  });

  return loadPromise;
}
