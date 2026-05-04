"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import DemoDashboard from "./DemoDashboard"

export default function DashboardContent() {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const demoParam = searchParams.get("demo") === "true"
    
    if (demoParam) {
      localStorage.setItem("demo-mode", "true")
    }
    
    const demoMode = localStorage.getItem("demo-mode") === "true"
    const sessionCookie = document.cookie.includes("next-auth.session-token")
    
    if (!sessionCookie && !demoMode) {
      router.push("/auth/signin")
    } else {
      setAuthorized(true)
    }
  }, [router, searchParams])

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  return <DemoDashboard />
}
