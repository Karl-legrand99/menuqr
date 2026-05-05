"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { demoRestaurant, getDemoCategories, getDemoRestaurants } from "@/lib/demoData"
import { supabase } from "@/lib/supabase"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  categoryId: string
}

export default function OrderPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const slug = params.slug as string
  const isDemo = searchParams.get("demo") === "true"

  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<OrderItem[]>([])
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [tableNumber, setTableNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [showCartMobile, setShowCartMobile] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    if (isDemo) {
      loadDemoRestaurant(slug)
      return
    }

    fetch(`/api/menu/${slug}`, {
      headers: isDemo ? { "x-demo-mode": "true" } : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setRestaurant(null)
        } else {
          setRestaurant(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [slug, isDemo])

  async function loadDemoRestaurant(slug: string) {
    try {
      const { data: restaurantData, error: restError } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .single()

      if (!restError && restaurantData) {
        const { data: categoriesData } = await supabase
          .from("categories")
          .select("*")
          .eq("restaurant_id", restaurantData.id)
          .order("sort_order", { ascending: true })

        const categoryIds = categoriesData?.map((c: any) => c.id) || []
        const { data: itemsData } = await supabase
          .from("items")
          .select("*")
          .in("category_id", categoryIds)
          .eq("is_available", true)

        const categories = (categoriesData || []).map((cat: any) => ({
          ...cat,
          items: (itemsData || [])
            .filter((item: any) => item.category_id === cat.id)
            .map((item: any) => ({
              ...item,
              allergens: [],
              isHighlighted: item.popular || false,
              isAvailable: true,
            })),
        }))

        // If Supabase has items, use them. Otherwise fallback to mock data.
        const hasItems = categories.some((cat: any) => cat.items && cat.items.length > 0)
        if (hasItems) {
          setRestaurant({
            ...restaurantData,
            primaryColor: restaurantData.primary_color || "#FF6B35",
            secondaryColor: restaurantData.secondary_color || "#2C3E50",
            orderEnabled: restaurantData.order_enabled ?? true,
            categories,
          })
          setLoading(false)
          return
        }
        // Fall through to mock fallback if no items
      }
    } catch (err) {
      console.error("Supabase demo load error:", err)
    }

    // Fallback localStorage / mock
    const persistedRestaurants = getDemoRestaurants()
    const localRestaurant = persistedRestaurants.find((r: any) => r.slug === slug)
    const persistedCategories = getDemoCategories()

    if (localRestaurant) {
      setRestaurant({
        ...localRestaurant,
        primaryColor: localRestaurant.primaryColor || "#FF6B35",
        secondaryColor: localRestaurant.secondaryColor || "#2C3E50",
        orderEnabled: localRestaurant.orderEnabled ?? true,
        categories: persistedCategories.map((cat: any) => ({
          ...cat,
          items: cat.items.map((item: any) => ({
            ...item,
            allergens: [],
            isHighlighted: item.id === "demo-item-4" || item.id === "demo-item-7",
            isAvailable: true,
          })),
        })),
      })
    } else {
      setRestaurant({
        ...demoRestaurant,
        categories: persistedCategories.map((cat: any) => ({
          ...cat,
          items: cat.items.map((item: any) => ({
            ...item,
            allergens: [],
            isHighlighted: item.id === "demo-item-4" || item.id === "demo-item-7",
            isAvailable: true,
          })),
        })),
      })
    }
    setLoading(false)
  }

  const addToCart = (item: any) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id)
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
      }
      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          categoryId: item.categoryId,
        },
      ]
    })
  }

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId)
      if (existing && existing.quantity > 1) {
        return prev.map((i) => (i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i))
      }
      return prev.filter((i) => i.id !== itemId)
    })
  }

  const getItemQuantity = (itemId: string) => {
    const item = cart.find((i) => i.id === itemId)
    return item ? item.quantity : 0
  }

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (cart.length === 0) {
      setError("Veuillez sélectionner au moins un plat")
      return
    }
    if (!customerName.trim() || !customerPhone.trim()) {
      setError("Veuillez remplir votre nom et téléphone")
      return
    }

    setSubmitting(true)

    if (isDemo) {
      // Simulate demo order success and persist to localStorage
      const newOrderId = "demo-order-" + Date.now()
      const newOrder = {
        id: newOrderId,
        restaurantId: "demo-1",
        customerName,
        customerPhone,
        tableNumber: tableNumber ? parseInt(tableNumber, 10) : null,
        notes: notes || null,
        status: "pending",
        total,
        createdAt: new Date().toISOString(),
        items: cart.map((item) => ({ name: item.name, quantity: item.quantity, price: item.price })),
        stripePaymentLink: null,
      }
      const { getDemoOrders, setDemoOrders } = await import("@/lib/demoData")
      const updated = [newOrder, ...getDemoOrders()]
      setDemoOrders(updated)
      setOrderId(newOrderId)
      setOrderSuccess(true)
      setSubmitting(false)
      // Scroll to top
      window.scrollTo({ top: 0, behavior: "smooth" })
      return
    }

    try {
      // Create Stripe Payment Link
      const paymentLinkRes = await fetch("/api/stripe/payment-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          description: `Commande ${restaurant.name}`,
          restaurantName: restaurant.name,
        }),
      })

      let stripePaymentLink = null
      if (paymentLinkRes.ok) {
        const paymentLinkData = await paymentLinkRes.json()
        stripePaymentLink = paymentLinkData.url
      }

      // Create order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: restaurant.id,
          items: cart,
          total,
          customerName,
          customerPhone,
          tableNumber: tableNumber || null,
          notes: notes || null,
          stripePaymentLink,
        }),
      })

      if (!orderRes.ok) {
        const data = await orderRes.json()
        throw new Error(data.error || "Erreur lors de la création de la commande")
      }

      const order = await orderRes.json()

      // Redirect to Stripe Payment Link if available
      if (stripePaymentLink) {
        window.location.href = stripePaymentLink
      } else {
        setOrderId(order.id)
        setOrderSuccess(true)
      }
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
          <p className="text-gray-600">Ce menu n&apos;existe pas ou a été désactivé.</p>
        </div>
      </div>
    )
  }

  if (!restaurant.orderEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Commande non disponible</h1>
          <p className="text-gray-600 mb-4">Ce restaurant n&apos;accepte pas les commandes en ligne pour le moment.</p>
          <Link href={`/r/${slug}${isDemo ? "?demo=true" : ""}`} className="text-orange-500 hover:text-orange-600 underline">
            Retour au menu
          </Link>
        </div>
      </div>
    )
  }

  // Success state
  if (orderSuccess) {
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
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Commande confirmée !</h2>
            <p className="text-green-700 mb-2">
              Merci {customerName}, votre commande a bien été transmise au restaurant.
            </p>
            {orderId && (
              <p className="text-sm text-green-600 mb-6">N° de commande : <span className="font-mono font-bold">{orderId}</span></p>
            )}
            <div className="bg-white rounded-lg p-4 mb-6 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Récapitulatif</h3>
              <div className="space-y-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} x{item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span style={{ color: restaurant.primaryColor }}>{total.toFixed(2)}€</span>
              </div>
            </div>
            <Link
              href={`/r/${slug}${isDemo ? "?demo=true" : ""}`}
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
      {/* Header */}
      <header
        className="py-8 px-4 text-center"
        style={{
          background: `linear-gradient(135deg, ${restaurant.primaryColor}, ${restaurant.secondaryColor})`,
        }}
      >
        <h1 className="text-3xl font-bold text-white mb-1">{restaurant.name}</h1>
        <p className="text-white/80">Commander en ligne</p>
        {isDemo && (
          <div className="mt-2">
            <span className="inline-block bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-bold">
              🎮 Mode Démo
            </span>
          </div>
        )}
      </header>

      {/* Mobile cart sticky bar */}
      {cart.length > 0 && (
        <div className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🛒</span>
              <span className="font-semibold text-gray-900">{itemCount} article{itemCount > 1 ? "s" : ""}</span>
              <span className="font-bold" style={{ color: restaurant.primaryColor }}>{total.toFixed(2)}€</span>
            </div>
            <button
              onClick={() => setShowCartMobile(!showCartMobile)}
              className="text-sm font-medium px-3 py-1.5 rounded-lg text-white"
              style={{ backgroundColor: restaurant.primaryColor }}
            >
              {showCartMobile ? "Masquer" : "Voir le panier"}
            </button>
          </div>

          {/* Mobile cart drawer */}
          {showCartMobile && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <div className="space-y-2 pt-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.name} x{item.quantity}</span>
                    <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold">
                <span>Total</span>
                <span style={{ color: restaurant.primaryColor }}>{total.toFixed(2)}€</span>
              </div>
            </div>
          )}
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 py-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Menu Selection */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Sélectionner vos plats</h2>
            <div className="space-y-6">
              {restaurant.categories.map((category: any) => (
                <div key={category.id}>
                  <h3 className="font-semibold text-gray-800 mb-2 pb-1 border-b border-gray-200">{category.name}</h3>
                  <div className="space-y-2">
                    {category.items.map((item: any) => {
                      const qty = getItemQuantity(item.id)
                      return (
                        <div
                          key={item.id}
                          className={`flex justify-between items-center p-3 rounded-lg ${
                            item.isHighlighted ? "bg-orange-50 border border-orange-200" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.name}</h4>
                            {item.description && <p className="text-sm text-gray-600 truncate">{item.description}</p>}
                            <span className="text-orange-500 font-bold">{item.price.toFixed(2)}€</span>
                          </div>
                          <div className="flex items-center gap-2 ml-3 shrink-0">
                            {qty > 0 && (
                              <>
                                <button
                                  onClick={() => removeFromCart(item.id)}
                                  className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center text-lg"
                                  aria-label="Retirer"
                                >
                                  −
                                </button>
                                <span className="w-6 text-center font-semibold">{qty}</span>
                              </>
                            )}
                            <button
                              onClick={() => addToCart(item)}
                              className="w-8 h-8 rounded-full text-white flex items-center justify-center text-lg"
                              style={{ backgroundColor: restaurant.primaryColor }}
                              aria-label="Ajouter"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart & Form — desktop sticky, always visible */}
          <div className="hidden lg:block">
            <div className="sticky top-20">
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Votre commande</h2>
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aucun plat sélectionné</p>
                ) : (
                  <div className="space-y-2">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span>
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                      </div>
                    ))}
                    <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span style={{ color: restaurant.primaryColor }}>{total.toFixed(2)}€</span>
                    </div>
                  </div>
                )}
              </div>

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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de table</label>
                  <input
                    type="text"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    placeholder="Ex: 12"
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
                  disabled={submitting || cart.length === 0}
                  className="w-full py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: restaurant.primaryColor }}
                >
                  {submitting ? "Traitement..." : `Commander et payer ${total.toFixed(2)}€`}
                </button>

                <Link
                  href={`/r/${slug}${isDemo ? "?demo=true" : ""}`}
                  className="block text-center text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  Retour au menu
                </Link>
              </form>
            </div>
          </div>

          {/* Mobile form — below menu */}
          <div className="lg:hidden">
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3">Votre commande</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">Aucun plat sélectionné</p>
              ) : (
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x{item.quantity}
                      </span>
                      <span className="font-medium">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span style={{ color: restaurant.primaryColor }}>{total.toFixed(2)}€</span>
                  </div>
                </div>
              )}
            </div>

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
                <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de table</label>
                <input
                  type="text"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  placeholder="Ex: 12"
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
                disabled={submitting || cart.length === 0}
                className="w-full py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                style={{ backgroundColor: restaurant.primaryColor }}
              >
                {submitting ? "Traitement..." : `Commander et payer ${total.toFixed(2)}€`}
              </button>

              <Link
                href={`/r/${slug}${isDemo ? "?demo=true" : ""}`}
                className="block text-center text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Retour au menu
              </Link>
            </form>
          </div>
        </div>
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
