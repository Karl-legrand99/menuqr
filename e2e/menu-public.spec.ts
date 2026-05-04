import { test, expect } from "@playwright/test"

test.describe("Menu public", () => {
  test("charge un menu public existant", async ({ page }) => {
    await page.goto("/r/test-restaurant")

    await expect(page.getByRole("heading", { name: "Restaurant non trouvé" })).toBeVisible()
  })

  test("retourne 404 pour un slug inexistant", async ({ page }) => {
    const response = await page.goto("/r/slug-inexistant-12345")
    expect(response?.status()).toBe(404)
  })
})
