import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Local scratch. `.shots/` holds screenshots and the one-off inspection
    // scripts written while auditing the rendered site; it is gitignored, and
    // holding throwaway probes to the same standard as shipped source turns the
    // lint gate into noise the moment anyone investigates anything.
    ".shots/**",
    "playwright-report/**",
    "test-results/**",
  ]),
]);

export default eslintConfig;
