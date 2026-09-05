import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    include: ["tests/**/*.test.{ts,tsx}"],
    environment: "node",
    environmentOptions: { jsdom: { url: "http://localhost" } },
    setupFiles: ["./tests/setup.ts"],
  },
})
