import { defineConfig, devices } from "@playwright/test";

/**
 * The landing site had screenshot scripts but no test suite. This config backs
 * five: functional, accessibility, SEO, claims and visual regression.
 *
 * Everything runs against a real production build (`next start`), not the dev
 * server, because three of the things under test — prerendered metadata, the
 * absence of `opacity: 0` in server-rendered HTML, and the real 404 status —
 * only behave correctly in a production build.
 */
const PORT = Number(process.env.PORT ?? 3100);
const baseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }], ["list"]]
    : [["list"], ["html", { open: "never" }]],

  // Visual comparisons are the reason for the tolerance: font rasterisation
  // differs slightly between machines, and a 1px antialiasing shift is not a
  // regression worth failing a build over. Layout changes exceed this easily.
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },

  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    // Deterministic rendering for visual tests.
    timezoneId: "UTC",
    locale: "en-US",
  },

  /*
    TWO PROJECTS, NOT FOUR. The dark-theme projects were deleted on 2026-08-20
    with the theme itself — the site now renders one way, so a dark run was
    asserting a palette that no longer exists and doubling the suite for nothing.
  */
  projects: [
    {
      name: "desktop-light",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 1000 }, colorScheme: "light" },
    },

    {
      name: "mobile-light",
      use: { ...devices["Pixel 7"], colorScheme: "light" },
    },

  ],

  webServer: {
    command: `npm run start -- -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
