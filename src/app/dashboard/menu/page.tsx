"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import ImageUpload from "@/components/ImageUpload"

function MenuPageContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurant")
  const [categories, setCategories] = useState<any[]>([])
  const [newCategory, setNewCategory] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (restaurantId) {
      fetch(`/api/restaurant`)
        .then((res) => res.json())
        .then((data) => {
          const restaurant = data.find((r: any) => r.id === restaurantId)
          if (restaurant) {
            setCategories(restaurant.categories)
          }
          setLoading(false)
        })
    }
  }, [restaurantId])

  const addCategory = async () => {
    if (!newCategory.trim()) return

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ restaurantId, name: newCategory }),
    })

    if (res.ok) {
      const category = await res.json()
      setCategories([...categories, category])
      setNewCategory("")
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestion du Menu</h1>

      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nouvelle catégorie (ex: Entrées)"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={addCategory}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          Ajouter
        </button>
      </div>

      <div className="space-y-6">
        {categories.map((category: any) => (
          <div key={category.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
            
            {category.items.length === 0 ? (
              <p className="text-gray-500">Aucun plat dans cette catégorie</p>
            ) : (
              <div className="space-y-3">
                {category.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-12 h-12 rounded object-cover border border-gray-200"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <span className="font-bold text-orange-500">{item.price}€</span>
                  </div>
                ))}
              </div>
            )}

            <AddItemForm categoryId={category.id} onAdd={(item) => {
              setCategories(categories.map((c: any) => 
                c.id === category.id ? { ...c, items: [...c.items, item] } : c
              ))
            }} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Chargement...</div>}>
      <MenuPageContent />
    </Suspense>
  )
}

function AddItemForm({ categoryId, onAdd }: { categoryId: string, onAdd: (item: any) => void }) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [image, setImage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const res = await fetch("/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name, description, price: parseFloat(price), image }),
    })

    if (res.ok) {
      const item = await res.json()
      onAdd(item)
      setName("")
      setDescription("")
      setPrice("")
      setImage(null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-2">
      <input
        type="text"
        placeholder="Nom du plat"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="text"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
      />
      <input
        type="number"
        step="0.01"
        placeholder="Prix (€)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
      />
      <div className="md:col-span-4">
        <ImageUpload value={image} onChange={setImage} onRemove={() => setImage(null)} />
      </div>
      <button
        type="submit"
        className="md:col-span-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
      >
        Ajouter
      </button>
    </form>
  )
}
