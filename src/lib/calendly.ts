/**
 * Calendly loader, single source for the scheduling widget. The floating badge
 * (initialized once in CalendlyBadge) and every inline "Contact Sales" CTA
 * (which opens a popup) both route through here, so the assets load exactly once.
 */
const CALENDLY_CSS = "https://assets.calendly.com/assets/external/widget.css";
const CALENDLY_JS = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (opts: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding: boolean;
      }) => void;
      initPopupWidget: (opts: { url: string }) => void;
    };
  }
}

let loadPromise: Promise<void> | null = null;

/** Idempotently inject Calendly's stylesheet + script; resolves when ready. */
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
      else existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("calendly")));
      return;
    }

    const script = document.createElement("script");
    script.src = CALENDLY_JS;
    script.async = true;
    script.setAttribute("data-calendly", "");
    script.addEventListener("load", () => resolve());
    script.addEventListener("error", () => {
      loadPromise = null;
      reject(new Error("calendly"));
    });
    document.body.appendChild(script);
  });

  return loadPromise;
}

/** Open the Calendly scheduling popup; falls back to a new tab if blocked. */
export function openCalendlyPopup(url: string): void {
  loadCalendly()
    .then(() => {
      if (window.Calendly) window.Calendly.initPopupWidget({ url });
      else window.open(url, "_blank", "noopener,noreferrer");
    })
    .catch(() => window.open(url, "_blank", "noopener,noreferrer"));
}
