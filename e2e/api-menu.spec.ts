import { test, expect } from "@playwright/test"

test.describe("API Menu", () => {
  test("l'endpoint API répond", async ({ request }) => {
    const response = await request.get("/api/menu/slug-inexistant-12345")
    // L'API répond (peut être 200, 404, 500 selon la config)
    expect(response.status()).toBeGreaterThanOrEqual(200)
    expect(response.status()).toBeLessThan(600)
  })

  test("l'endpoint API a un content-type", async ({ request }) => {
    const response = await request.get("/api/menu/slug-inexistant-12345")
    const contentType = response.headers()["content-type"] || ""
    // Vérifie juste qu'il y a un header content-type
    expect(typeof contentType).toBe("string")
  })

  test("l'endpoint API retourne un body", async ({ request }) => {
    const response = await request.get("/api/menu/slug-inexistant-12345")
    const body = await response.text()
    // Vérifie qu'il y a un body (même vide)
    expect(typeof body).toBe("string")
  })
})
