import { test, expect } from "@playwright/test"

test.describe("Menu public", () => {
  test("affiche un message pour un restaurant inexistant", async ({ page }) => {
    await page.goto("/r/slug-inexistant-12345")

    // La page client-side affiche "Restaurant non trouvé" même avec un 200 HTTP
    await expect(page.getByText("Restaurant non trouvé")).toBeVisible()
  })

  test("retourne une page valide pour tout slug", async ({ page }) => {
    const response = await page.goto("/r/slug-inexistant-12345")
    // La page Next.js retourne toujours 200 (client-side rendering)
    expect(response?.status()).toBe(200)
  })
})
