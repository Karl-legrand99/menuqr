import { test, expect } from "@playwright/test"

test.describe("Landing page", () => {
  // Helper pour forcer la langue FR et recharger
  async function gotoWithLocale(page: any, path: string) {
    await page.goto(path)
    await page.evaluate(() => {
      localStorage.setItem("menuqr-locale", "fr")
    })
    await page.reload()
  }

  test("charge et affiche le hero", async ({ page }) => {
    await gotoWithLocale(page, "/")

    await expect(page.getByRole("heading", { name: /Votre menu digital/ })).toBeVisible()
    await expect(page.getByText("en 2 minutes")).toBeVisible()
  })

  test("CTA principal est présent", async ({ page }) => {
    await gotoWithLocale(page, "/")

    const cta = page.getByRole("link", { name: "Commencer gratuitement" }).first()
    await expect(cta).toBeVisible()
    await expect(cta).toHaveAttribute("href", "/auth/signin")
  })

  test("section Comment ça marche visible", async ({ page }) => {
    await gotoWithLocale(page, "/")
    // Attendre que le contenu i18n soit chargé (le provider lit localStorage en useEffect)
    await page.waitForSelector("text=Comment ça marche ?", { timeout: 5000 })

    await expect(page.getByRole("heading", { name: "Comment ça marche ?" })).toBeVisible()
    await expect(page.getByText("1. Créez votre menu")).toBeVisible()
    await expect(page.getByText("2. Générez le QR code")).toBeVisible()
    await expect(page.getByText("3. Vos clients commandent")).toBeVisible()
  })

  test("section Tarifs visible", async ({ page }) => {
    await gotoWithLocale(page, "/")

    // Scroll vers la section pricing et attendre que le contenu soit visible
    await page.locator("#pricing").scrollIntoViewIfNeeded()
    await page.waitForTimeout(200)

    // Vérifier que la section pricing est présente (utilise le texte traduit)
    const pricingHeading = page.locator("#pricing h2").first()
    await expect(pricingHeading).toBeVisible()
    
    // Vérifier les 3 plans
    await expect(page.getByText("Basic").first()).toBeVisible()
    await expect(page.getByText("Pro").first()).toBeVisible()
    await expect(page.getByText("Premium").first()).toBeVisible()
  })
})
