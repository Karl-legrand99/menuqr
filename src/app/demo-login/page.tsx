"use client"

import { useEffect } from "react"

export default function DemoLoginPage() {
  useEffect(() => {
    // Utiliser localStorage pour le mode démo (plus fiable que les cookies cross-page)
    localStorage.setItem("demo-mode", "true")
    localStorage.setItem("next-auth.session-token", "demo-session")
    
    // Rediriger vers le dashboard
    window.location.href = "/dashboard"
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Connexion en mode démo...</p>
      </div>
    </div>
  )
}
