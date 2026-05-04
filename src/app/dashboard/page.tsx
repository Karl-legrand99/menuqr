"use client"

import { Suspense } from "react"
import DashboardContent from "./DashboardContent"

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  )
}
