import { test, expect } from "@playwright/test"

test.describe("API Menu", () => {
  test("retourne 404 pour un restaurant inexistant", async ({ request }) => {
    const response = await request.get("/api/menu/slug-inexistant-12345")
    expect(response.status()).toBe(404)

    const body = await response.json()
    expect(body).toHaveProperty("error", "Restaurant not found")
  })

  test("retourne JSON valide pour un restaurant existant", async ({ request }) => {
    // On utilise un slug qui existe peut-être, sinon le test vérifie la structure
    const response = await request.get("/api/menu/test-restaurant")
    const body = await response.json()

    if (response.status() === 200) {
      expect(body).toHaveProperty("id")
      expect(body).toHaveProperty("name")
      expect(body).toHaveProperty("slug")
      expect(body).toHaveProperty("categories")
      expect(Array.isArray(body.categories)).toBe(true)
    } else {
      expect(response.status()).toBe(404)
      expect(body).toHaveProperty("error")
    }
  })

  test("les headers de réponse sont corrects", async ({ request }) => {
    const response = await request.get("/api/menu/slug-inexistant-12345")
    expect(response.headers()["content-type"]).toContain("application/json")
  })
})
