import { expect, test } from "@playwright/test"

/**
 * The gallery is a real consumer of the built package. These assertions fail
 * for exactly the three reasons a packaging change can break every consumer:
 * Tailwind not scanning the package's components (`@source`), the exports map
 * not resolving, and a client boundary lost in the build.
 */
test("the package's classes are generated and the theme resolves", async ({ page }, info) => {
  const errors: string[] = []
  page.on("pageerror", (e) => errors.push(String(e)))
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()) })
  page.on("response", (r) => { if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`) })
  await page.goto("/")

  const isMobile = info.project.name === "mobile"
  const shell = page.locator(".page-shell").first()
  await expect(shell).toHaveCSS("max-width", isMobile ? "1184px" : "1200px")
  await expect(page.locator("h1").first()).toHaveCSS("font-family", /Newsreader/)

  const hero = page.getByTestId("step-hero")
  const heroSize = parseFloat(await hero.evaluate((el) => getComputedStyle(el).fontSize))
  expect(heroSize).toBeGreaterThan(40)

  // The same Button inside the two panels — tokens flip by ancestor class.
  await expect(page.getByTestId("light-panel").getByRole("button", { name: "Primary" })).toHaveCSS("background-color", "rgb(10, 10, 10)")
  await expect(page.getByTestId("dark-panel").getByRole("button", { name: "Primary" })).toHaveCSS("background-color", "rgb(250, 250, 250)")
  // Classes that live outside dist/components (control-variants.js) must be generated too.
  await expect(page.getByTestId("dark-panel").getByRole("button", { name: "Primary" })).toHaveCSS("color", "rgb(10, 10, 10)")
  await expect(page.getByTestId("light-panel").getByRole("button", { name: "Primary" })).toHaveCSS("color", "rgb(255, 255, 255)")

  // A Radix dialog opening proves the "use client" boundary survived the build.
  await page.getByTestId("dark-panel").getByRole("button", { name: "Open dialog" }).click()
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")

  expect(errors).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0)
  await page.screenshot({ path: info.outputPath("gallery.png"), fullPage: true })
})
