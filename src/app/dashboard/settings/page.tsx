"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDemoMode } from "@/lib/demo"
import { demoRestaurant, demoSubscription } from "@/lib/demoData"

function SettingsPageContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurant")
  const { isDemo, checked } = useDemoMode()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!checked) return
    if (isDemo) {
      setRestaurant(demoRestaurant)
      setSubscription(demoSubscription)
      setLoading(false)
      return
    }
    if (restaurantId) {
      fetch("/api/restaurant")
        .then((res) => res.json())
        .then((data) => {
          const r = data.find((r: any) => r.id === restaurantId)
          setRestaurant(r || null)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }

    // Fetch subscription info
    fetch("/api/stripe/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setSubscription(data)
      })
      .catch(() => {})
  }, [restaurantId, isDemo, checked])

  const handleToggleOrder = async () => {
    if (!restaurant) return
    setSaving(true)
    setMessage("")

    if (isDemo) {
      const updated = { ...restaurant, orderEnabled: !restaurant.orderEnabled }
      setRestaurant(updated)
      setMessage(updated.orderEnabled ? "Commandes en ligne activées !" : "Commandes en ligne désactivées.")
      setSaving(false)
      return
    }

    const res = await fetch(`/api/restaurant/${restaurant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderEnabled: !restaurant.orderEnabled }),
    })

    if (res.ok) {
      const updated = await res.json()
      setRestaurant(updated)
      setMessage(updated.orderEnabled ? "Commandes en ligne activées !" : "Commandes en ligne désactivées.")
    } else {
      setMessage("Erreur lors de la mise à jour.")
    }
    setSaving(false)
  }

  const handleManageSubscription = async () => {
    if (isDemo) {
      alert("Mode démo : pas de portail Stripe disponible")
      return
    }
    setPortalLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      if (!res.ok) {
        const data = await res.json()
        alert(data.error || "Erreur lors de l'ouverture du portail Stripe")
        return
      }
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (err) {
      alert("Erreur réseau")
    } finally {
      setPortalLoading(false)
    }
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  if (!restaurant) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow">
        <p className="text-gray-500 mb-4">Sélectionnez un restaurant dans le Dashboard</p>
        <a href="/dashboard" className="text-orange-500 hover:underline">Retour au Dashboard</a>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Paramètres — {restaurant.name}</h1>

      {message && (
        <div className={`mb-4 p-3 rounded-lg ${message.includes("Erreur") ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          {message}
        </div>
      )}

      {/* Subscription Card */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Abonnement</h2>
        {subscription ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-700 font-medium">Plan actuel</p>
                <p className="text-sm text-gray-500 capitalize">{subscription.plan || "Basic"} — {subscription.status === "active" ? "Actif" : subscription.status}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {subscription.status === "active" ? "Actif" : subscription.status}
              </span>
            </div>
            {subscription.currentPeriodEnd && (
              <p className="text-sm text-gray-500">
                Prochaine facturation : {new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR")}
              </p>
            )}
            <button
              onClick={handleManageSubscription}
              disabled={portalLoading}
              className="mt-2 bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
            >
              {portalLoading ? "Chargement..." : "Gérer mon abonnement (Stripe)"}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-gray-600">Vous êtes sur le plan gratuit.</p>
            <a href="/pricing" className="inline-block bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600">
              Passer à un plan payant
            </a>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Commandes en ligne</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-700 font-medium">Activer les commandes en ligne</p>
            <p className="text-sm text-gray-500">
              Permet aux clients de commander et payer directement depuis le menu (nécessite le plan Pro ou Premium).
            </p>
          </div>
          <button
            onClick={handleToggleOrder}
            disabled={saving}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              restaurant.orderEnabled ? "bg-orange-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                restaurant.orderEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Informations du restaurant</h2>
        <div className="space-y-3">
          <p className="text-gray-700"><span className="font-medium">Nom:</span> {restaurant.name}</p>
          <p className="text-gray-700"><span className="font-medium">Slug:</span> {restaurant.slug}</p>
          <p className="text-gray-700"><span className="font-medium">Description:</span> {restaurant.description || "—"}</p>
          <p className="text-gray-700"><span className="font-medium">Téléphone:</span> {restaurant.phone || "—"}</p>
          <p className="text-gray-700"><span className="font-medium">Adresse:</span> {restaurant.address || "—"}</p>
          <p className="text-gray-700"><span className="font-medium">Actif:</span> {restaurant.isActive ? "Oui" : "Non"}</p>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Chargement...</div>}>
      <SettingsPageContent />
    </Suspense>
  )
}
