"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
        <p className="text-gray-600 mb-2">
          Votre commande a bien été transmise au restaurant.
        </p>
        {isDemo && (
          <p className="text-sm text-orange-600 mb-6 font-medium">
            🎮 Mode Démo — aucun paiement réel n'a été effectué.
          </p>
        )}
        <div className="flex flex-col gap-3">
          <Link
            href={`/r/le-petit-bistro${isDemo ? "?demo=true" : ""}`}
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Retour au menu
          </Link>
          <Link
            href="/"
            className="inline-block text-gray-500 hover:text-gray-700 underline text-sm"
          >
            Retour à l'accueil MenuQR
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}
