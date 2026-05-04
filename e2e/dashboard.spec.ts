import { test, expect } from "@playwright/test"

test.describe("Dashboard", () => {
  test("redirige vers la page de connexion si non authentifié", async ({ page }) => {
    await page.goto("/dashboard")

    // Le dashboard est protégé par NextAuth, on doit être redirigé vers /auth/signin
    await expect(page).toHaveURL(/auth\/signin/)
  })

  test("redirige vers la page de connexion pour les sous-routes", async ({ page }) => {
    await page.goto("/dashboard/menu")

    await expect(page).toHaveURL(/auth\/signin/)
  })
})
