"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { getDemoRestaurants, setDemoRestaurants } from "@/lib/demoData"
import { supabase } from "@/lib/supabase"

export default function DemoDashboard() {
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const isDemo = localStorage.getItem("demo-mode") === "true"
    if (isDemo) {
      loadDemoRestaurants()
      return
    }

    fetch("/api/restaurant")
      .then((res) => res.json())
      .then((data) => {
        setRestaurants(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => {
        setRestaurants([])
        setLoading(false)
      })
  }, [])

  async function loadDemoRestaurants() {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from("restaurants")
        .select("*")
        .eq("user_id", "demo-user")
        .order("created_at", { ascending: false })

      if (!error && data && data.length > 0) {
        const mapped = data.map((r: any) => ({
          ...r,
          primaryColor: r.primary_color || "#FF6B35",
          secondaryColor: r.secondary_color || "#2C3E50",
          orderEnabled: r.order_enabled ?? true,
        }))
        setRestaurants(mapped)
        // Also persist to localStorage for offline fallback
        setDemoRestaurants(mapped)
        setLoading(false)
        return
      }
    } catch (err) {
      console.error("Supabase demo restaurants error:", err)
    }

    // Fallback to localStorage
    const local = getDemoRestaurants()
    setRestaurants(local)
    setLoading(false)
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mes Restaurants</h1>
        <Link
          href="/dashboard/restaurant/new"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 text-sm sm:text-base w-full sm:w-auto text-center"
        >
          + Nouveau Restaurant
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-12 sm:py-20 bg-white rounded-lg shadow px-4">
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de restaurant</p>
          <Link
            href="/dashboard/restaurant/new"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 inline-block"
          >
            Créer mon premier menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {restaurants.map((restaurant: any) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-4 text-sm">{restaurant.description || "Pas de description"}</p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/dashboard/menu?restaurant=${restaurant.id}`}
                  className="bg-orange-500 text-white px-3 py-2 rounded hover:bg-orange-600 text-sm"
                >
                  Gérer le menu
                </Link>
                <Link
                  href={`/dashboard/orders?restaurant=${restaurant.id}`}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Commandes
                </Link>
                <Link
                  href={`/r/${restaurant.slug}${localStorage.getItem("demo-mode") === "true" ? "?demo=true" : ""}`}
                  target="_blank"
                  className="bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 text-sm"
                >
                  Voir le menu
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
