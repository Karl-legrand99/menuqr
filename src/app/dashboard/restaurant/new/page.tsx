"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NewRestaurantPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    address: "",
    phone: "",
    primaryColor: "#FF6B35",
    secondaryColor: "#2C3E50",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const isDemo = localStorage.getItem("demo-mode") === "true"

    const res = await fetch("/api/restaurant", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        ...(isDemo ? { "x-demo-mode": "true" } : {})
      },
      body: JSON.stringify(form),
    })

    const data = await res.json().catch(() => null)

    if (res.ok) {
      router.push("/dashboard")
    } else {
      setError(data?.error || "Erreur lors de la création du restaurant")
    }
    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Nouveau Restaurant</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom du restaurant</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          />
          <p className="text-sm text-gray-500 mt-1">menuqr.fr/r/{form.slug}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur principale</label>
            <input
              type="color"
              value={form.primaryColor}
              onChange={(e) => setForm({ ...form, primaryColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Couleur secondaire</label>
            <input
              type="color"
              value={form.secondaryColor}
              onChange={(e) => setForm({ ...form, secondaryColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 disabled:opacity-50"
        >
          {loading ? "Création..." : "Créer le restaurant"}
        </button>
      </form>
    </div>
  )
}
