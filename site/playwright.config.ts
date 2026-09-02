import { defineConfig } from "@playwright/test"

export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  use: { baseURL: "http://localhost:4321", trace: "retain-on-failure" },
  webServer: { command: "node scripts/serve.mjs", url: "http://localhost:4321", reuseExistingServer: true },
  projects: [
    { name: "desktop", use: { browserName: "chromium", channel: "chrome", viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { browserName: "chromium", channel: "chrome", viewport: { width: 390, height: 844 } } },
  ],
})
