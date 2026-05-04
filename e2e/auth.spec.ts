import { test, expect } from "@playwright/test"

test.describe("Authentification", () => {
  test("page de connexion accessible", async ({ page }) => {
    await page.goto("/auth/signin")

    await expect(page.getByRole("heading", { name: /MenuQR/ })).toBeVisible()
    await expect(page.locator("input[type='email']")).toBeVisible()
  })

  test("soumission du formulaire de connexion", async ({ page }) => {
    await page.goto("/auth/signin")

    const emailInput = page.locator("input[type='email']")
    await emailInput.fill("test@example.com")

    const submitButton = page.locator("button[type='submit']")
    await submitButton.click()

    // Avec EmailProvider sans RESEND_API_KEY configuré, le formulaire reste sur la page
    // mais montre une erreur ou reste sur signin
    await expect(page).toHaveURL(/auth\/signin/)
    // Vérifie que le formulaire est toujours présent (pas de crash)
    await expect(page.locator("input[type='email']")).toBeVisible()
  })

  test("lien de connexion dans le header fonctionne", async ({ page }) => {
    await page.goto("/")
    const signInLink = page.getByRole("link", { name: "Connexion" }).first()
    await signInLink.click()

    await expect(page).toHaveURL("/auth/signin")
  })
})
