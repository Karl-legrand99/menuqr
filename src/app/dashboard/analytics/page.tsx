"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDemoMode } from "@/lib/demo"
import { demoAnalytics } from "@/lib/demoData"
import { supabase } from "@/lib/supabase"

function AnalyticsPageContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurant") || "2dfc6711-a74d-4249-ac2d-63137c2c308c"
  const { isDemo, checked } = useDemoMode()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!checked) return
    if (isDemo) {
      fetchSupabaseAnalytics()
      return
    }
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
    } else {
      setLoading(false)
    }
  }, [restaurantId, isDemo, checked])

  async function fetchSupabaseAnalytics() {
    try {
      // Fetch restaurant slug first
      const { data: restaurantData, error: restError } = await supabase
        .from("restaurants")
        .select("slug")
        .eq("id", restaurantId)
        .single()

      if (restError || !restaurantData) {
        setData(demoAnalytics)
        setLoading(false)
        return
      }

      const slug = restaurantData.slug

      // Total views
      const { count: totalViews, error: totalError } = await supabase
        .from("menu_views")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId)

      // Views today
      const today = new Date().toISOString().split("T")[0]
      const { count: viewsToday, error: todayError } = await supabase
        .from("menu_views")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId)
        .gte("created_at", today + "T00:00:00")

      // Views this week
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      const { count: viewsThisWeek, error: weekError } = await supabase
        .from("menu_views")
        .select("*", { count: "exact", head: true })
        .eq("restaurant_id", restaurantId)
        .gte("created_at", weekAgo)

      // Daily views (last 7 days)
      const days = []
      for (let i = 6; i >= 0; i--) {
        const date = new Date()
        date.setDate(date.getDate() - i)
        const dateStr = date.toISOString().split("T")[0]
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + 1)
        const { count } = await supabase
          .from("menu_views")
          .select("*", { count: "exact", head: true })
          .eq("restaurant_id", restaurantId)
          .gte("created_at", dateStr + "T00:00:00")
          .lt("created_at", nextDate.toISOString().split("T")[0] + "T00:00:00")
        days.push({ date: dateStr, views: count || 0 })
      }

      // Popular items
      const { data: viewsData, error: viewsError } = await supabase
        .from("menu_views")
        .select("item_id")
        .eq("restaurant_id", restaurantId)
        .not("item_id", "is", null)

      let popularItems: any[] = []
      if (viewsData && viewsData.length > 0) {
        const itemCounts: Record<string, number> = {}
        viewsData.forEach((v: any) => {
          itemCounts[v.item_id] = (itemCounts[v.item_id] || 0) + 1
        })
        const sorted = Object.entries(itemCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)

        const itemIds = sorted.map(([id]) => id)
        const { data: itemsData } = await supabase
          .from("items")
          .select("id, name")
          .in("id", itemIds)

        popularItems = sorted.map(([itemId, views]) => ({
          itemId,
          views,
          name: itemsData?.find((i: any) => i.id === itemId)?.name || "Inconnu",
        }))
      }

      setData({
        totalViews: totalViews || 0,
        viewsToday: viewsToday || 0,
        viewsThisWeek: viewsThisWeek || 0,
        dailyViews: days,
        popularItems,
      })
    } catch (err) {
      console.error("Supabase analytics error:", err)
      setData(demoAnalytics)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
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
  return (
    <Suspense fallback={
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 rounded animate-pulse w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-24 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    }>
      <AnalyticsPageContent />
    </Suspense>
  )
}
