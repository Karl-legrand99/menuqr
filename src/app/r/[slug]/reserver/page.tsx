"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

export default function ReservationPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [restaurant, setRestaurant] = useState<any>(null)
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [partySize, setPartySize] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    if (slug) {
      Promise.all([
        fetch(`/api/menu/${slug}`).then((res) => res.json()),
        fetch(`/api/restaurant/${slug}/tables`).catch(() => null),
      ])
        .then(([menuData, tablesRes]) => {
          if (menuData.error) {
            setRestaurant(null)
          } else {
            setRestaurant(menuData)
          }
          if (tablesRes && tablesRes.ok) {
            tablesRes.json().then((t: any) => setTables(Array.isArray(t) ? t : [])).catch(() => setTables([]))
          } else {
            setTables([])
          }
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    }
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!customerName.trim() || !customerPhone.trim() || !date || !time || !partySize) {
      setError("Veuillez remplir tous les champs obligatoires")
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          customerName,
          customerPhone,
          customerEmail: customerEmail || null,
          date,
          time,
          partySize: parseInt(partySize, 10),
          notes: notes || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Erreur lors de la réservation")
      }

      setSuccess(true)
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue")
    } finally {
      setSubmitting(false)
    }
  }

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

  if (success) {
    return (
      <div className="min-h-screen bg-white">
        <header
          className="py-8 px-4 text-center"
          style={{
            background: `linear-gradient(135deg, ${restaurant.primaryColor}, ${restaurant.secondaryColor})`,
          }}
        >
          <h1 className="text-3xl font-bold text-white mb-1">{restaurant.name}</h1>
        </header>
        <main className="max-w-xl mx-auto px-4 py-12 text-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Réservation envoyée !</h2>
            <p className="text-green-700 mb-6">
              Votre demande de réservation a bien été transmise au restaurant. Vous serez contacté pour confirmation.
            </p>
            <Link
              href={`/r/${slug}`}
              className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600"
            >
              Retour au menu
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header
        className="py-8 px-4 text-center"
        style={{
          background: `linear-gradient(135deg, ${restaurant.primaryColor}, ${restaurant.secondaryColor})`,
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">{restaurant.name}</h1>
        <p className="text-white/80">Réserver une table</p>
      </header>

      <main className="max-w-xl mx-auto px-4 py-6 pb-12">
        {tables.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Tables disponibles</h2>
            <div className="flex flex-wrap gap-2">
              {tables.map((t) => (
                <span key={t.id} className="px-3 py-1 bg-white rounded-full text-sm text-gray-700 border border-gray-200">
                  {t.name} ({t.capacity} pers.)
                </span>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900">Vos informations</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Votre nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
            <input
              type="tel"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Votre numéro de téléphone"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="votre@email.com"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure *</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de personnes *</label>
            <input
              type="number"
              min={1}
              max={50}
              value={partySize}
              onChange={(e) => setPartySize(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="4"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              placeholder="Instructions spéciales..."
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
            style={{ backgroundColor: restaurant.primaryColor }}
          >
            {submitting ? "Envoi..." : "Demander une réservation"}
          </button>

          <Link
            href={`/r/${slug}`}
            className="block text-center text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Retour au menu
          </Link>
        </form>
      </main>

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
