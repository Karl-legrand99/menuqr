"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { SkeletonCard, SkeletonText } from "@/components/Skeleton"

function AnalyticsPageContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurant")
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (restaurantId) {
      fetch(`/api/restaurant`)
        .then((res) => res.json())
        .then((restaurants) => {
          const restaurant = restaurants.find((r: any) => r.id === restaurantId)
          if (restaurant) {
            fetch(`/api/analytics/${restaurant.slug}`)
              .then((res) => res.json())
              .then((analytics) => {
                setData(analytics)
                setLoading(false)
              })
              .catch(() => setLoading(false))
          } else {
            setLoading(false)
          }
        })
        .catch(() => setLoading(false))
    }
  }, [restaurantId])

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonText lines={1} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow">
        <p className="text-gray-500 mb-4">Sélectionnez un restaurant dans le Dashboard</p>
        <a href="/dashboard" className="text-orange-500 hover:underline">Retour au Dashboard</a>
      </div>
    )
  }

  const maxViews = Math.max(...(data.dailyViews || []).map((d: any) => d.views), 1)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Vues totales</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalViews || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Vues aujourd'hui</p>
          <p className="text-3xl font-bold text-orange-500">{data.viewsToday || 0}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-sm text-gray-500 mb-1">Vues cette semaine</p>
          <p className="text-3xl font-bold text-green-500">{data.viewsThisWeek || 0}</p>
        </div>
      </div>

      {/* Daily Views Chart */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Vues par jour (7 derniers jours)</h2>
        {data.dailyViews && data.dailyViews.length > 0 ? (
          <div className="flex items-end gap-2 h-48">
            {data.dailyViews.map((day: any) => (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-orange-500 rounded-t transition-all hover:bg-orange-600"
                  style={{ height: `${(day.views / maxViews) * 100}%`, minHeight: day.views > 0 ? 4 : 0 }}
                />
                <span className="text-xs text-gray-500">{day.date.slice(5)}</span>
                <span className="text-xs font-medium text-gray-700">{day.views}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
        )}
      </div>

      {/* Popular Items */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Plats les plus consultés</h2>
        {data.popularItems && data.popularItems.length > 0 ? (
          <div className="space-y-3">
            {data.popularItems.map((item: any) => (
              <div key={item.itemId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="text-sm text-orange-500 font-medium">{item.views} vues</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">Aucune donnée disponible</p>
        )}
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  return <AnalyticsPageContent />
}
