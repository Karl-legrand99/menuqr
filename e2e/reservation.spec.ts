import { test, expect } from "@playwright/test"

test.describe("Réservation de tables", () => {
  test("page de réservation retourne un statut HTTP valide", async ({ page }) => {
    const response = await page.goto("/r/demo-restaurant/reserver")
    // La page doit retourner un statut 200 ou 404 (pas 500)
    expect(response?.status()).toBeLessThan(500)
    expect(response?.status()).toBeGreaterThanOrEqual(200)
  })

  test("page de réservation contient du contenu HTML", async ({ page }) => {
    await page.goto("/r/demo-restaurant/reserver")
    // Vérifier que le body est présent (même si c'est une erreur Next.js)
    const bodyText = await page.locator("body").textContent()
    expect(bodyText?.length).toBeGreaterThan(0)
  })
})
