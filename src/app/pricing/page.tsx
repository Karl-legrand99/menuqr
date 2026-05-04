"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useTranslation } from "@/i18n/I18nContext"
import LanguageSelector from "@/i18n/LanguageSelector"

export default function PricingPage() {
  const { t } = useTranslation()
  const [loading, setLoading] = useState<string | null>(null)
  const [prices, setPrices] = useState<{ basic?: string; pro?: string; premium?: string }>({})

  const pricing = t("landing.pricing") as Record<string, string>

  useEffect(() => {
    fetch("/api/stripe/prices")
      .then((res) => res.json())
      .then((data) => setPrices(data.prices || {}))
      .catch(() => {})
  }, [])

  const handleSubscribe = async (plan: string) => {
    const priceId = prices[plan as keyof typeof prices]
    if (!priceId) {
      // Fallback: redirect to signin if Stripe not configured
      window.location.href = "/auth/signin"
      return
    }

    setLoading(plan)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      })

      if (!res.ok) {
        const data = await res.json()
        if (res.status === 401) {
          window.location.href = "/auth/signin"
          return
        }
        alert(data.error || "Erreur lors de la création de la session de paiement")
        return
      }

      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      alert("Erreur réseau. Veuillez réessayer.")
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">MenuQR</Link>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <Link href="/auth/signin" className="bg-white text-orange-600 px-4 py-2 rounded-lg font-medium">
              {String(t("landing.nav.signin") || "Connexion")}
            </Link>
          </div>
        </nav>
      </header>

      {/* Pricing */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
            {String(pricing.title || "Tarifs")}
          </h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            14 jours d'essai gratuit sur tous les plans. Annulation à tout moment.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Basic */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pricing.basic_name}</h3>
              <p className="text-gray-600 mb-6">{pricing.basic_desc}</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {pricing.basic_price}<span className="text-lg text-gray-500">{pricing.basic_period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.basic_feature1}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.basic_feature2}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.basic_feature3}</li>
                <li className="flex items-center"><span className="text-gray-400 mr-2">✗</span> {pricing.basic_feature4}</li>
              </ul>
              <button
                onClick={() => handleSubscribe("basic")}
                disabled={loading === "basic"}
                className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
              >
                {loading === "basic" ? "Chargement..." : pricing.basic_cta}
              </button>
            </div>

            {/* Pro */}
            <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-orange-500 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                {pricing.pro_badge}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pricing.pro_name}</h3>
              <p className="text-gray-600 mb-6">{pricing.pro_desc}</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {pricing.pro_price}<span className="text-lg text-gray-500">{pricing.pro_period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.pro_feature1}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.pro_feature2}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.pro_feature3}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.pro_feature4}</li>
              </ul>
              <button
                onClick={() => handleSubscribe("pro")}
                disabled={loading === "pro"}
                className="block w-full text-center bg-orange-500 text-white py-3 rounded-lg font-medium hover:bg-orange-600 disabled:opacity-50"
              >
                {loading === "pro" ? "Chargement..." : pricing.pro_cta}
              </button>
            </div>

            {/* Premium */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{pricing.premium_name}</h3>
              <p className="text-gray-600 mb-6">{pricing.premium_desc}</p>
              <div className="text-4xl font-bold text-gray-900 mb-6">
                {pricing.premium_price}<span className="text-lg text-gray-500">{pricing.premium_period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.premium_feature1}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.premium_feature2}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.premium_feature3}</li>
                <li className="flex items-center"><span className="text-green-500 mr-2">✓</span> {pricing.premium_feature4}</li>
              </ul>
              <button
                onClick={() => handleSubscribe("premium")}
                disabled={loading === "premium"}
                className="block w-full text-center bg-gray-100 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-200 disabled:opacity-50"
              >
                {loading === "premium" ? "Chargement..." : pricing.premium_cta}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          {(t("landing.faq") as Record<string, string>).title}
        </h2>
        <div className="space-y-4">
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">{(t("landing.faq") as Record<string, string>).q1}</summary>
            <p className="mt-4 text-gray-600">{(t("landing.faq") as Record<string, string>).a1}</p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">{(t("landing.faq") as Record<string, string>).q2}</summary>
            <p className="mt-4 text-gray-600">{(t("landing.faq") as Record<string, string>).a2}</p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">{(t("landing.faq") as Record<string, string>).q3}</summary>
            <p className="mt-4 text-gray-600">{(t("landing.faq") as Record<string, string>).a3}</p>
          </details>
          <details className="bg-white rounded-lg shadow p-6">
            <summary className="font-semibold cursor-pointer">{(t("landing.faq") as Record<string, string>).q4}</summary>
            <p className="mt-4 text-gray-600">{(t("landing.faq") as Record<string, string>).a4}</p>
          </details>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-400 py-8 text-center">
        <p>{t("landing.footer") as string}</p>
      </footer>
    </div>
  )
}
