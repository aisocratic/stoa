import { defineConfig } from "@playwright/test"

// Locally reuse the installed Chrome (no download); CI installs Playwright's Chromium.
const channel = process.env.CI ? undefined : "chrome"

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  use: { baseURL: "http://localhost:4321", trace: "retain-on-failure" },
  webServer: { command: "node scripts/serve.mjs", url: "http://localhost:4321", reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { browserName: "chromium", channel, viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { browserName: "chromium", channel, viewport: { width: 390, height: 844 } } },
  ],
})
