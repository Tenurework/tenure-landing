"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

/**
 * Buttery momentum scrolling (Lenis). Enabled only for real users, disabled
 * under automation (navigator.webdriver) and reduced-motion so screenshots and
 * accessibility behave with native scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!navigator.webdriver && !reduced) setSmooth(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!smooth) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.09, wheelMultiplier: 1, touchMultiplier: 1.4 }}>
      {children}
    </ReactLenis>
  );
}
