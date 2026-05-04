"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"

function QRCodePageContent() {
  const searchParams = useSearchParams()
  const restaurantId = searchParams.get("restaurant")
  const [qrCode, setQrCode] = useState("")
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (restaurantId) {
      fetch("/api/restaurant")
        .then((res) => res.json())
        .then((data) => {
          const rest = data.find((r: any) => r.id === restaurantId)
          if (rest) {
            setRestaurant(rest)
            fetch(`/api/qr/${rest.slug}`)
              .then((res) => res.json())
              .then((qrData) => {
                setQrCode(qrData.qrCode)
                setLoading(false)
              })
          }
        })
    }
  }, [restaurantId])

  const downloadQR = () => {
    const link = document.createElement("a")
    link.href = qrCode
    link.download = `menu-qr-${restaurant?.slug}.png`
    link.click()
  }

  if (loading) return <div className="text-center py-10">Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">QR Code Menu</h1>

      {qrCode && (
        <div className="bg-white rounded-lg shadow p-8">
          <img src={qrCode} alt="QR Code" className="mx-auto mb-6 w-64 h-64" />
          
          <p className="text-gray-600 mb-4">
            Scannez ce QR code pour voir le menu de <strong>{restaurant?.name}</strong>
          </p>
          
          <p className="text-sm text-gray-500 mb-6">
            URL: menuqr.fr/r/{restaurant?.slug}
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={downloadQR}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
            >
              Télécharger PNG
            </button>
            <a
              href={`/r/${restaurant?.slug}`}
              target="_blank"
              className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200"
            >
              Voir le menu
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default function QRCodePage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Chargement...</div>}>
      <QRCodePageContent />
    </Suspense>
  )
}
