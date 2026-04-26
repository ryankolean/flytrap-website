import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      include: ["src/lib/jsonld/**/*.ts", "src/lib/jsonld/**/*.tsx"],
      exclude: ["src/lib/jsonld/**/*.test.ts", "src/lib/jsonld/**/*.test.tsx"],
      thresholds: {
        lines: 80,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
