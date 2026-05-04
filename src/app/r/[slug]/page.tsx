"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function PublicMenuPage() {
  const params = useParams()
  const slug = params.slug as string
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([])

  useEffect(() => {
    if (slug) {
      fetch(`/api/menu/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          setRestaurant(data)
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Restaurant non trouvé</h1>
          <p className="text-gray-600">Ce menu n'existe pas ou a été désactivé.</p>
        </div>
      </div>
    )
  }

  const allAllergens = [...new Set(restaurant.categories.flatMap((c: any) => c.items.flatMap((i: any) => i.allergens)))]

  const filteredCategories = restaurant.categories.map((category: any) => ({
    ...category,
    items: category.items.filter((item: any) => {
      if (selectedAllergens.length === 0) return true
      return !selectedAllergens.some((allergen) => item.allergens.includes(allergen))
    }),
  })).filter((category: any) => category.items.length > 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header
        className="py-12 px-4 text-center"
        style={{
          background: `linear-gradient(135deg, ${restaurant.primaryColor}, ${restaurant.secondaryColor})`,
        }}
      >
        <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="text-white/80 text-lg max-w-2xl mx-auto">{restaurant.description}</p>
        )}
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`} className="text-white/80 mt-2 inline-block">
            📞 {restaurant.phone}
          </a>
        )}
      </header>

      {/* Allergen Filter */}
      {allAllergens.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-sm text-gray-600 mb-2">Filtrer par allergènes :</p>
          <div className="flex flex-wrap gap-2">
            {allAllergens.map((allergen: string) => (
              <button
                key={allergen}
                onClick={() => {
                  setSelectedAllergens((prev) =>
                    prev.includes(allergen) ? prev.filter((a) => a !== allergen) : [...prev, allergen]
                  )
                }}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedAllergens.includes(allergen)
                    ? "bg-red-100 text-red-700 border border-red-300"
                    : "bg-gray-100 text-gray-700 border border-gray-200"
                }`}
              >
                {allergen}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu */}
      <main className="max-w-4xl mx-auto px-4 pb-12">
        {filteredCategories.map((category: any) => (
          <section key={category.id} className="mb-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-orange-500">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-gray-600 mb-4">{category.description}</p>
            )}

            <div className="space-y-4">
              {category.items.map((item: any) => (
                <div
                  key={item.id}
                  className={`flex justify-between items-start p-4 rounded-lg ${
                    item.isHighlighted ? "bg-orange-50 border border-orange-200" : "bg-gray-50"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      {item.isHighlighted && (
                        <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                          ⭐ Coup de cœur
                        </span>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-gray-600 mt-1">{item.description}</p>
                    )}
                    {item.allergens.length > 0 && (
                      <p className="text-sm text-red-600 mt-2">
                        Allergènes: {item.allergens.join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="ml-4">
                    <span className="text-xl font-bold" style={{ color: restaurant.primaryColor }}>
                      {item.price.toFixed(2)}€
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucun plat ne correspond aux filtres sélectionnés.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">
          Menu propulsé par{" "}
          <Link href="/" className="text-orange-400 hover:text-orange-300">
            MenuQR
          </Link>
        </p>
      </footer>
    </div>
  )
}
