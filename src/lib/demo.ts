"use client"

import { useState, useEffect } from "react"

export function useDemoMode() {
  const [isDemo, setIsDemo] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const demo = localStorage.getItem("demo-mode") === "true"
    setIsDemo(demo)
    setChecked(true)
  }, [])

  return { isDemo, checked }
}
