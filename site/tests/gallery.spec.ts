import { expect, test } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"

/**
 * The gallery is a real consumer of the built package. These assertions fail
 * for exactly the reasons a packaging change can break every consumer:
 * Tailwind not scanning the package's components (`@source`), the exports map
 * not resolving, a client boundary lost in the build — and now the two-layer
 * colour model not resolving through `var()` and `color-mix()`.
 */
test("the package's classes are generated and the theme resolves", async ({ page }, info) => {
  const errors: string[] = []
  page.on("pageerror", (e) => errors.push(String(e)))
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text())
  })
  page.on("response", (r) => {
    if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`)
  })
  await page.goto("/")
  // The static export is visible before React attaches event handlers.
  // ThemeToggle changes its accessible name only after the client has mounted.
  await expect(page.getByRole("button", { name: /Switch to (light|dark) mode/ }).first()).toBeVisible()

  const isMobile = info.project.name === "mobile"
  const shell = page.locator(".page-shell").first()
  await expect(shell).toHaveCSS("max-width", isMobile ? "1184px" : "1200px")
  await expect(page.locator("h1").first()).toHaveCSS("font-family", /Newsreader/)

  const hero = page.getByTestId("step-hero")
  const heroSize = parseFloat(await hero.evaluate((el) => getComputedStyle(el).fontSize))
  expect(heroSize).toBeGreaterThan(40)

  // The header nav is the body face, uppercase and tracked — `text-nav`.
  const nav = page.getByTestId("nav-sample")
  await expect(nav).toHaveCSS("text-transform", "uppercase")
  await expect(nav).toHaveCSS("font-family", /Space Grotesk/)
  expect(parseFloat(await nav.evaluate((el) => getComputedStyle(el).letterSpacing))).toBeCloseTo(14 * 0.08, 1)

  // The same Button inside the two panels — roles resolve through the palette by ancestor class.
  const light = page.getByTestId("light-panel")
  const dark = page.getByTestId("dark-panel")
  await expect(light).toHaveCSS("background-color", "rgb(240, 238, 230)") // Anthropic ivory-medium
  await expect(light.getByRole("button", { name: "Primary" })).toHaveCSS("background-color", "rgb(20, 20, 19)") // warm ink
  await expect(light.getByRole("button", { name: "Primary" })).toHaveCSS("color", "rgb(250, 249, 245)")
  await expect(dark.getByRole("button", { name: "Primary" })).toHaveCSS("background-color", "rgb(250, 250, 250)")
  // Classes that live outside dist/components (control-variants.js) must be generated too.
  await expect(dark.getByRole("button", { name: "Primary" })).toHaveCSS("color", "rgb(10, 10, 10)")
  // Two rungs: controls are 10px, surfaces 16px.
  await expect(light.getByRole("button", { name: "Primary" })).toHaveCSS("border-radius", "10px")
  await expect(light).toHaveCSS("border-radius", "16px")
  // `--reading` must resolve to the theme-specific prose color in each panel.
  const readingIn = (panel: typeof light) => panel.evaluate((el) => getComputedStyle(el).getPropertyValue("--reading"))
  expect(await readingIn(light)).not.toBe("")
  expect(await readingIn(light)).not.toBe(await readingIn(dark))

  // A Radix dialog opening proves the "use client" boundary survived the build.
  await dark.getByRole("button", { name: "Open dialog" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(page.getByRole("dialog")).toBeHidden()
  await expect(page.locator("[data-slot=dialog-overlay]")).toHaveCount(0)

  // The admin chrome renders with its sidebar contained in the demo frame.
  const admin = page.getByTestId("admin-demo")
  await expect(admin.locator("aside")).toHaveCount(1)
  await expect(admin.locator("aside").getByRole("link", { name: "Events" })).toHaveCSS(
    "background-color",
    isMobile ? /rgb/ : "rgb(250, 250, 250)",
  )

  // Tables: sorting flips the header state; forms and auth render and switch mode.
  const table = page.getByTestId("table-demo")
  const guests = table.getByRole("columnheader", { name: "Guests" })
  await guests.getByRole("button").click()
  await expect(guests).toHaveAttribute("aria-sort", "ascending")
  await guests.getByRole("button").click()
  await expect(guests).toHaveAttribute("aria-sort", "descending")
  await expect(page.getByTestId("form-demo").getByRole("button", { name: "Meetup" })).toHaveAttribute("aria-pressed", "true")
  const authCard = page.getByTestId("auth-card")
  await authCard.getByRole("button", { name: "Join" }).click()
  await expect(authCard.getByRole("button", { name: "Join" })).toHaveAttribute("aria-pressed", "true")
  await expect(authCard.getByRole("button", { name: /Continue with Google/ })).toBeVisible()

  expect(errors).toEqual([])
  // No horizontal overflow. Linux Chromium can report a negative delta with scrollbar-gutter, hence ≤.
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0)
  await page.screenshot({ path: info.outputPath("gallery.png"), fullPage: true })
})

test("keyboard controls and accessibility semantics remain intact", async ({ page }) => {
  await page.goto("/")
  // The static export is visible before React attaches event handlers.
  // ThemeToggle changes its accessible name only after the client has mounted.
  await expect(page.getByRole("button", { name: /Switch to (light|dark) mode/ }).first()).toBeVisible()
  const table = page.getByTestId("table-demo")
  const guests = table.getByRole("columnheader", { name: "Guests" })
  await guests.getByRole("button").focus()
  await page.keyboard.press("Enter")
  await expect(guests).toHaveAttribute("aria-sort", "ascending")

  const results = await new AxeBuilder({ page }).disableRules(["color-contrast"]).analyze()
  expect(results.violations.filter((violation) => ["serious", "critical"].includes(violation.impact ?? ""))).toEqual([])
})
