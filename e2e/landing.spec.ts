import { test, expect } from "@playwright/test"

test.describe("Landing page", () => {
  test("charge et affiche le hero", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: /Votre menu digital/ })).toBeVisible()
    await expect(page.getByText("en 2 minutes")).toBeVisible()
  })

  test("CTA principal est présent", async ({ page }) => {
    await page.goto("/")

    const cta = page.getByRole("link", { name: "Commencer gratuitement" }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute("href", "/auth/signin")
  })

  test("section Comment ça marche visible", async ({ page }) => {
    await page.goto("/")

    await expect(page.getByRole("heading", { name: "Comment ça marche ?" })).toBeVisible()
    await expect(page.getByText("1. Créez votre menu")).toBeVisible()
    await expect(page.getByText("2. Générez le QR code")).toBeVisible()
    await expect(page.getByText("3. Vos clients commandent")).toBeVisible()
  })

  test("section Tarifs visible", async ({ page }) => {
    await page.goto("/")

    // Scroll vers la section pricing
    await page.locator("#pricing").scrollIntoViewIfNeeded()

    await expect(page.getByRole("heading", { name: "Tarifs simples et transparents" })).toBeVisible()
    await expect(page.getByText("Basic").first()).toBeVisible()
    await expect(page.getByText("Pro").first()).toBeVisible()
    await expect(page.getByText("Premium").first()).toBeVisible()
  })
})
