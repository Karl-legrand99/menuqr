"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDemoMode } from "@/lib/demo"
import { demoOrders } from "@/lib/demoData"

function OrdersPageContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurant")
  const { isDemo, checked } = useDemoMode()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    if (!checked) return
    if (isDemo) {
      setOrders(demoOrders)
      setLoading(false)
      return
    }
    if (restaurantId) {
      fetch(`/api/orders?restaurantId=${restaurantId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrders(Array.isArray(data) ? data : [])
          setLoading(false)
        })
        .catch(() => {
          setOrders([])
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [restaurantId, isDemo, checked])

  const updateStatus = async (orderId: string, status: string) => {
    if (isDemo) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
      return
    }
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })

    if (res.ok) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      )
    }
  }

  const filteredOrders =
    filter === "all" ? orders : orders.filter((o) => o.status === filter)

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    completed: "Terminée",
    cancelled: "Annulée",
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Commandes</h1>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">Toutes</option>
          <option value="pending">En attente</option>
          <option value="confirmed">Confirmées</option>
          <option value="completed">Terminées</option>
          <option value="cancelled">Annulées</option>
        </select>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucune commande pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      Commande #{order.id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <span className="text-xl font-bold text-orange-500">
                  {order.total.toFixed(2)}€
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Client: </span>{order.customerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Téléphone: </span>{order.customerPhone}
                  </p>
                  {order.tableNumber && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Table: </span>{order.tableNumber}
                    </p>
                  )}
                  {order.notes && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes: </span>{order.notes}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Plats:</p>
                  <div className="space-y-1">
                    {(order.items as any[]).map((item: any, idx: number) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {item.name} x{item.quantity} — {(item.price * item.quantity).toFixed(2)}€
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {order.stripePaymentLink && (
                <p className="text-xs text-gray-500 mb-3">
                  Lien de paiement: {" "}
                  <a
                    href={order.stripePaymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Voir sur Stripe
                  </a>
                </p>
              )}

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                {order.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(order.id, "confirmed")}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "cancelled")}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Annuler
                    </button>
                  </>
                )}
                {order.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(order.id, "completed")}
                    className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                  >
                    Marquer comme terminée
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Chargement...</div>}>
      <OrdersPageContent />
    </Suspense>
  )
}
