"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

export default function DashboardPage() {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mes Restaurants</h1>
        <Link
          href="/dashboard/restaurant/new"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
        >
          + Nouveau Restaurant
        </Link>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Vous n'avez pas encore de restaurant</p>
          <Link
            href="/dashboard/restaurant/new"
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Créer mon premier menu
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant: any) => (
            <div key={restaurant.id} className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
              <p className="text-gray-600 mb-4">{restaurant.description || "Pas de description"}</p>
              <div className="flex space-x-2">
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
                  href={`/r/${restaurant.slug}`}
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
