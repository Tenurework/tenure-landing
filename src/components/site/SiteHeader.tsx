"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Wordmark } from "@/components/brand/Wordmark";
import { ContactSales } from "@/components/ui/ContactSales";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300",
        scrolled || open
          ? "border-line bg-paper/85 backdrop-blur-xl"
          : "border-transparent",
      )}
    >
      <div className="mx-auto flex h-[68px] w-full max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
        <Wordmark />

        <nav className="hidden items-center gap-0.5 md:flex">
          {site.nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-md px-3.5 py-2 text-[0.92rem] transition-colors duration-200",
                  active ? "text-ink" : "text-ink-soft hover:text-ink",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-3.5 bottom-1 h-0.5 origin-left rounded-full bg-grove transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    active ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center md:flex">
          <ContactSales size="sm" arrow />
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="-mr-2 flex h-10 w-10 items-center justify-center text-ink md:hidden"
        >
          <span className="relative block h-3 w-5">
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300",
                open ? "top-1.5 rotate-45" : "top-0",
              )}
            />
            <span
              className={cn(
                "absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-current transition-opacity duration-200",
                open ? "opacity-0" : "opacity-100",
              )}
            />
            <span
              className={cn(
                "absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all duration-300",
                open ? "top-1.5 -rotate-45" : "top-3",
              )}
            />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden md:hidden"
          >
            <nav className="flex flex-col gap-1 px-5 pb-6 pt-2">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-md px-2 py-3 text-lg text-ink/90 hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-3 px-2">
                <ContactSales size="md" arrow className="w-full" />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
