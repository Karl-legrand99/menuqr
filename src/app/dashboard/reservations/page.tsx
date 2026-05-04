"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDemoMode } from "@/lib/demo"
import { demoReservations, demoTables, getDemoReservations, setDemoReservations } from "@/lib/demoData"
import { supabase } from "@/lib/supabase"

function ReservationsPageContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurant") || "2dfc6711-a74d-4249-ac2d-63137c2c308c"
  const { isDemo, checked } = useDemoMode()
  const [reservations, setReservations] = useState<any[]>([])
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [showTableForm, setShowTableForm] = useState(false)
  const [tableName, setTableName] = useState("")
  const [tableCapacity, setTableCapacity] = useState("")
  const [tablePosition, setTablePosition] = useState("")

  useEffect(() => {
    if (!checked) return
    if (isDemo) {
      fetchSupabaseData()
      return
    }
    if (restaurantId) {
      Promise.all([
        fetch(`/api/reservations?restaurantId=${restaurantId}`).then((res) => res.json()),
        fetch(`/api/restaurant/${restaurantId}/tables`).then((res) => res.json()),
      ])
        .then(([resData, tblData]) => {
          setReservations(Array.isArray(resData) ? resData : [])
          setTables(Array.isArray(tblData) ? tblData : [])
          setLoading(false)
        })
        .catch(() => {
          setReservations([])
          setTables([])
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [restaurantId, isDemo, checked])

  async function fetchSupabaseData() {
    try {
      const { data: resData, error: resError } = await supabase
        .from("reservations")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })

      if (resError) throw resError

      const { data: tblData, error: tblError } = await supabase
        .from("tables")
        .select("*")
        .eq("restaurant_id", restaurantId)

      if (tblError) throw tblError

      setReservations(resData || [])
      setTables(tblData || [])
    } catch (err) {
      console.error("Supabase reservations error:", err)
      setReservations(getDemoReservations())
      setTables(demoTables)
    }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    if (isDemo) {
      try {
        const { error } = await supabase
          .from("reservations")
          .update({ status })
          .eq("id", id)
        
        if (error) throw error
        
        setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      } catch (err) {
        console.error("Error updating reservation:", err)
        const updated = reservations.map((r) => (r.id === id ? { ...r, status } : r))
        setReservations(updated)
        setDemoReservations(updated)
      }
      return
    }
    const res = await fetch(`/api/reservations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    }
  }

  const assignTable = async (reservationId: string, tableId: string | null) => {
    if (isDemo) {
      try {
        const { error } = await supabase
          .from("reservations")
          .update({ table_id: tableId })
          .eq("id", reservationId)
        
        if (error) throw error
        
        const table = tableId ? tables.find((t) => t.id === tableId) || null : null
        setReservations((prev) => prev.map((r) =>
          r.id === reservationId
            ? { ...r, table_id: tableId || null, table }
            : r
        ))
      } catch (err) {
        console.error("Error assigning table:", err)
        const table = tableId ? tables.find((t) => t.id === tableId) || null : null
        const updated = reservations.map((r) =>
          r.id === reservationId
            ? { ...r, tableId: tableId || null, table }
            : r
        )
        setReservations(updated)
        setDemoReservations(updated)
      }
      return
    }
    const res = await fetch(`/api/reservations/${reservationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableId }),
    })
    if (res.ok) {
      const updated = await res.json()
      setReservations((prev) => prev.map((r) => (r.id === reservationId ? updated : r)))
    }
  }

  const createTable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!restaurantId && !isDemo) return
    if (!tableName || !tableCapacity) return
    if (isDemo) {
      try {
        const { data, error } = await supabase
          .from("tables")
          .insert({
            restaurant_id: restaurantId,
            name: tableName,
            capacity: parseInt(tableCapacity, 10),
            position: tablePosition || null
          })
          .select()
          .single()
        
        if (error) throw error
        
        setTables((prev) => [...prev, data])
        setTableName("")
        setTableCapacity("")
        setTablePosition("")
        setShowTableForm(false)
      } catch (err) {
        console.error("Error creating table:", err)
        const table = {
          id: "demo-table-" + Date.now(),
          name: tableName,
          capacity: parseInt(tableCapacity, 10),
          position: tablePosition || null,
          restaurantId: "demo-1",
        }
        setTables((prev) => [...prev, table])
        setTableName("")
        setTableCapacity("")
        setTablePosition("")
        setShowTableForm(false)
      }
      return
    }
    const res = await fetch(`/api/restaurant/${restaurantId}/tables`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: tableName,
        capacity: parseInt(tableCapacity, 10),
        position: tablePosition || null,
      }),
    })
    if (res.ok) {
      const table = await res.json()
      setTables((prev) => [...prev, table])
      setTableName("")
      setTableCapacity("")
      setTablePosition("")
      setShowTableForm(false)
    }
  }

  const filteredReservations =
    filter === "all" ? reservations : reservations.filter((r) => r.status === filter)

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  }

  const statusLabels: Record<string, string> = {
    pending: "En attente",
    confirmed: "Confirmée",
    cancelled: "Annulée",
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Réservations</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTableForm((prev) => !prev)}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
          >
            {showTableForm ? "Annuler" : "+ Nouvelle table"}
          </button>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
          >
            <option value="all">Toutes</option>
            <option value="pending">En attente</option>
            <option value="confirmed">Confirmées</option>
            <option value="cancelled">Annulées</option>
          </select>
        </div>
      </div>

      {showTableForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Ajouter une table</h2>
          <form onSubmit={createTable} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Terrasse 1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité</label>
              <input
                type="number"
                min={1}
                value={tableCapacity}
                onChange={(e) => setTableCapacity(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
              <input
                type="text"
                value={tablePosition}
                onChange={(e) => setTablePosition(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                placeholder="Ex: Terrasse"
              />
            </div>
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Ajouter
            </button>
          </form>
        </div>
      )}

      {tables.length > 0 && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">Tables disponibles</h2>
          <div className="flex flex-wrap gap-2">
            {tables.map((t) => (
              <span key={t.id} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                {t.name} ({t.capacity} pers.)
              </span>
            ))}
          </div>
        </div>
      )}

      {reservations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg shadow">
          <p className="text-gray-500">Aucune réservation pour le moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((reservation) => (
            <div key={reservation.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">
                      Réservation #{reservation.id.slice(-6).toUpperCase()}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[reservation.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusLabels[reservation.status] || reservation.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {new Date(reservation.createdAt).toLocaleString("fr-FR")}
                  </p>
                </div>
                <span className="text-lg font-bold text-orange-500">
                  {reservation.partySize} pers.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Client: </span>{reservation.customerName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Téléphone: </span>{reservation.customerPhone}
                  </p>
                  {reservation.customerEmail && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Email: </span>{reservation.customerEmail}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Date: </span>{reservation.date} à {reservation.time}
                  </p>
                  {reservation.notes && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes: </span>{reservation.notes}
                    </p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Assigner une table:</p>
                  <select
                    value={reservation.tableId || ""}
                    onChange={(e) => assignTable(reservation.id, e.target.value || null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
                  >
                    <option value="">— Aucune table —</option>
                    {tables.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.capacity} pers.)
                      </option>
                    ))}
                  </select>
                  {reservation.table && (
                    <p className="text-sm text-green-600 mt-1">
                      Table assignée: {reservation.table.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-gray-100">
                {reservation.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(reservation.id, "confirmed")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Confirmer
                    </button>
                    <button
                      onClick={() => updateStatus(reservation.id, "cancelled")}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Annuler
                    </button>
                  </>
                )}
                {reservation.status === "confirmed" && (
                  <button
                    onClick={() => updateStatus(reservation.id, "cancelled")}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Annuler
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

export default function ReservationsPage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Chargement...</div>}>
      <ReservationsPageContent />
    </Suspense>
  )
}
